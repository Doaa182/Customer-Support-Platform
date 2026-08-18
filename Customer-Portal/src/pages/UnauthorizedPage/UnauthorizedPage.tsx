import { FaLock } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../services/authService";
import styles from "./UnauthorizedPage.module.css";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  const handleBackToLogin = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <main className={styles["unauthorized-page"]}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <FaLock />
        </div>

        <p className={styles.code}>403</p>

        <h1>Access Denied</h1>

        <p className={styles.description}>
          You don't have permission to access the Customer Portal.
        </p>

        <button
          type="button"
          className={styles.button}
          onClick={handleBackToLogin}
        >
          Back to Login
        </button>
      </div>
    </main>
  );
}
