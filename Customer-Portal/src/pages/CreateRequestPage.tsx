import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../services/requestService";

export default function CreateRequestPage() {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState<"low" | "medium" | "high">("medium");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const reference = `REQ-${Date.now()}`;

      const { error } = await createRequest({
        reference,
        description,
        category,
        urgency,
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccess("Your support request was created successfully.");

      setDescription("");
      setCategory("");
      setUrgency("medium");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create support request.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1>Create Support Request</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>

          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="account">Account</option>
            <option value="general">General</option>
          </select>
        </div>

        <div>
          <label htmlFor="urgency">Urgency</label>

          <select
            id="urgency"
            value={urgency}
            onChange={(event) =>
              setUrgency(event.target.value as "low" | "medium" | "high")
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {error && <p>{error}</p>}

        {success && <p>{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Request"}
        </button>
      </form>

      <button type="button" onClick={() => navigate("/requests")}>
        Back to Requests
      </button>
    </section>
  );
}
