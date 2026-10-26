import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../features/auth/useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  console.log(user);

  if (loading) {
    return <Loader />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
