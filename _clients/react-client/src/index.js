import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { MSAL_CONFIGURATION } from "./data/clientConfiguration";
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from "@azure/msal-react";
export const UserContext = createContext([]);

const root = ReactDOM.createRoot(document.getElementById("root"));

const msalInstance = new PublicClientApplication(MSAL_CONFIGURATION);

// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  msalInstance.setActiveAccount(msalInstance.getActiveAccount()[0]);
}

const ContextWrapper = () => {
  const [user, setUser] = useState({roles:[]});

  return (
    <UserContext.Provider value={[user, setUser]}>
      <App />
    </UserContext.Provider>
  );
}

root.render(
  <MsalProvider instance={msalInstance}>
    <BrowserRouter>
      <ContextWrapper />
    </BrowserRouter>
  </MsalProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
