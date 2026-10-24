import { Navigate } from "react-router-dom";

import { useAuth } from "../../../context/use-auth";

export interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard for auth pages (/login, /signup): redirects to / if the
 * user is already signed in.
 */
export function GuestRoute({ children }: GuestRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="spinner" aria-label="Loading" />;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
