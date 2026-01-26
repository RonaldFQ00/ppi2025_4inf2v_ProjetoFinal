import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import styles from "./ConfirmacaoDados.module.css";

export function ConfirmacaoDados() {
  const [campos, setCampos] = useState([]);
  const [valores, setValores] = useState({});

  useEffect(() => {
    async function carregar() {
      const { data: config } = await supabase
        .from("configuracao_servico")
        .select("*")
        .eq("ativo", true)
        .single();

      const { data } = await supabase
        .from("campos_confirmacao")
        .select("*")
        .eq("tipo_servico", config.tipo);

      setCampos(data);
    }

    carregar();
  }, []);

  function handleChange(nome, valor) {
    setValores({ ...valores, [nome]: valor });
  }

  function handleConfirmar() {
    window.location.href = "/confirmacao";
  }

  return (
    <div className={styles.container}>
      <h2>Confirme seus dados</h2>

      {campos.map((campo) => (
        <div key={campo.id} className={styles.field}>
          <label>{campo.nome}</label>
          <input
            required={campo.obrigatorio}
            onChange={(e) => handleChange(campo.nome, e.target.value)}
          />
        </div>
      ))}

      <button onClick={handleConfirmar}>Confirmar</button>

      <button onClick={() => window.location.href = "/confirmacao"}>
  Confirmar dados
</button>
    </div>
  );
}
