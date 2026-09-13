import { useState } from "react";
import { XIcon } from "lucide-react";

const AuthModal = ({ onClose, onSignIn, onSignUp }) => {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (tab === "signup") {
      onSignUp({ name, email, password });
    } else {
      onSignIn({ email, password });
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-md bg-[#151518] border border-white/10 rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{tab === "login" ? "Welcome back" : "Create account"}</h2>
          <button type="button" onClick={onClose} className="cursor-pointer">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 mb-6 bg-white/5 rounded-full p-1">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`py-2 rounded-full text-sm cursor-pointer ${tab === "login" ? "bg-primary" : ""}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`py-2 rounded-full text-sm cursor-pointer ${tab === "signup" ? "bg-primary" : ""}`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {tab === "signup" && (
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none"
            />
          )}
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none"
          />
          <input
            required
            type="password"
            minLength={4}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 outline-none"
          />
          <button type="submit" className="w-full bg-primary hover:bg-primary-dull py-3 rounded-lg font-medium cursor-pointer">
            {tab === "login" ? "Login" : "Create account"}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-4 text-center">
          Anyone can create an account. Your bookings stay on this device.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
