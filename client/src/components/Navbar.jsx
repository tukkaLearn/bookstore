import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { useCart } from "../features/cart/useCart";
import "./Navbar.css";

export default function Navbar() {
  const { logout, user } = useAuth();
  const { cart } = useCart();
  return (
    <nav className="navbar">
      <NavLink to="/">
        <img src="/tkcart.svg" alt="tukka cart" width="80" />
      </NavLink>

      <div className="links">
        <NavLink to="/" className="link">
          Home
        </NavLink>
        <NavLink to="/products" className="link">
          Products
        </NavLink>
        <NavLink to="/cart" className="link">
          Cart {cart.length > 0 && <span className="badge">{cart.length}</span>}
        </NavLink>
      </div>

      <div className="auth">
        {!user ? (
          <Link to="/login" className="btn">
            Login
          </Link>
        ) : (
          <>
            <Link to="/profile" className="btn">
              Profile
            </Link>
            <button onClick={logout} className="btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
