import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import "./ProductCard.css";

export default function ProductCard({ product, onAdd }) {
  const { user } = useAuth();

  return (
    <Link to={`/book/${product.book_id}`}>
      <div className="card">
        <img src={product.book_image} alt={product.book_name} />

        <h3 className="title">
          {product.book_name.length > 50
            ? product.book_name.slice(0, 50) + "..."
            : product.book_name}
        </h3>

        <p className="price">Rs.{product.book_price}</p>
        {user ? (
          <button className="btn" onClick={onAdd}>
            Add to Cart
          </button>
        ) : (
          <button className="btn">Login to add</button>
        )}
      </div>
    </Link>
  );
}
