import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface RequestDetails {
  id: string;
  reference: string;
  description: string;
  category: string;
  urgency: "low" | "medium" | "high";
  status:
    | "open"
    | "in_progress"
    | "waiting_for_customer"
    | "resolved"
    | "closed";
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export default function RequestDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [request, setRequest] = useState<RequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequest = async () => {
      if (!id) {
        setError("Request not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
          .from("requests")
          .select(
            "id, reference, description, category, urgency, status, created_at, updated_at, resolved_at",
          )
          .eq("id", id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        setRequest(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load the request.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadRequest();
  }, [id]);

  if (loading) {
    return <p>Loading request...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <p>Request not found or you don't have permission to view it.</p>
        <Link to="/requests">Back to Requests</Link>
      </div>
    );
  }

  if (!request) {
    return (
      <div>
        <p>Request not found.</p>
        <Link to="/requests">Back to Requests</Link>
      </div>
    );
  }

  return (
    <section>
      <Link to="/requests">← Back to Requests</Link>

      <h1>{request.reference}</h1>

      <p>{request.description}</p>

      <p>Category: {request.category}</p>

      <p>Urgency: {request.urgency}</p>

      <p>Status: {request.status}</p>

      <p>Created: {request.created_at}</p>

      <p>Last updated: {request.updated_at}</p>

      {request.resolved_at && <p>Resolved: {request.resolved_at}</p>}
    </section>
  );
}
