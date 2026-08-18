import { useState } from "react";
import { signUp } from "../../../services/authService";
import styles from "./Signup.module.css";

interface SignupProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function Signup({ onSuccess, onSwitchToLogin }: SignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    const { data, error } = await signUp(name, email, password);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (!data.session) {
      setMessage(
        "Account created. Please check your email to confirm your account.",
      );
      return;
    }

    onSuccess();
  };

  return (
    <main className={styles.signupPage}>
      <section className={styles.signupCard} aria-labelledby="signup-heading">
        <div className={styles.header}>
          <p className={styles.eyebrow}>Customer Portal</p>

          <h1 id="signup-heading">Create your account</h1>

          <p>Sign up to create and manage your support requests.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="name">Name</label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="name"
              placeholder="Enter your name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="signup-email">Email</label>

            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="signup-password">Password</label>

            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="new-password"
              placeholder="Create a password"
            />
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          {message && (
            <p className={styles.message} role="status">
              {message}
            </p>
          )}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className={styles.switchAuth}>
          <span>Already have an account?</span>

          <button type="button" onClick={onSwitchToLogin}>
            Sign In
          </button>
        </div>
      </section>
    </main>
  );
}
