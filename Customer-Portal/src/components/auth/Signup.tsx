import { useState } from "react";
import { signUp } from "../../services/authService";

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
    <div>
      <h1>Customer Portal</h1>

      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="signup-email">Email</label>

          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="signup-password">Password</label>

          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}

        {message && <p>{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p>
        Already have an account?
        <button type="button" onClick={onSwitchToLogin}>
          Sign In
        </button>
      </p>
    </div>
  );
}
