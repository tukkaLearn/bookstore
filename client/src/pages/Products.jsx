import { useParams } from "react-router-dom";
import Comments from "../components/components/Comments";
import Error from "../components/Error";
import Loader from "../components/Loader";
import useFetch from "../hooks/useFetch";
import "./Products.css";

export default function Products() {
  const { id } = useParams();

  const { data, loading, error } = useFetch(`/books/${id}`);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;
  if (!data) return null;

  return (
    <div className="product-details">
      <div className="product-image">
        <img src={data.book_image} alt={data.book_name} />
      </div>

      <div className="product-info">
        <h1>{data.book_name}</h1>

        <p className="product-author">
          By {data.book_author || "Unknown Author"}
        </p>

        <p className="product-rating">⭐ {data.book_rating ?? 0} / 5</p>

        <p className="product-price">₹{data.book_price}</p>

        <div className="product-description">
          <h3>About this book</h3>
          <p>{data.book_description || "No description available."}</p>
        </div>
      </div>
      <Comments bookId={id} />
    </div>
  );
}
