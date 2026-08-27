import LayoutBase from '../LayoutBase/LayoutBase.jsx';
import CardMetric from '../../components/CardMetric/CardMetric.jsx';
import CardQuickAccess from '../../components/CardQuickAccess/CardQuickAccess.jsx';
import ActivityList from '../../components/ActivityList/ActivityList.jsx';
import styles from './LayoutHomeModule.module.css';

export default function LayoutHomeModule({
  sidebar,
  activeHref,
  onNavigate,
  onCompanyChange,
  onLogout,
  onToggle,
  metrics = [],
  quickAccessTitle = 'Acceso rápido',
  quickAccessSubtitle,
  quickAccess = [],
  activityTitle = 'Actividad reciente',
  activitySubtitle,
  activity = [],
}) {
  return (
    <LayoutBase sidebarProps={{ ...sidebar, defaultActiveHref: activeHref, onNavigate, onCompanyChange, onLogout, onToggle }}>
      <div className={styles.root}>
        {metrics.length > 0 && (
          <div className={styles.metricsRow}>
            {metrics.map((metric, i) => (
              <div key={metric.id ?? i} className={styles.metricSlot}>
                <CardMetric {...metric} />
              </div>
            ))}
          </div>
        )}

        <div className={styles.bottomRow}>
          <section className={styles.quickAccessCol}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{quickAccessTitle}</h2>
              {quickAccessSubtitle && <p className={styles.sectionSubtitle}>{quickAccessSubtitle}</p>}
            </div>
            <div className={styles.quickAccessGrid}>
              {quickAccess.map((qa, i) => (
                <CardQuickAccess key={qa.id ?? i} {...qa} />
              ))}
            </div>
          </section>

          <section className={styles.activityCol}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{activityTitle}</h2>
              {activitySubtitle && <p className={styles.sectionSubtitle}>{activitySubtitle}</p>}
            </div>
            <ActivityList items={activity} />
          </section>
        </div>
      </div>
    </LayoutBase>
  );
}
