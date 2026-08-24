import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import TopBar from '../../components/TopBar/TopBar.jsx';
import styles from './LayoutBase.module.css';

export default function LayoutBase({ sidebarProps, children }) {
  return (
    <div className={styles.root}>
      <Sidebar {...sidebarProps} />
      <div className={styles.main}>
        <TopBar />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
