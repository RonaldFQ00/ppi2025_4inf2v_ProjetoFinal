import { supabase } from "../utils/supabase";

/**
 * @param {string} userId
 * @param {Array} produtos
 */
export async function finalizarPedido(userId, produtos) {
  // 1. Buscar pedido aberto
  let { data: pedido, error: erroBusca } = await supabase
    .from("pedidos")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "aberto")
    .maybeSingle();

  if (erroBusca) throw erroBusca;

  // 2. Se não existir, cria
  if (!pedido) {
    const { data: novoPedido, error: erroCriacao } = await supabase
      .from("pedidos")
      .insert({
        user_id: userId,
        status: "aberto",
        total: 0,
      })
      .select()
      .single();

    if (erroCriacao) throw erroCriacao;

    pedido = novoPedido;
  }

  // 3. Inserir itens do pedido
  let total = 0;

  for (const produto of produtos) {
    total += produto.price * produto.qty;

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

  // 4. Finalizar pedido
  const { error: erroFinalizar } = await supabase
    .from("pedidos")
    .update({
      status: "finalizado",
      total,
    })
    .eq("id", pedido.id);

  if (erroFinalizar) throw erroFinalizar;

  return pedido.id;
}
