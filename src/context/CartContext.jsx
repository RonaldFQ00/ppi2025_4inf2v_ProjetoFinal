import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../utils/supabase";
import { SessionContext } from "./SessionContext";

export const CartContext = createContext({
  products: [],
  cart: [],
  loading: false,
  error: null,
  addToCart: () => {},
  updateQty: () => {},
  clearCart: () => {},
  removeFromCart: () => {},
  uniqueProducts: [],
  addProduct: () => {},
  removeProduct: () => {},
  updateProduct: () => {},
  removeProductFromDB: () => {}
});

export function CartProvider({ children }) {
  const { session } = useContext(SessionContext);

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let mounted = true;

  // ---------------------------------------------------------
  // FETCH PRODUCTS + CART
  // ---------------------------------------------------------
  useEffect(() => {
    async function fetchProductsSupabase() {
      try {
        const { data, error: fetchError } = await supabase
          .from("product")            // ✔️ tabela correta
          .select("*");

        if (!mounted) return;

        if (fetchError) {
          setError(fetchError.message);
          setProducts([]);
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        if (mounted) setError(String(err));
        if (mounted) setProducts([]);
      }
    }

    async function fetchCartSupabase() {
      if (!session?.user) {
        if (mounted) setCart([]);
        return;
      }

      try {
        const { data, error: cartError } = await supabase
          .from("cart")
          .select("*")
          .eq("customer_id", session.user.id)
          .order("added_at", { ascending: false });

        if (!mounted) return;

        if (cartError) {
          setError(cartError.message);
          setCart([]);
        } else {
          setCart(data || []);
        }
      } catch (err) {
        if (mounted) setError(String(err));
        if (mounted) setCart([]);
      }
    }

    setLoading(true);
    fetchProductsSupabase();
    fetchCartSupabase().finally(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [session]);

  // ---------------------------------------------------------
  // REMOVE PRODUCT FROM DB
  // ---------------------------------------------------------
  const removeProductFromDB = async (id) => {
    try {
      const { error } = await supabase
        .from("product")             // ✔️ corrigido
        .delete()
        .eq("id", id);

      if (!error) removeProduct(id);
    } catch (err) {
      console.error("Erro ao remover produto:", err);
    }
  };

  // ---------------------------------------------------------
  // UPDATE PRODUCT
  // ---------------------------------------------------------
  const updateProduct = async (updated) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );

    try {
      const payload = {
        title: updated.title,
        price: updated.price,
        description: updated.description,
        thumbnail: updated.thumbnail,
        updated_at: new Date().toISOString()
      };

      await supabase
        .from("product")            // ✔️ corrigido
        .update(payload)
        .eq("id", updated.id);
    } catch (err) {
      setError(String(err));
    }
  };

  // ---------------------------------------------------------
  // ADD TO CART
  // ---------------------------------------------------------
  const addToCart = (product) => {
    setCart((prev) => [...prev, { ...product, quantity: 1 }]);

    async function addCartItem(prod) {
      if (!session) {
        setError("Entre em sua conta para modificar o carrinho");
        return;
      }

      try {
        const { data: existing } = await supabase
          .from("cart")
          .select("*")
          .eq("customer_id", session.user.id)
          .eq("product_id", prod.id)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("cart")
            .update({
              quantity: existing.quantity + 1,
              added_at: new Date().toISOString()
            })
            .eq("customer_id", session.user.id)
            .eq("product_id", prod.id);

          return;
        }

        await supabase.from("cart").insert({
          customer_id: session.user.id,
          product_id: prod.id,
          quantity: 1,
          title: prod.title,
          price: prod.price,
          thumbnail: prod.thumbnail,
          description: prod.description,
          added_at: new Date().toISOString()
        });
      } catch (err) {
        setError(String(err));
      }
    }

    addCartItem(product);
  };

  // ---------------------------------------------------------
  // UPDATE QTY
  // ---------------------------------------------------------
  const updateQty = async (product, qty) => {
    if (!session) {
      setError("Entre em sua conta para modificar o carrinho");
      return;
    }

    const productId = product.product_id ?? product.id;

    try {
      await supabase
        .from("cart")
        .update({ quantity: qty })
        .eq("customer_id", session.user.id)
        .eq("product_id", productId);
    } catch (err) {
      setError(String(err));
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product_id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  // ---------------------------------------------------------
  // REMOVE FROM CART
  // ---------------------------------------------------------
  const removeFromCart = async (product) => {
    const match = cart.find(
      (item) =>
        item.product_id === product.id ||
        item.id === product.id
    );

    if (!match) return;

    const qty = match.quantity;
    const productId = match.product_id ?? match.id;

    if (qty > 1) {
      setCart((prev) =>
        prev.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: qty - 1 }
            : item
        )
      );
    } else {
      setCart((prev) =>
        prev.filter((item) => item.product_id !== productId)
      );
    }

    if (!session) return;

    try {
      if (qty > 1) {
        await supabase
          .from("cart")
          .update({ quantity: qty - 1 })
          .eq("customer_id", session.user.id)
          .eq("product_id", productId);
      } else {
        await supabase
          .from("cart")
          .delete()
          .eq("customer_id", session.user.id)
          .eq("product_id", productId);
      }
    } catch (err) {
      setError(String(err));
    }
  };

  // ---------------------------------------------------------
  // UNIQUE PRODUCTS
  // ---------------------------------------------------------
  const productMap = {};
  cart.forEach((product) => {
    const idKey = product.product_id ?? product.id;
    if (productMap[idKey]) {
      productMap[idKey].qty += product.quantity;
    } else {
      productMap[idKey] = {
        ...product,
        qty: product.quantity,
        id: idKey
      };
    }
  });

  const uniqueProducts = Object.values(productMap);

  // ---------------------------------------------------------
  // CLEAR CART
  // ---------------------------------------------------------
  const clearCart = async (product) => {
    if (!session) return;
    try {
      await supabase
        .from("cart")
        .delete()
        .eq("customer_id", session.user.id)
        .eq("product_id", product.id);
    } catch (err) {
      setError(String(err));
    }
  };

  // ---------------------------------------------------------
  // ADD / REMOVE PRODUCTS LOCALLY
  // ---------------------------------------------------------
  const addProduct = (p) => {
    setProducts((prev) => [...prev, { ...p, id: Date.now() }]);
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ---------------------------------------------------------
  // CONTEXT EXPORT
  // ---------------------------------------------------------
  const context = {
    products,
    cart,
    loading,
    error,
    addToCart,
    updateQty,
    clearCart,
    removeFromCart,
    uniqueProducts,
    addProduct,
    removeProduct,
    updateProduct,
    removeProductFromDB
  };

  return (
    <CartContext.Provider value={context}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
