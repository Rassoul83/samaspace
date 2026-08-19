import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="container-page py-20 text-center text-encre/50">Chargement…</div>;
  if (!user) return <Navigate to="/connexion" replace />;
  if (role && profile?.role !== role) return <Navigate to="/" replace />;

  return children;
}
