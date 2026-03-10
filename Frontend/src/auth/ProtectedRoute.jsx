import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authAPI } from "../services/api";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    authAPI
      .me()
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
