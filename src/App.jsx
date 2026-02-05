import "./styles/theme.css";
import "./styles/global.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router"; 
import { useContext } from "react";

// Imports corrigidos
import { Header } from "./components/Header";
import { CartProvider } from "./context/CartContext";
import { SessionProvider, SessionContext } from "./context/SessionContext";
import { ProductList } from "./components/ProductList";
import { Cart } from "./components/Cart";
import { Login } from "./components/Login";
import { Signup } from "./components/Singup"; 
import { Estoque } from "./components/Estoque";
import { User } from "./components/User";

// Importação das páginas de Checkout
import { Confirmacao } from "./pages/Confirmacao";
import { ConfirmacaoDados } from "./pages/ConfirmacaoDados";
import { AdminConfiguracao } from "./pages/AdminConfiguracao";

function AppRoutes() {
  const { session, sessionLoading } = useContext(SessionContext);

  // Evita a tela branca enquanto o Supabase carrega
  if (sessionLoading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Carregando...</div>;
  }

  return (
    <>
      {/* O Header só aparece se o usuário estiver logado */}
      {session && <Header />}
      
      <Routes>
        <Route 
          path="/" 
          element={session ? <Navigate to="/products" replace /> : <Login />} 
        />
        <Route 
          path="/products" 
          element={session ? <ProductList /> : <Navigate to="/" replace />} 
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/stock" element={<Estoque />} />
        <Route path="/user" element={<User />} />
        
        {/* ROTA 1: Tela de endereço (Onde preenche os dados) */}
        <Route path="/confirmar-dados" element={<ConfirmacaoDados />} />
        
        {/* ROTA 2: Tela de agradecimento (Sucesso) */}
        <Route path="/confirmacao" element={<Confirmacao />} />
        
        <Route path="/admin/configuracao" element={<AdminConfiguracao />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <>
      <ToastContainer autoClose={3000} />
      <SessionProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </SessionProvider>
    </>
  );
}