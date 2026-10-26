import { createContext, useEffect, useState } from "react";
import { useAuth } from "../features/auth/useAuth";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();

  /* ---- store ALL users carts ---- */
  const [carts, setCarts] = useState(() => {
    const stored = localStorage.getItem("carts");
    return stored ? JSON.parse(stored) : {};
  });

  /* ---- persist carts ---- */
  useEffect(() => {
    localStorage.setItem("carts", JSON.stringify(carts));
  }, [carts]);

  /* ---- DERIVED CART (NO STATE) ---- */
  const cart = user ? carts[user.reader_user_name] || [] : [];

  function addToCart(item) {
    console.log(cart);
    if (!user) return;

    setCarts((prev) => {
      const userCart = prev[user.reader_user_name] || [];

      const exist = userCart.find((p) => p.book_id === item.book_id);

      const updatedCart = exist
        ? userCart.map((p) =>
            p.book_id === item.book_id ? { ...p, qty: p.qty + 1 } : p,
          )
        : [...userCart, { ...item, qty: 1 }];

      return {
        ...prev,
        [user.reader_user_name]: updatedCart,
      };
    });
    console.log(cart);
  }

  function removeFromCart(id) {
    if (!user) return;

    setCarts((prev) => ({
      ...prev,
      [user.reader_user_name]: (prev[user.reader_user_name] || []).filter(
        (p) => p.book_id !== id,
      ),
    }));
  }

  function clearCart() {
    if (!user) return;

    setCarts((prev) => ({
      ...prev,
      [user.reader_user_name]: [],
    }));
  }

  function increaseQty(id) {
    if (!user) return;

    setCarts((prev) => {
      const updated = (prev[user.reader_user_name] || []).map((p) =>
        p.book_id === id ? { ...p, qty: p.qty + 1 } : p,
      );

      return { ...prev, [user.reader_user_name]: updated };
    });
  }

  function decreaseQty(id) {
    if (!user) return;

    setCarts((prev) => {
      const updated = (prev[user.reader_user_name] || [])
        .map((p) => (p.book_id === id ? { ...p, qty: p.qty - 1 } : p))
        .filter((p) => p.qty > 0);

      return { ...prev, [user.reader_user_name]: updated };
    });
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQty,
        decreaseQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
