import styles from './StatusBadge.module.css';

function StatusBadge({ children }) {
  return <span className={`${styles.badge} ${styles.status}`}>{children}</span>;
}

export default StatusBadge;