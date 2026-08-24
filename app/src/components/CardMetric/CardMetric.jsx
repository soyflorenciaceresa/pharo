import styles from './CardMetric.module.css';

function sparklinePath(data, width, height) {
  if (!data || data.length < 2) return '';
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  return data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function Sparkline({ data, width = 62, height = 20 }) {
  const d = sparklinePath(data, width, height);
  if (!d) return null;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={styles.sparkline}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendIcon({ direction = 'up' }) {
  const path = direction === 'down' ? 'M1 1L6 7L10 4L15 10M10.5 10L15 10L15 5.5' : 'M1 10L6 4L10 7L15 1M10.5 1L15 1L15 5.5';
  return (
    <svg viewBox="0 0 16 11" width="11" height="11" className={styles.trendIcon}>
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CardMetric({ label, value, trendLabel, trendDirection = 'up', data }) {
  return (
    <div className={styles.accentWrap}>
      <div className={styles.card}>
        <div className={styles.row}>
          <p className={styles.label}>{label}</p>
          {data && (
            <div className={styles.chart}>
              <Sparkline data={data} />
            </div>
          )}
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
