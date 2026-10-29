import { useState } from "react";
import Loader from "../components/Loader";
import { useAuth } from "../features/auth/useAuth";
import { apiRequest } from "../services/api";
import "./Profile.css";

export default function Profile() {
  const { user, loading, refreshUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div className="profile-message">Please log in to view your profile.</div>
    );
  }

  function startEditing() {
    setName(user.reader_name || "");
    setLocation(user.reader_location || "");
    setAvatar(user.reader_avatar || "");
    setError("");
    setMessage("");
    setEditing(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await apiRequest("/readers/", {
        method: "PUT",
        body: JSON.stringify({
          reader_name: name.trim(),
          reader_location: location.trim(),
          reader_avatar: avatar.trim(),
        }),
      });

      await refreshUser();
      setEditing(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-header">
          <img
            className="profile-avatar"
            src={user.reader_avatar || "https://placehold.co/120x120?text=User"}
            alt={user.reader_name}
          />

          <h1>{user.reader_name}</h1>
          <p>@{user.reader_user_name}</p>

          {!editing && (
            <button type="button" onClick={startEditing}>
              Edit Profile
            </button>
          )}
        </div>

        {message && <p role="status">{message}</p>}
        {error && <p role="alert">{error}</p>}

        {editing ? (
          <form className="profile-details" onSubmit={handleSubmit}>
            <label>
              Full Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={20}
              />
            </label>

            <label>
              Location
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={20}
              />
            </label>

            <label>
              Avatar URL
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </label>

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={saving}
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="profile-details">
            <div className="profile-detail">
              <span>Full Name</span>
              <strong>{user.reader_name}</strong>
            </div>

            <div className="profile-detail">
              <span>Username</span>
              <strong>{user.reader_user_name}</strong>
            </div>

            <div className="profile-detail">
              <span>Location</span>
              <strong>{user.reader_location || "Not provided"}</strong>
            </div>

            <div className="profile-detail">
              <span>Account Type</span>
              <strong>{user.reader_role || "reader"}</strong>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
