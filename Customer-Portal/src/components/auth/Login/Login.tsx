import { useState } from "react";
import { signIn } from "../../../services/authService";
import styles from "./Login.module.css";

interface LoginProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

export default function Login({ onSuccess, onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await signIn(email, password);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    onSuccess();
  };

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard} aria-labelledby="login-heading">
        <div className={styles.header}>
          <p className={styles.eyebrow}>Customer Portal</p>

          <h1 id="login-heading">Welcome back</h1>

          <p>Sign in to manage your support requests.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="login-email">Email</label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="login-password">Password</label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.switchAuth}>
          <span>Don't have an account?</span>

          <button type="button" onClick={onSwitchToSignup}>
            Sign Up
          </button>
        </div>
      </section>
    </main>
  );
}
