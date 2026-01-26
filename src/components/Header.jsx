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

  const isLogged = !!session;
  const isAdmin = session?.user?.user_metadata?.admin;
  return (
    <div className={styles.container}>
      {/* LOGO */}
      <div>
        <Link to="/" className={styles.link}>
          <h1>TRJ Megastore</h1>
        </Link>

        {/* USUÁRIO LOGADO */}
        {isLogged && (
          <div className={styles.userLinks}>
            <Link to="/user" className={styles.welcomeMessage}>
              <User size={16} />
              {session.user.user_metadata.username}
            </Link>

            {isAdmin && (
              <Link to="/admin/configuracao" className={styles.adminLink}>
                <Settings size={16} />
                Configuração
              </Link>
            )}
          </div>
        )}
      </div>

      {/* AÇÕES */}
      <div className={styles.actions}>
        {/* USUÁRIO NÃO LOGADO */}
        {!isLogged && (
          <>
            <Link to="/login" className={styles.link}>
              Sign In
            </Link>
            <Link to="/signup" className={styles.link}>
              Criar conta
            </Link>
          </>
        )}

        <ThemeToggle />

        {/* CARRINHO (SEMPRE VISÍVEL) */}
        <Link to="/cart" className={styles.link}>
          <div className={styles.cartInfo}>
            <div className={styles.cartIcon}>
              <ShoppingBasket size={32} />
              {cart.length > 0 && (
                <span className={styles.cartCount}>
                  {cart.reduce((t, i) => t + i.quantity, 0)}
                </span>
              )}
            </div>

            <p>
              Total: $
              {cart
                .reduce(
                  (total, product) =>
                    total + product.price * product.quantity,
                  0
                )
                .toFixed(2)}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
