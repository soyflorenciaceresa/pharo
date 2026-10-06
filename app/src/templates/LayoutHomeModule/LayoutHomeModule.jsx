import LayoutBase from '../LayoutBase/LayoutBase.jsx';
import CardMetric from '../../components/CardMetric/CardMetric.jsx';
import CardQuickAccess from '../../components/CardQuickAccess/CardQuickAccess.jsx';
import ActivityList from '../../components/ActivityList/ActivityList.jsx';
import Message from '../../components/Message/Message.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import { QUICK_ACCESS_INITIAL_MESSAGE } from '../../config/companyAccess.js';
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
  // Estado inicial de la empresa (nada configurado todavía): el Acceso rápido muestra
  // un `Message` y la Actividad reciente un `EmptyState`, igual que Main/Home.
  initialState = false,
  activeCompanyId,
}) {
  return (
    <LayoutBase onSearch={onSearch} sidebarProps={{ ...sidebar, defaultActiveCompanyId: activeCompanyId ?? sidebar.defaultActiveCompanyId, defaultActiveHref: activeHref, onNavigate, onCompanyChange, onLogout, onToggle }}>
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
            {initialState ? (
              <Message {...QUICK_ACCESS_INITIAL_MESSAGE} />
            ) : quickAccess.length > 0 ? (
              <div className={styles.quickAccessGrid}>
                {/* En las Home de módulo la card lleva solo el título (sin segunda línea con el grupo/módulo). */}
                {quickAccess.map((qa, i) => (
                  <CardQuickAccess key={qa.id ?? i} {...qa} subtitle={undefined} />
                ))}
              </div>
            ) : (
              <p className={styles.quickAccessEmpty}>{quickAccessEmptyMessage}</p>
            )}
          </section>

          <section className={styles.activityCol}>
            <PageHeader type="home" title={activityTitle} subtitle={activitySubtitle} />
            {initialState ? <EmptyState /> : <ActivityList items={activity} />}
          </section>
        </div>
      </div>
    </LayoutBase>
  );
}
