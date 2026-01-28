import "./styles/theme.css";
import "./styles/global.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Routes, Route } from "react-router";

import { Header } from "./components/Header";
import { CartProvider } from "./context/CartContext";
import { SessionProvider } from "./context/SessionContext";

import { ProductList } from "./components/ProductList";
import { Cart } from "./components/Cart";
import { Login } from "./components/Login";
import { Signup } from "./components/Singup";
import { Estoque } from "./components/Estoque";
import { User } from "./components/User";

import { Confirmacao } from "./pages/Confirmacao";
import { ConfirmacaoDados } from "./pages/ConfirmacaoDados";
import { AdminConfiguracao } from "./pages/AdminConfiguracao";


if (typeof window !== "undefined" && window.location.hostname.includes("hzyck8wnh")) {
  window.location.replace("https://ppi2025-4inf2v-yykm.vercel.app");
} 

if (typeof window !== "undefined") {
  const urlAtual = window.location.href;
  
  // Se o usuário entrar pelo link do BANNER (o v2 com código estranho)
  if (urlAtual.includes("hzyck8wnh")) {
    // Manda ele IMEDIATAMENTE para o link que funciona (v3)
    window.location.replace("https://ppi2025-4inf2v-yykm.vercel.app");
  }
}

export default function App() {
  return (
    <>
      <ToastContainer />

      <SessionProvider>
        <CartProvider>
          <Header />

          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/stock" element={<Estoque />} />
            <Route path="/user" element={<User />} />

            <Route path="/confirmacao" element={<Confirmacao />} />
            <Route path="/confirmar-dados" element={<ConfirmacaoDados />} />

            {/* ADMIN */}
            <Route path="/admin/configuracao" element={<AdminConfiguracao />} />
          </Routes>
        </CartProvider>
      </SessionProvider>
    </>
  );
}
