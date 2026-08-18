import { useState } from "react";
import { Link } from "react-router-dom";
import { createRequest } from "../../services/requestService";
import styles from "./CreateRequestPage.module.css";

export default function CreateRequestPage() {
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
    <main className={styles["create-request"]}>
      <Link to="/requests" className={styles["back-link"]}>
        ← Back to Requests
      </Link>

      <div className={styles.card}>
        <h1 className={styles.title}>Create Support Request</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <label className={styles.label} htmlFor="description">
              Description
            </label>

            <textarea
              className={styles.textarea}
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your issue..."
              required
            />
          </div>

          <div className={styles["form-group"]}>
            <label className={styles.label} htmlFor="category">
              Category
            </label>

            <select
              className={styles.select}
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

          <div className={styles["form-group"]}>
            <label className={styles.label} htmlFor="urgency">
              Urgency
            </label>

            <select
              className={styles.select}
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

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className={styles.success} role="status">
              {success}
            </p>
          )}

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Request"}
          </button>
        </form>
      </div>
    </main>
  );
}
