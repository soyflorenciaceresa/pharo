import styles from './CardMetric.module.css';

function TrendIcon({ direction = 'up' }) {
  const path = direction === 'down' ? 'M1 1L6 7L10 4L15 10M10.5 10L15 10L15 5.5' : 'M1 10L6 4L10 7L15 1M10.5 1L15 1L15 5.5';
  return (
    <svg viewBox="0 0 16 11" width="11" height="11" className={styles.trendIcon}>
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CardMetric({ label, value, trendLabel, trendDirection = 'up' }) {
  return (
    <div className={styles.accentWrap}>
      <div className={styles.card}>
        <div className={styles.row}>
          <p className={styles.label}>{label}</p>
        </div>
        <div className={styles.row}>
          <p className={styles.value}>{value}</p>
          {trendLabel && (
            <div className={styles.trend}>
              <TrendIcon direction={trendDirection} />
              <span>{trendLabel}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
