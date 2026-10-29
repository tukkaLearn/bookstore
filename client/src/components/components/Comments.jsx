import { useState } from "react";
import { useAuth } from "../../features/auth/useAuth";
import useFetch from "../../hooks/useFetch";
import { apiRequest } from "../../services/api";
import Error from "../Error";
import Loader from "../Loader";
import "./Comment.css";

export default function Comments({ bookId }) {
  const { data, loading, error } = useFetch(`/comments/book/${bookId}`);
  const { user } = useAuth();

  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  const comments = Array.isArray(data) ? data : (data?.comments ?? []);

  console.log(user);

  function startEditing(comment) {
    setEditingId(comment.comment_id);
    setEditDescription(comment.description || "");
  }

  async function handleEdit(commentId) {
    if (!editDescription.trim()) return;

    try {
      await apiRequest(`/comments/${commentId}`, {
        method: "PUT",
        body: JSON.stringify({
          description: editDescription.trim(),
        }),
      });

      window.location.reload();
    } catch (err) {
      setSubmitError(err.message || "Failed to update review");
    }
  }

  async function handleDelete(commentId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?",
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/comments/${commentId}`, {
        method: "DELETE",
      });

      window.location.reload();
    } catch (err) {
      setSubmitError(err.message || "Failed to delete review");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!description.trim()) return;

    try {
      setSubmitting(true);
      setSubmitError("");

      await apiRequest(`/comments/book/${bookId}`, {
        method: "POST",
        body: JSON.stringify({ description: description.trim() }),
      });

      setDescription("");
      window.location.reload();
    } catch (err) {
      setSubmitError(err.message || "Failed to post review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="comments-section">
      <h2 className="comments-title">Reader Reviews</h2>

      {user ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            className="comment-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share your thoughts about this book..."
            required
          />

          <button
            className="comment-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Posting..." : "Post Review"}
          </button>

          {submitError && <p className="comment-error">{submitError}</p>}
        </form>
      ) : (
        <p className="comment-login">Please log in to write a review.</p>
      )}

      {loading && <Loader />}
      {error && <Error message={error} />}

      {!loading &&
        !error &&
        (comments.length === 0 ? (
          <p className="no-comments">
            No reviews yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <article className="comment-card" key={comment.comment_id}>
                <div className="comment-card-header">
                  <div className="comment-avatar">
                    {(comment.reader_name ||
                      comment.reader_user_name ||
                      "?")[0].toUpperCase()}
                  </div>

                  <div className="comment-author">
                    <h4>{comment.reader_name || comment.reader_user_name}</h4>
                    <span>Reader review</span>
                  </div>
                </div>

                {editingId === comment.comment_id ? (
                  <div className="comment-edit-form">
                    <textarea
                      className="comment-input"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      required
                    />

                    <div className="comment-actions">
                      <button
                        className="comment-save"
                        type="button"
                        onClick={() => handleEdit(comment.comment_id)}
                      >
                        Save
                      </button>

                      <button
                        className="comment-cancel"
                        type="button"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="comment-text">{comment.description}</p>
                )}

                {user &&
                  (user.reader_role === "admin" ||
                    user.reader_id === comment.reader_id) && (
                    <div className="comment-actions">
                      <button
                        className="comment-edit"
                        type="button"
                        onClick={() => startEditing(comment)}
                      >
                        Edit
                      </button>

                      <button
                        className="comment-delete"
                        type="button"
                        onClick={() => handleDelete(comment.comment_id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
              </article>
            ))}
          </div>
        ))}
    </section>
  );
}
