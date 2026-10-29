import { useState } from "react";
import { Link } from "react-router-dom";
import Error from "../components/Error";
import Loader from "../components/Loader";
import useFetch from "../hooks/useFetch";
import { apiRequest } from "../services/api";
import "./SavedBooks.css";

export default function SavedBooks() {
  const { data, loading, error } = useFetch("/books/saved");
  const [removingId, setRemovingId] = useState(null);
  const [removeError, setRemoveError] = useState("");

  async function handleRemove(bookId) {
    try {
      setRemovingId(bookId);
      setRemoveError("");

      await apiRequest(`/books/saved/${bookId}`, {
        method: "DELETE",
      });

      window.location.reload();
    } catch (err) {
      setRemoveError(err.message || "Failed to remove saved book");
    } finally {
      setRemovingId(null);
    }
  }

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <main className="saved-page">
      <header className="saved-header">
        <h1>My Saved Books</h1>
        <p>Your personal collection of favorite reads.</p>
        <span>{data.length} saved books</span>
      </header>

      {removeError && (
        <p className="saved-error" role="alert">
          {removeError}
        </p>
      )}

      {data.length === 0 ? (
        <div className="saved-empty">
          <h2>No saved books yet</h2>
          <p>Explore our collection and save books you want to read.</p>
          <Link to="/">Explore Books</Link>
        </div>
      ) : (
        <div className="saved-grid">
          {data.map((book) => (
            <article className="saved-card" key={book.book_id}>
              <Link to={`/book/${book.book_id}`} className="saved-image-link">
                <img
                  src={book.book_image}
                  alt={book.book_name}
                  className="saved-image"
                />
              </Link>

              <div className="saved-info">
                <h2>
                  <Link to={`/book/${book.book_id}`}>{book.book_name}</Link>
                </h2>

                <p className="saved-author">
                  By {book.book_author || "Unknown Author"}
                </p>

                <p className="saved-rating">
                  ⭐ {Number(book.book_rating || 0).toFixed(1)} / 5
                </p>

                <p className="saved-price">₹{book.book_price}</p>

                <button
                  type="button"
                  className="saved-remove"
                  onClick={() => handleRemove(book.book_id)}
                  disabled={removingId === book.book_id}
                >
                  {removingId === book.book_id
                    ? "Removing..."
                    : "Remove from Saved"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
