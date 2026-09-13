import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import { DemoAuthProvider } from "./context/DemoAuth.jsx";
import { ClerkAuthAdapter, DemoAuthAdapter } from "./context/AuthContext.jsx";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const Root = ({ Adapter }) => (
  <Adapter>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </Adapter>
);

createRoot(document.getElementById("root")).render(
  clerkKey ? (
    <ClerkProvider publishableKey={clerkKey}>
      <Root Adapter={ClerkAuthAdapter} />
    </ClerkProvider>
  ) : (
    <DemoAuthProvider>
      <Root Adapter={DemoAuthAdapter} />
    </DemoAuthProvider>
  )
);
