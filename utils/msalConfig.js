const MSAL_CONFIGURATION = {
    auth: {
      clientId: "48103e66-de99-48b5-9b96-6b97aa2aeaca", // clientId
      tenantId: "2b197efa-8e1b-4680-b263-8e237889b5b3", // tenantId
      authority: "https://login.microsoftonline.com/2b197efa-8e1b-4680-b263-8e237889b5b3", 
      postLogoutRedirectUri: "/"
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
};

module.exports = {MSAL_CONFIGURATION};