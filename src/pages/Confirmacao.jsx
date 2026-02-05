export function Confirmacao() {
  // Estilos inline para garantir que as cores apareçam
  const containerStyle = {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f7fa",
    padding: "20px",
    marginTop: "60px"
  };

  const cardStyle = {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    width: "100%",
    textAlign: "center"
  };

  const buttonStyle = {
    backgroundColor: "#007bff", // AZUL
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    marginTop: "20px",
    display: "inline-block"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ color: "#2e7d32", fontSize: "32px", marginBottom: "15px" }}>
          Pedido confirmado 🎉
        </h1>
        <p style={{ color: "#444", fontSize: "18px" }}>
          Obrigado pela sua compra!
        </p>

        <button 
          style={buttonStyle} 
          onClick={() => window.location.href = "/"}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
        >
          Voltar para a loja
        </button>
      </div>
    </div>
  );
}