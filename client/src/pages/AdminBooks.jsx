import { useState } from "react";
import { Link } from "react-router-dom";
import Error from "../components/Error";
import Loader from "../components/Loader";
import useFetch from "../hooks/useFetch";
import { apiRequest } from "../services/api";
import "./AdminBooks.css";

export default function AdminBooks() {
  const { data, loading, error } = useFetch("/books");

  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const books = data;

  async function handleDelete(bookId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(bookId);
      setDeleteError("");

      await apiRequest(`/books/${bookId}`, {
        method: "DELETE",
      });

      window.location.reload();
    } catch (err) {
      setDeleteError(err.message || "Failed to delete book");
      setDeletingId(null);
    }
  }

  if (loading) return <Loader />;
  if (error) return <Error message={error.message} />;
  if (!data) return null;

  return (
    <main className="admin-books">
      <header className="admin-books-header">
        <div>
          <h1>Manage Books</h1>
          <p>View and manage your bookstore collection.</p>
        </div>

        <Link to="/admin/books/add" className="add-book-btn">
          + Add New Book
        </Link>
      </header>

      <div className="admin-books-count">
        Total Books: <strong>{books.length}</strong>
      </div>

      {deleteError && (
        <div className="add-book-error" role="alert">
          {deleteError}
        </div>
      )}

      {books.length === 0 ? (
        <div className="admin-books-empty">
          <h2>No books found</h2>
          <p>Start by adding your first book.</p>
        </div>
      ) : (
        <div className="admin-books-table-wrapper">
          <table className="admin-books-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Author</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book) => (
                <tr key={book.book_id}>
                  <td>
                    <div className="admin-book-info">
                      <img
                        src={book.book_image || "/placeholder.png"}
                        alt={book.book_name}
                      />
                      <span>{book.book_name}</span>
                    </div>
                  </td>

                  <td>{book.book_author || "Unknown"}</td>
                  <td>₹{book.book_price}</td>
                  <td>⭐ {Number(book.book_rating || 0).toFixed(1)}</td>

                  <td>
                    <div className="admin-book-actions">
                      <Link to={`/admin/books/edit/${book.book_id}`}>Edit</Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(book.book_id)}
                        disabled={deletingId === book.book_id}
                      >
                        {deletingId === book.book_id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
