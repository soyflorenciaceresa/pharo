import ActivityItem from '../ActivityItem/ActivityItem.jsx';
import styles from './ActivityList.module.css';

export default function ActivityList({ items = [] }) {
  return (
    <div className={styles.list}>
      {items.map((item, i) => (
        <ActivityItem key={item.id ?? i} {...item} />
      ))}
    </div>
  );
}
