import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);
const BASE = "https://ramazone.onrender.com" || "";

const normalize = (row) => ({
  id: row.product_id,
  name: row.name,
  price: parseFloat(row.price),
  image: row.image_url || row.image || "",
  category: row.category_name || row.category || "",
  quantity: row.quantity,
  stock: row.stock || 99,
  original_price: row.original_price ? parseFloat(row.original_price) : null,
  badge: row.badge || null,
  brand: row.brand || "",
  rating: parseFloat(row.rating) || 4.0,
  reviews: row.review_count || 0,
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rz_wishlist")) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("rz_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${BASE}/api/cart`);
      const data = await res.json();
      if (Array.isArray(data)) setCartItems(data.map(normalize));
    } catch (e) { console.error("Cart fetch failed", e); }
  };

  useEffect(() => { fetchCart(); }, []);

  const addToCart = async (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: Math.min(i.quantity + qty, 10) } : i);
      return [...prev, { ...product, quantity: qty }];
    });
    try {
      await fetch(`${BASE}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id, quantity: qty }),
      });
    } catch (e) { fetchCart(); }
  };

  const removeFromCart = async (productId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== productId));
    try {
      await fetch(`${BASE}/api/cart/${productId}`, { method: "DELETE" });
    } catch (e) { fetchCart(); }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) { removeFromCart(productId); return; }
    setCartItems((prev) => prev.map((i) => i.id === productId ? { ...i, quantity: Math.min(newQty, 10) } : i));
    try {
      await fetch(`${BASE}/api/cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity: newQty }),
      });
    } catch (e) { fetchCart(); }
  };

  const clearCart = () => setCartItems([]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      return exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
    });
  };
  const isInWishlist = (id) => wishlist.some((p) => p.id === id);

  const cartCount      = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal   = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryCharge = cartSubtotal > 499 ? 0 : 40;
  const grandTotal     = cartSubtotal + deliveryCharge;

  return (
    <CartContext.Provider value={{
      cartItems, fetchCart,
      addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, cartSubtotal, deliveryCharge, grandTotal,
      wishlist, toggleWishlist, isInWishlist,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
