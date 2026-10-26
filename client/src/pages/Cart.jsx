import { useCart } from "../features/cart/useCart";
import "./Cart.css";

export default function Cart() {
  const { cart, increaseQty, decreaseQty, removeFromCart, clearCart } =
    useCart();

  const total = cart.reduce((sum, item) => sum + item.book_price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty 🛒</h2>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      <div className="cart-list">
        {cart.map((item) => (
          <div className="cart-item" key={item.book_id}>
            <img src={item.book_image} alt={item.book_name} />

            <div className="info">
              <h4>{item.book_name}</h4>
              <p>Rs.{item.book_price}</p>
            </div>

            <div className="qty">
              <button onClick={() => decreaseQty(item.book_id)}>−</button>

              <span>{item.qty}</span>

              <button onClick={() => increaseQty(item.book_id)}>+</button>
            </div>

            <button
              className="remove"
              onClick={() => removeFromCart(item.book_id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <h3>Total: Rs.{total.toFixed(2)}</h3>

        <button className="clear" onClick={clearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  );
}
