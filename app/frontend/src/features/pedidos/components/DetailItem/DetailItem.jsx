import styles from './DetailItem.module.css';

function DetailItem({ label, value, wide = false }) {
  return (
    <div className={`${styles.item} ${wide ? styles.wide : ''}`}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
}

export default DetailItem;