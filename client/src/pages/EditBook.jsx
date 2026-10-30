import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Error from "../components/Error";
import Loader from "../components/Loader";
import useFetch from "../hooks/useFetch";
import { apiRequest } from "../services/api";
import "./AddBook.css";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useFetch(`/books/${id}`);

  console.log(data);

  const [formData, setFormData] = useState({
    book_name: "",
    book_author: "",
    book_image: "",
    book_price: "",
    book_description: "",
    book_rating: "0",
  });

  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        book_name: data.book_name ?? "",
        book_author: data.book_author ?? "",
        book_image: data.book_image ?? "",
        book_price: data.book_price ?? "",
        book_description: data.book_description ?? "",
        book_rating: data.book_rating ?? "0",
      });
    }
  }, [data]);

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
      setSaving(true);
      setSubmitError("");

      await apiRequest(`/books/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          book_price: Number(formData.book_price),
          book_rating: Number(formData.book_rating),
        }),
      });

      navigate("/admin/books");
    } catch (err) {
      setSubmitError(err.message || "Failed to update book");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader />;
  if (error) return <Error message={error.message} />;
  if (!data) return <Error message="Book not found" />;

  return (
    <main className="add-book-page">
      <div className="add-book-container">
        <h1>Edit Book</h1>
        <p>Update the book details.</p>

        {submitError && <div className="add-book-error">{submitError}</div>}

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

            <button type="submit" disabled={saving}>
              {saving ? "Updating..." : "Update Book"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
