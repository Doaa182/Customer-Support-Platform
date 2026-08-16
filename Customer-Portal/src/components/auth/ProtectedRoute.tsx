import { Navigate, Outlet } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

export interface ProtectedRouteProps {
  session: Session | null;
}

export default function ProtectedRoute({ session }: ProtectedRouteProps) {
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
