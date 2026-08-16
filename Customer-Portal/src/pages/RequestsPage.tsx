import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "../services/authService";
import type { ProtectedRouteProps } from "../components/auth/ProtectedRoute";

export default function RequestsPage({ session }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    const { error } = await signOut();

    setLoading(false);

    if (!error) {
      navigate("/login");
    }
  };

  return (
    <div>
      <h1>Customer Requests</h1>

      <p>Welcome to your customer portal.</p>

      <p>Logged in as: {session?.user.email}</p>

      <button onClick={handleLogout} disabled={loading}>
        {loading ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  );
}
