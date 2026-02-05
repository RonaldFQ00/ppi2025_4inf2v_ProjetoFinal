import styles from "./Cart.module.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { SessionContext } from "../context/SessionContext";
import { useNavigate } from "react-router"; 

export function Cart() {
  const { session } = useContext(SessionContext);
  const user = session?.user;
  const navigate = useNavigate();

  const {
    uniqueProducts,
    addToCart,
    removeFromCart,
    removeProductFromCart,
  } = useContext(CartContext);

  const total = uniqueProducts
    .reduce((acc, product) => acc + product.price * product.qty, 0)
    .toFixed(2);

  function handleCheckout() {
    if (uniqueProducts.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    if (!user) {
      alert("Você precisa estar logado para finalizar a compra.");
      return;
    }

    // Apenas navega para a tela de preencher dados
    navigate("/confirmar-dados");
  }

  return (
    <div className={styles.cart}>
      <h2 className={styles.title}>Carrinho de Compras</h2>

      {uniqueProducts.length === 0 ? (
        <p className={styles.empty}>Seu carrinho está vazio</p>
      ) : (
        <>
          <ul className={styles.cartList}>
            {uniqueProducts.map((product) => (
              <li key={product.id}>
                <div className={styles.cartItem}>
                  <img src={product.thumbnail} alt={product.title} />
                  <h3>{product.title}</h3>
                  <div className={styles.quantity}>
                    <button onClick={() => removeFromCart(product)}>-</button>
                    <p>{product.qty}</p>
                    <button onClick={() => addToCart(product)}>+</button>
                  </div>
                  <p className={styles.subtotal}>
                    ${(product.price * product.qty).toFixed(2)}
                  </p>
                  <button
                    className={styles.remove}
                    onClick={() => removeProductFromCart(product)}
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.checkout}>
            <h3>Total: ${total}</h3>
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}