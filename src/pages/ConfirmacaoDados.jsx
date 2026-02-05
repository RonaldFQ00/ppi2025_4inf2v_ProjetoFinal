import { useEffect, useState, useContext } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router"; 
import { CartContext } from "../context/CartContext";
import { SessionContext } from "../context/SessionContext";
import { finalizarPedido } from "../services/pedidos";

export function ConfirmacaoDados() {
  const [tipoServico, setTipoServico] = useState(null);
  const [erro, setErro] = useState(null);
  const [valores, setValores] = useState({});
  
  const navigate = useNavigate();
  const { uniqueProducts, clearCart } = useContext(CartContext);
  const { session } = useContext(SessionContext);

  const configuracaoCampos = {
    entrega: [
      { nome: "Endereço de Entrega", chave: "endereco", tipo: "text" },
      { nome: "Telefone", chave: "tel", tipo: "tel" },
      { nome: "Ponto de Referência", chave: "referencia", tipo: "text" }
    ],
    restaurante: [
      { nome: "Número da Mesa", chave: "mesa", tipo: "number" },
      { nome: "Nome do Cliente", chave: "cliente", tipo: "text" },
      { nome: "Observação (Opcional)", chave: "obs", tipo: "text" }
    ],
    agendamento: [
      { nome: "Data do Serviço", chave: "data", tipo: "date" },
      { nome: "Horário", chave: "hora", tipo: "time" },
      { nome: "Nome do Profissional", chave: "profissional", tipo: "text" }
    ]
  };

  useEffect(() => {
    async function carregarConfiguracao() {
      try {
        const { data, error } = await supabase
          .from("configuracao_servico")
          .select("tipo")
          .eq("ativo", true)
          .order("criado_em", { ascending: false })
          .limit(1);

        if (error) {
          console.warn("Tabela configuracao_servico não encontrada, usando padrão 'entrega'.");
          setTipoServico("entrega");
          return;
        }

        if (data && data.length > 0) {
          setTipoServico(data[0].tipo.trim().toLowerCase());
        } else {
          setTipoServico("entrega"); // Padrão caso esteja vazio
        }
      } catch (err) {
        // Se der erro de tabela, ainda assim mostra o formulário de entrega
        setTipoServico("entrega");
      }
    }
    carregarConfiguracao();
  }, []);

  function handleChange(chave, valor) {
    setValores({ ...valores, [chave]: valor });
  }

  async function handleConfirmar(e) {
    e.preventDefault();
    
    if (!session?.user) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      // 1. Envia tudo para o banco (através do serviço que atualizamos)
      await finalizarPedido(session.user.id, uniqueProducts, valores);
      
      // 2. Limpa o carrinho para o próximo pedido
      clearCart();
      
      // 3. Opcional: salva localmente
      localStorage.setItem("dados_confirmacao", JSON.stringify(valores));
      
      // 4. Vai para a tela de agradecimento 🎉
      navigate("/confirmacao");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar pedido no banco: " + err.message);
    }
  }

  if (erro) return <div style={{ marginTop: "160px", color: "red", textAlign: "center" }}>{erro}</div>;
  if (!tipoServico) return <div style={{ marginTop: "160px", color: "white", textAlign: "center" }}>Carregando formulário...</div>;

  const camposParaExibir = configuracaoCampos[tipoServico] || [];

  return (
    <div style={{ 
      marginTop: "140px", 
      padding: "20px", 
      maxWidth: "450px", 
      marginInline: "auto", 
      background: "#1e1e1e", 
      borderRadius: "12px", 
      color: "white", 
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)", 
      fontFamily: "sans-serif" 
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Confirmar Dados</h2>
      <p style={{ textAlign: "center", color: "#aaa", marginBottom: "20px" }}>
        Tipo de serviço: <strong>{tipoServico.toUpperCase()}</strong>
      </p>

      <form onSubmit={handleConfirmar}>
        {camposParaExibir.map((campo) => (
          <div key={campo.chave} style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>{campo.nome}</label>
            <input
              type={campo.tipo}
              required
              placeholder={`Digite seu ${campo.nome.toLowerCase()}...`}
              onChange={(e) => handleChange(campo.chave, e.target.value)}
              style={{ 
                width: "100%", 
                padding: "12px", 
                borderRadius: "6px", 
                border: "1px solid #333", 
                background: "#2d2d2d", 
                color: "white", 
                boxSizing: "border-box" 
              }}
            />
          </div>
        ))}
        
        <button 
          type="submit" 
          style={{ 
            width: "100%", 
            padding: "14px", 
            backgroundColor: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "6px", 
            cursor: "pointer", 
            fontWeight: "bold", 
            fontSize: "16px", 
            marginTop: "10px" 
          }}
        >
          Finalizar e Confirmar
        </button>
      </form>
    </div>
  );
}