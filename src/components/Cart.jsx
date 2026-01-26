import styles from "./Cart.module.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { finalizarPedido } from "../services/pedidos";
import { SessionContext } from "../context/SessionContext";

export function Cart() {
  const { session } = useContext(SessionContext);
  const user = session?.user;

  const {
    uniqueProducts,
    addToCart,
    removeFromCart,
    removeProductFromCart,
    clearCart
  } = useContext(CartContext);

  const total = uniqueProducts
    .reduce((acc, product) => acc + product.price * product.qty, 0)
    .toFixed(2);

  async function handleCheckout() {
    if (uniqueProducts.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    if (!user) {
      alert("Você precisa estar logado para finalizar a compra.");
      return;
    }

    try {
      await finalizarPedido(user.id, uniqueProducts);

      clearCart();

      // 👉 fluxo correto
      window.location.href = "/confirmar-dados";
    } catch (error) {
      console.error(error);
      alert("Erro ao finalizar o pedido.");
    }
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
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                  />

                  <h3>{product.title}</h3>

                  <div className={styles.quantity}>
                    <button onClick={() => removeFromCart(product)}>
                      -
                    </button>
                    <p>{product.qty}</p>
                    <button onClick={() => addToCart(product)}>
                      +
                    </button>
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
            <button
              className={styles.checkoutBtn}
              onClick={handleCheckout}
            >
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}
