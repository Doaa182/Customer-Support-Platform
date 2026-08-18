import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <main className={styles['not-found']}>
      <div className={styles.card}>
        <p className={styles.code}>404</p>

        <h1 className={styles.title}>Page Not Found</h1>

        <p className={styles.description}>
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link to="/requests" className={styles.button}>
          Back to Requests
        </Link>
      </div>
    </main>
  );
}
