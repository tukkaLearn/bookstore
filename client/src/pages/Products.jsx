import { useParams } from "react-router-dom";
import Error from "../components/Error";
import Loader from "../components/Loader";
import useFetch from "../hooks/useFetch";

export default function Products() {
  const { id } = useParams();

  const { data, loading, error } = useFetch(`/books/${id}`);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  const book = data.data;

  return (
    <div>
      ji
      {/* <img src={book.book_image} alt={book.book_name} width="250" />

      <h1>{book.book_name}</h1>
      <p>Author: {book.book_author}</p>
      <p>₹{book.book_price}</p>
      <p>⭐ {book.book_rating}</p>

      <h3>Description</h3>
      <p>{book.book_description}</p> */}
    </div>
  );
}
