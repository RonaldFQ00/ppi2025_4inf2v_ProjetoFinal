import { supabase } from "../utils/supabase";

/**
 * @param {string} userId
 * @param {Array} produtos
 * @param {Object} dadosAdicionais (endereço, telefone, etc)
 */
export async function finalizarPedido(userId, produtos, dadosAdicionais) {
  // 1. Criar o pedido com status finalizado e os dados de entrega
  const { data: pedido, error: erroCriacao } = await supabase
    .from("pedidos")
    .insert({
      user_id: userId,
      status: "finalizado",
      total: produtos.reduce((acc, p) => acc + p.price * p.qty, 0),
      observacoes: JSON.stringify(dadosAdicionais) // Guarda endereço/mesa aqui
    })
    .select()
    .single();

  if (erroCriacao) throw erroCriacao;

  // 2. Inserir os itens vinculados a esse pedido
  for (const produto of produtos) {
    const { error: erroItem } = await supabase
      .from("pedido_itens")
      .insert({
        pedido_id: pedido.id,
        item_id: produto.id,
        quantidade: produto.qty,
        preco_unitario: produto.price,
      });

    if (erroItem) throw erroItem;
  }

  return pedido.id;
}