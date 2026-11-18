import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export function AppRoute({protectedRoute = true}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  // Stuur al ingelogde gebruikers weg van /login naar de hoofdpagina "/"
  if (protectedRoute ? user === null : user !== null) {
    return <Navigate to={protectedRoute ? "/login" : "/"} replace />;
  }

  // Toon de login- of registratiepagina voor uitgelogde gebruikers
  return <Outlet />;
}
