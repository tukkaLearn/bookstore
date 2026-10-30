import { Link, useParams } from "react-router-dom";
import Error from "../components/Error";
import Loader from "../components/Loader";
import useFetch from "../hooks/useFetch";
import "./ReaderDetails.css";

export default function ReaderDetails() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/admin/${id}`);

  const reader = data;

  if (loading) return <Loader />;
  if (error) return <Error message={error.message} />;
  if (!reader) return <Error message="Reader not found" />;

  return (
    <main className="reader-details-page">
      <div className="reader-details-card">
        <div className="reader-details-header">
          <img
            src={
              reader.reader_avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                reader.reader_name,
              )}`
            }
            alt={reader.reader_name}
          />

          <h1>{reader.reader_name}</h1>
          <p>@{reader.reader_user_name}</p>
        </div>

        <div className="reader-details-info">
          <div>
            <span>Reader ID</span>
            <strong>{reader.reader_id}</strong>
          </div>

          <div>
            <span>Full Name</span>
            <strong>{reader.reader_name}</strong>
          </div>

          <div>
            <span>Username</span>
            <strong>{reader.reader_user_name}</strong>
          </div>

          <div>
            <span>Location</span>
            <strong>{reader.reader_location || "Not provided"}</strong>
          </div>

          <div>
            <span>Role</span>
            <strong>
              {reader.reader_role || (reader.isAdmin ? "Admin" : "Reader")}
            </strong>
          </div>

          <div>
            <span>Associated Book ID</span>
            <strong>{reader.book_id ?? "None"}</strong>
          </div>

          <div>
            <span>Registered On</span>
            <strong>{new Date(reader.created_at).toLocaleDateString()}</strong>
          </div>
        </div>

        <div className="reader-details-actions">
          <Link to="/admin/readers">Back to Readers</Link>

          <Link to={`/admin/readers/edit/${reader.reader_id}`}>
            Edit Reader
          </Link>
        </div>
      </div>
    </main>
  );
}
