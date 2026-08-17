import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const testCurrentUser = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("Current user:", user);
    console.log("User error:", userError);

    if (!user) {
      console.log("No authenticated user");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log("Current profile:", profile);
    console.log("Profile error:", profileError);
  };

  return (
    <div>
      <h1>Customer Requests</h1>

      <p>Welcome to your customer portal.</p>

      <p>Logged in as: {session?.user.email}</p>

      <button onClick={handleLogout} disabled={loading}>
        {loading ? "Signing out..." : "Sign Out"}
      </button>

      <button type="button" onClick={testCurrentUser}>
        Test Current User
      </button>

      <Link to="/requests/create">Create Support Request</Link>
    </div>
  );
}
