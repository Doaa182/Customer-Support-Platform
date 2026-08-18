import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

import { getCurrentUserProfile } from "../../services/authService";

export interface ProtectedRouteProps {
  session: Session | null;
}

export default function ProtectedRoute({ session }: ProtectedRouteProps) {
  const [checkingRole, setCheckingRole] = useState(true);
  const [isCustomer, setIsCustomer] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!session) {
        setCheckingRole(false);
        return;
      }

      const { profile } = await getCurrentUserProfile();

      setIsCustomer(profile?.role === "customer");
      setCheckingRole(false);
    };

    checkRole();
  }, [session]);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (checkingRole) {
    return <p>Checking authorization...</p>;
  }

  if (!isCustomer) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
