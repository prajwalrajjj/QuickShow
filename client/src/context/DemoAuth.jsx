import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AuthModal from "../components/AuthModal";

const DemoAuthContext = createContext(null);
const USERS_KEY = "quickshow-users";
const SESSION_KEY = "quickshow-session";

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
};

const toPublicUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  firstName: user.fullName.split(" ")[0],
  imageUrl: user.imageUrl,
  primaryEmailAddress: { emailAddress: user.email },
});

export const DemoAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    const found = readUsers().find((item) => item.id === sessionId);
    return found ? toPublicUser(found) : null;
  });
  const [authOpen, setAuthOpen] = useState(false);

  const signUp = ({ name, email, password }) => {
    const users = readUsers();
    if (users.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
      toast.error("An account with this email already exists. Please login.");
      return;
    }
    const nextUser = {
      id: `user-${Date.now()}`,
      fullName: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F84565&color=fff`,
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, nextUser]));
    localStorage.setItem(SESSION_KEY, nextUser.id);
    setUser(toPublicUser(nextUser));
    setAuthOpen(false);
    toast.success(`Welcome, ${nextUser.fullName}`);
  };

  const signIn = ({ email, password }) => {
    const found = readUsers().find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
    );
    if (!found) {
      toast.error("Invalid email or password. Sign up if you are new.");
      return;
    }
    localStorage.setItem(SESSION_KEY, found.id);
    setUser(toPublicUser(found));
    setAuthOpen(false);
    toast.success(`Welcome back, ${found.fullName}`);
  };

  const value = useMemo(
    () => ({
      user,
      isLoaded: true,
      openSignIn: () => setAuthOpen(true),
      signOut: () => {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
        toast.success("Signed out");
      },
    }),
    [user]
  );

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSignIn={signIn} onSignUp={signUp} />}
    </DemoAuthContext.Provider>
  );
};

export const useDemoAuth = () => useContext(DemoAuthContext);

export const DemoUserButton = () => {
  const { user, signOut } = useDemoAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button onClick={() => setOpen((prev) => !prev)} className="rounded-full">
        <img src={user.imageUrl} alt={user.fullName} className="w-8 h-8 rounded-full" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-lg bg-[#1c1c1e] border border-gray-800 p-2 z-50">
          <p className="px-2 py-1 text-sm">{user.fullName}</p>
          <p className="px-2 pb-2 text-xs text-gray-400">{user.primaryEmailAddress.emailAddress}</p>
          <button onClick={() => (window.location.href = "/my-bookings")} className="w-full text-left px-2 py-1.5 text-sm hover:bg-white/5 rounded">
            My Bookings
          </button>
          <button onClick={() => (window.location.href = "/favorite")} className="w-full text-left px-2 py-1.5 text-sm hover:bg-white/5 rounded">
            Favorites
          </button>
          <button onClick={() => (window.location.href = "/admin")} className="w-full text-left px-2 py-1.5 text-sm hover:bg-white/5 rounded">
            Admin
          </button>
          <button
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="w-full text-left px-2 py-1.5 text-sm hover:bg-white/5 rounded"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};
