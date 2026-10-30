import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../features/auth/useAuth";

export default function ProtectedRoute({ adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.reader_role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
