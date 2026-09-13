import { createContext, useContext } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { DemoUserButton, useDemoAuth } from "./DemoAuth";

export const AuthContext = createContext(null);

export const ClerkAuthAdapter = ({ children }) => {
  const { user } = useUser();
  const { openSignIn, session } = useClerk();

  return (
    <AuthContext.Provider
      value={{
        user,
        openSignIn,
        getToken: async () => session?.getToken(),
        mode: "clerk",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const DemoAuthAdapter = ({ children }) => {
  const demo = useDemoAuth();

  return (
    <AuthContext.Provider
      value={{
        user: demo.user,
        openSignIn: demo.openSignIn,
        getToken: async () => "demo-token",
        mode: "demo",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext) || {
    user: null,
    openSignIn: () => {},
    getToken: async () => "",
    mode: "demo",
  };

export { DemoUserButton };
