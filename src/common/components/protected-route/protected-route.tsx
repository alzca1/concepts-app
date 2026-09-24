import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../../context/use-auth";

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard: redirects to /login if there is no signed-in user.
 * Preserves the requested URL so the user lands back where they
 * wanted after signing in.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
