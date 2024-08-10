import React from "react";
import * as ReactDOMClient from "react-dom/client";
import "./index.css";

import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import { requestedScopes } from "./constants";
import CartContextProvider from "./components/cartItem/CartContext";

const container = document.getElementById("root");

const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <CartContextProvider>
          <App />
        </CartContextProvider>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);
