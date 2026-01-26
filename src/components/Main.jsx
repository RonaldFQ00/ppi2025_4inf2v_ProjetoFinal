// src/main.jsx ou similar
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SessionProvider } from "./context/SessionContext";
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SessionProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </SessionProvider>
  </React.StrictMode>
);