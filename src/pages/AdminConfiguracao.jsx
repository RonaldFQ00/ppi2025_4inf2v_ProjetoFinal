import { useState } from "react";
import { supabase } from "../utils/supabase";

export function AdminConfiguracao() {
  const [tipo, setTipo] = useState("entrega");

  async function salvar() {
    console.log("Salvando configuração:", tipo);

    await supabase
      .from("configuracao_servico")
      .update({ ativo: false })
      .neq("id", "");

    await supabase.from("configuracao_servico").insert({
      tipo,
      ativo: true,
    });

    alert("Configuração salva!");
  }

  return (
    <div
      style={{
    maxWidth: 500,
    margin: "140px auto 60px", // 👈 empurra pra baixo do header
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 8,
    background: "var(--background)",
  }}
    >
      <h2>Configuração do serviço</h2>

      <label>Tipo de serviço:</label>
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="entrega">Entrega</option>
        <option value="restaurante">Restaurante</option>
        <option value="agendamento">Agendamento</option>
      </select>

      <br />
      <br />

      <button type="button" onClick={salvar}>
        Salvar
      </button>
    </div>
  );
}
