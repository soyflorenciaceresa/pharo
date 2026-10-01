import LayoutBase from '../LayoutBase/LayoutBase.jsx';
import CardMetric from '../../components/CardMetric/CardMetric.jsx';
import CardQuickAccess from '../../components/CardQuickAccess/CardQuickAccess.jsx';
import ActivityList from '../../components/ActivityList/ActivityList.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import styles from './LayoutHomeModule.module.css';

export default function LayoutHomeModule({
  sidebar,
  activeHref,
  onNavigate,
  onCompanyChange,
  onLogout,
  onToggle,
  onSearch,
  metrics = [],
  quickAccessTitle = 'Acceso rápido',
  quickAccessSubtitle,
  quickAccess = [],
  quickAccessEmptyMessage = 'Todavía no marcaste ningún maestro o proceso como favorito.',
  activityTitle = 'Actividad reciente',
  activitySubtitle,
  activity = [],
}) {
  return (
    <LayoutBase onSearch={onSearch} sidebarProps={{ ...sidebar, defaultActiveHref: activeHref, onNavigate, onCompanyChange, onLogout, onToggle }}>
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
            <PageHeader type="home" title={quickAccessTitle} subtitle={quickAccessSubtitle} />
            {quickAccess.length > 0 ? (
              <div className={styles.quickAccessGrid}>
                {quickAccess.map((qa, i) => (
                  <CardQuickAccess key={qa.id ?? i} {...qa} />
                ))}
              </div>
            ) : (
              <p className={styles.quickAccessEmpty}>{quickAccessEmptyMessage}</p>
            )}
          </section>

          <section className={styles.activityCol}>
            <PageHeader type="home" title={activityTitle} subtitle={activitySubtitle} />
            <ActivityList items={activity} />
          </section>
        </div>
      </div>
    </LayoutBase>
  );
}
