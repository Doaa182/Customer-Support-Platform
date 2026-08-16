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

  const testRequestRLS = async () => {
    console.log("=== REQUEST RLS TEST ===");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("Current user:", user);
    console.log("User error:", userError);

    if (!user) {
      console.log("No authenticated user.");
      return;
    }

    const { data: createdRequest, error: createError } = await supabase
      .from("requests")
      .insert({
        reference: `TEST-${Date.now()}`,
        customer_id: user.id,
        description: "Temporary RLS test request",
        category: "technical",
        urgency: "low",
      })
      .select()
      .single();

    console.log("Created own request:", createdRequest);
    console.log("Create own request error:", createError);

    const { data: requests, error: readError } = await supabase
      .from("requests")
      .select("*");

    console.log("Visible requests:", requests);
    console.log("Read requests error:", readError);

    const { data: otherRequest, error: otherError } = await supabase
      .from("requests")
      .insert({
        reference: `TEST-OTHER-${Date.now()}`,
        customer_id: "fba77fd5-f80f-445f-a8ea-d34fc87f6934",
        description: "Should be rejected by RLS",
        category: "technical",
        urgency: "low",
      })
      .select()
      .single();

    console.log("Other customer's request:", otherRequest);
    console.log("Other customer's request error:", otherError);
  };

  return (
    <div>
      <h1>Customer Requests</h1>

      <p>Welcome to your customer portal.</p>

      <p>Logged in as: {session?.user.email}</p>

      <button onClick={handleLogout} disabled={loading}>
        {loading ? "Signing out..." : "Sign Out"}
      </button>

      <button onClick={testRequestRLS}>Test Request RLS</button>
    </div>
  );
}
