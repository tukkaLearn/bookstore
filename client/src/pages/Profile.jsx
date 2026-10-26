import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { useAuth } from "../features/auth/useAuth";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <p className="token">
          <strong>Token:</strong> {user?.token}
        </p>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
