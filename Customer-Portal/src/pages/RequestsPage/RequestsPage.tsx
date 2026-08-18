import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../../services/authService";
import type { ProtectedRouteProps } from "../../components/auth/ProtectedRoute";
import { getMyRequests, type Request } from "../../services/requestService";
import styles from "./RequestsPage.module.css";

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
    <main className={styles.requestsPage}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Customer Portal</p>

          <h1>My Support Requests</h1>

          <p className={styles.subtitle}>
            View and manage your support requests.
          </p>

          <p className={styles.userInfo}>
            Logged in as: <strong>{session?.user.email}</strong>
          </p>
        </div>

        <div className={styles.headerActions}>
          <Link className={styles.createButton} to="/requests/create">
            Create Support Request
          </Link>

          <button className={styles.signOutButton} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {loading && (
        <div className={styles.stateMessage}>
          <p>Loading your requests...</p>
        </div>
      )}

      {error && (
        <div className={`${styles.stateMessage} ${styles.error}`} role="alert">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && requests.length === 0 && (
        <div className={styles.stateMessage}>
          <h2>No support requests yet</h2>
          <p>You don't have any support requests yet.</p>

          <Link className={styles.createButton} to="/requests/create">
            Create Your First Request
          </Link>
        </div>
      )}

      {!loading && !error && requests.length > 0 && (
        <section className={styles.requestsSection}>
          <header className={styles.sectionHeader}>
            <div>
              <h2>My Requests</h2>
              <p>{requests.length} support request(s)</p>
            </div>
          </header>

          <div className={styles.requestsList}>
            {requests.map((request) => (
              <article className={styles.requestCard} key={request.id}>
                <header className={styles.cardHeader}>
                  <h3>{request.reference}</h3>

                  <span className={styles.status}>
                    {getCustomerStatusLabel(request.status)}
                  </span>
                </header>

                <p className={styles.description}>{request.description}</p>

                <dl className={styles.details}>
                  <div>
                    <dt>Category</dt>
                    <dd>{request.category}</dd>
                  </div>

                  <div>
                    <dt>Urgency</dt>
                    <dd>{request.urgency}</dd>
                  </div>

                  <div>
                    <dt>Status</dt>
                    <dd>{getCustomerStatusLabel(request.status)}</dd>
                  </div>
                </dl>

                <footer className={styles.cardFooter}>
                  <Link
                    className={styles.viewButton}
                    to={`/requests/${request.id}`}
                  >
                    View Request
                  </Link>
                </footer>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
