import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./AddBook.css";

export default function AddBook() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    book_name: "",
    book_author: "",
    book_image: "",
    book_price: "",
    book_description: "",
    book_rating: "0",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await apiRequest("/books/", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          book_price: Number(formData.book_price),
          book_rating: Number(formData.book_rating),
        }),
      });

      navigate("/admin/books");
    } catch (err) {
      setError(err.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="add-book-page">
      <div className="add-book-container">
        <h1>Add New Book</h1>
        <p>Enter the details of the new book.</p>

        {error && <div className="add-book-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="add-book-field">
            <label htmlFor="book_name">Book Name *</label>
            <input
              id="book_name"
              name="book_name"
              value={formData.book_name}
              onChange={handleChange}
              maxLength={20}
              required
            />
          </div>

          <div className="add-book-field">
            <label htmlFor="book_author">Author</label>
            <input
              id="book_author"
              name="book_author"
              value={formData.book_author}
              onChange={handleChange}
              maxLength={20}
            />
          </div>

          <div className="add-book-field">
            <label htmlFor="book_image">Image URL</label>
            <input
              id="book_image"
              name="book_image"
              type="url"
              value={formData.book_image}
              onChange={handleChange}
            />
          </div>

          <div className="add-book-row">
            <div className="add-book-field">
              <label htmlFor="book_price">Price (₹) *</label>
              <input
                id="book_price"
                name="book_price"
                type="number"
                min="0"
                step="1"
                value={formData.book_price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-book-field">
              <label htmlFor="book_rating">Rating (0–5)</label>
              <input
                id="book_rating"
                name="book_rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.book_rating}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="add-book-field">
            <label htmlFor="book_description">Description</label>
            <textarea
              id="book_description"
              name="book_description"
              rows="5"
              value={formData.book_description}
              onChange={handleChange}
            />
          </div>

          <div className="add-book-actions">
            <button
              type="button"
              className="add-book-cancel"
              onClick={() => navigate("/admin/books")}
            >
              Cancel
            </button>

            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
