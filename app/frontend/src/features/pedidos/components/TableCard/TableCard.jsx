import styles from './TableCard.module.css';

function TableCard({ title, children }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default TableCard;