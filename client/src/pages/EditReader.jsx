import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Error from "../components/Error";
import Loader from "../components/Loader";
import useFetch from "../hooks/useFetch";
import { apiRequest } from "../services/api";
import "./AddBook.css";

export default function EditReader() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useFetch(`/admin/${id}`);

  console.log(data);

  const [formData, setFormData] = useState({
    reader_user_name: "",
    reader_name: "",
    reader_location: "",
    reader_avatar: "",
    book_id: "",
  });

  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (data) {
      const reader = data;

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        reader_user_name: reader.reader_user_name ?? "",
        reader_name: reader.reader_name ?? "",
        reader_location: reader.reader_location ?? "",
        reader_avatar: reader.reader_avatar ?? "",
        book_id: reader.book_id ?? "",
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

      await apiRequest(`/admin/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          book_id: formData.book_id ? Number(formData.book_id) : null,
        }),
      });

      navigate("/admin/readers");
    } catch (err) {
      setSubmitError(err.message || "Failed to update reader");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader />;
  if (error) return <Error message={error.message} />;
  if (!data) return <Error message="Reader not found" />;

  return (
    <main className="add-book-page">
      <div className="add-book-container">
        <h1>Edit Reader</h1>
        <p>Update reader account information.</p>

        {submitError && (
          <div className="add-book-error" role="alert">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="add-book-field">
            <label htmlFor="reader_user_name">Username *</label>
            <input
              id="reader_user_name"
              name="reader_user_name"
              value={formData.reader_user_name}
              onChange={handleChange}
              maxLength={10}
              required
            />
          </div>

          <div className="add-book-field">
            <label htmlFor="reader_name">Full Name *</label>
            <input
              id="reader_name"
              name="reader_name"
              value={formData.reader_name}
              onChange={handleChange}
              maxLength={20}
              required
            />
          </div>

          <div className="add-book-field">
            <label htmlFor="reader_location">Location</label>
            <input
              id="reader_location"
              name="reader_location"
              value={formData.reader_location}
              onChange={handleChange}
            />
          </div>

          <div className="add-book-field">
            <label htmlFor="reader_avatar">Avatar URL</label>
            <input
              id="reader_avatar"
              name="reader_avatar"
              type="url"
              value={formData.reader_avatar}
              onChange={handleChange}
            />
          </div>

          <div className="add-book-field">
            <label htmlFor="book_id">Associated Book ID</label>
            <input
              id="book_id"
              name="book_id"
              type="number"
              min="1"
              value={formData.book_id}
              onChange={handleChange}
            />
          </div>

          <div className="add-book-actions">
            <button
              type="button"
              className="add-book-cancel"
              onClick={() => navigate("/admin/readers")}
            >
              Cancel
            </button>

            <button type="submit" disabled={saving}>
              {saving ? "Updating..." : "Update Reader"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
