import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
);

export async function finalizarPedido(userId: string, produtos: any[]) {
  // 1. Buscar pedido aberto
  let { data: pedido } = await supabase
    .from("pedidos")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "aberto")
    .single();

  // 2. Se não existir, cria
  if (!pedido) {
    const { data: novoPedido } = await supabase
      .from("pedidos")
      .insert({
        user_id: userId,
        status: "aberto",
        total: 0,
      })
      .select()
      .single();

    pedido = novoPedido;
  }

  // 3. Inserir itens do pedido
  let total = 0;

  for (const produto of produtos) {
    total += produto.price * produto.qty;

    await supabase.from("pedido_itens").insert({
      pedido_id: pedido.id,
      item_id: produto.id,
      quantidade: produto.qty,
      preco_unitario: produto.price,
    });
  }

  // 4. Finalizar pedido
  await supabase
    .from("pedidos")
    .update({
      status: "finalizado",
      total,
    })
    .eq("id", pedido.id);

  return pedido.id;
}
