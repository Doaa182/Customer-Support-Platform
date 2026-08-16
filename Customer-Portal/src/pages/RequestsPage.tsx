import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "../services/authService";
import type { ProtectedRouteProps } from "../components/auth/ProtectedRoute";
import { supabase } from "../lib/supabase";


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

  const testMessageRLS = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("request_id", "c4623226-fd9d-44b5-9239-a31ebb2feb87");

    console.log("Visible messages:", data);
    console.log("Messages error:", error);
  };

  return (
    <div>
      <h1>Customer Requests</h1>

      <p>Welcome to your customer portal.</p>

      <p>Logged in as: {session?.user.email}</p>

      <button onClick={handleLogout} disabled={loading}>
        {loading ? "Signing out..." : "Sign Out"}
      </button>

      <button onClick={testMessageRLS}>Test Message RLS</button>
    </div>
  );
}
