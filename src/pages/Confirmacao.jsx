import styles from "./Confirmacao.module.css";

export function Confirmacao() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Pedido confirmado 🎉</h1>
        <p>Obrigado pela sua compra!</p>

        <button onClick={() => window.location.href = "/"}>
          Voltar para a loja
        </button>
      </div>
    </div>
  );
}
