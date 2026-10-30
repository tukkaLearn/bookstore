import { Link } from "react-router-dom";
import Error from "../components/Error";
import Loader from "../components/Loader";
import useFetch from "../hooks/useFetch";
import { apiRequest } from "../services/api";
import "./AdminReaders.css";

export default function AdminReaders() {
  const { data, loading, error } = useFetch("/admin/");

  const readers = data;

  if (loading) return <Loader />;
  if (error) return <Error message={error.message} />;
  if (!data) return null;

  async function handleDelete(readerId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this reader?",
    );

    if (!confirmDelete) return;

    try {
      await apiRequest(`/admin/${readerId}`, {
        method: "DELETE",
      });

      window.location.reload();
    } catch (error) {
      alert(error.message || "Failed to delete reader");
    }
  }

  return (
    <main className="admin-readers">
      <header className="admin-readers-header">
        <div>
          <h1>Manage Readers</h1>
          <p>View and manage registered readers.</p>
        </div>
      </header>

      <div className="admin-readers-count">
        Total Readers: <strong>{readers.length}</strong>
      </div>

      {readers.length === 0 ? (
        <div className="admin-readers-empty">
          <h2>No readers found</h2>
        </div>
      ) : (
        <div className="admin-readers-table-wrapper">
          <table className="admin-readers-table">
            <thead>
              <tr>
                <th>Reader</th>
                <th>Username</th>
                <th>Location</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {readers.map((reader) => (
                <tr key={reader.reader_id}>
                  <td>
                    <div className="admin-reader-info">
                      <img
                        src={
                          reader.reader_avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            reader.reader_name,
                          )}`
                        }
                        alt={reader.reader_name}
                      />
                      <span>{reader.reader_name}</span>
                    </div>
                  </td>

                  <td>@{reader.reader_user_name}</td>
                  <td>{reader.reader_location || "Not provided"}</td>

                  <td>{new Date(reader.created_at).toLocaleDateString()}</td>

                  <td>
                    <div className="admin-reader-actions">
                      <Link to={`/admin/readers/${reader.reader_id}`}>
                        View
                      </Link>

                      <Link to={`/admin/readers/edit/${reader.reader_id}`}>
                        Edit
                      </Link>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(reader.reader_id)}
                      >
                        Delete
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
