import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../services/authService";
import type { ProtectedRouteProps } from "../components/auth/ProtectedRoute";
import { getMyRequests, type Request } from "../services/requestService";

export default function RequestsPage({ session }: ProtectedRouteProps) {
  const navigate = useNavigate();

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    const { error } = await signOut();

    if (!error) {
      navigate("/login");
    }
  };

  const getCustomerStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "New";

      case "in_progress":
        return "Being handled";

      case "waiting_for_customer":
        return "Waiting for your response";

      case "resolved":
        return "Resolved";

      case "closed":
        return "Completed";

      default:
        return status;
    }
  };

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error } = await getMyRequests();

        if (error) {
          throw new Error(error.message);
        }

        setRequests(data ?? []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load your requests.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  return (
    <div>
      <h1>Customer Requests</h1>

      <p>Welcome to your customer portal.</p>

      <p>Logged in as: {session?.user.email}</p>

      <button onClick={handleLogout}>Sign Out</button>

      <Link to="/requests/create">Create Support Request</Link>

      {loading && <p>Loading your requests...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && requests.length === 0 && (
        <p>You don't have any support requests yet.</p>
      )}

      {!loading && !error && requests.length > 0 && (
        <section>
          <h2>My Requests</h2>

          {requests.map((request) => (
            <article key={request.id}>
              <h3>{request.reference}</h3>

              <p>{request.description}</p>

              <p>Category: {request.category}</p>

              <p>Urgency: {request.urgency}</p>

              <p>Status: {getCustomerStatusLabel(request.status)}</p>

              <Link to={`/requests/${request.id}`}>View Request</Link>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
