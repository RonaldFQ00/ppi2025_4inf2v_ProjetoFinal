import styles from "./Header.module.css";
import { ShoppingBasket, Settings, User } from "lucide-react";
import { Link } from "react-router";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { SessionContext } from "../context/SessionContext";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { cart } = useContext(CartContext);
  const { session } = useContext(SessionContext);

  const isAdmin = session?.user?.user_metadata?.admin;
  
  // Lógica aprimorada: 
  // 1. Tenta o 'username' (que você configurou no SessionContext)
  // 2. Tenta o 'display_name'
  // 3. Se não houver nenhum, pega o email mas remove o "@..." para não ficar feio
  const userName = session?.user?.user_metadata?.username || 
                   session?.user?.user_metadata?.display_name || 
                   session?.user?.email?.split('@')[0];

  return (
    <header className={styles.container}>
      {/* TÍTULO DA LOJA E NOME DO USUÁRIO */}
      <div>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>TJR MEGASTORE</h1>
        </Link>
        {session && (
          <Link to="/user" className={styles.welcomeMessage}>
             @{userName}
          </Link>
        )}
      </div>

      <div className={styles.actions}>
        <ThemeToggle />

        {/* CARRINHO */}
        <Link to="/cart" className={styles.link}>
          <div className={styles.cartInfo}>
            <div className={styles.cartIcon}>
              <ShoppingBasket size={40} />
              {cart.length > 0 && (
                <span className={styles.cartCount}>
                  {cart.reduce((t, i) => t + i.quantity, 0)}
                </span>
              )}
            </div>
            <p>
              Total: $
              {cart
                .reduce((total, product) => total + product.price * product.quantity, 0)
                .toFixed(2)}
            </p>
          </div>
        </Link>

        {isAdmin && (
          <Link to="/admin/configuracao" className={styles.link}>
            <Settings size={32} />
          </Link>
        )}
        
        {/* Ícone de Usuário/Perfil sempre visível se logado */}
        {session && (
          <Link to="/user" className={styles.link}>
            <User size={32} />
          </Link>
        )}
      </div>
    </header>
  );
}