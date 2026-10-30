import { Link } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to your bookstore management panel.</p>
      </header>

      <section className="admin-grid">
        <Link to="/admin/books" className="admin-card">
          <div className="admin-card-icon">📚</div>
          <h2>Manage Books</h2>
          <p>Add new books, update book details, and remove books.</p>
          <span>Manage Books →</span>
        </Link>

        <Link to="/admin/readers" className="admin-card">
          <div className="admin-card-icon">👥</div>
          <h2>Manage Readers</h2>
          <p>View reader accounts, update details, and delete readers.</p>
          <span>Manage Readers →</span>
        </Link>
      </section>
    </main>
  );
}
