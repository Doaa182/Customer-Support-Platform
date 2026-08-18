import { MoonLoader } from "react-spinners";
import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  message = "Loading...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <div
      className={`${styles.container} ${fullScreen ? styles.fullScreen : ""}`}
      role="status"
      aria-live="polite"
    >
      <MoonLoader size={45} color="#4f46e5" />

      <p>{message}</p>
    </div>
  );
}
