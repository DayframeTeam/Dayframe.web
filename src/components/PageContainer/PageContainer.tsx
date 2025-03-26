import styles from './PageContainer.module.scss';
import { Routes, Route, Navigate } from 'react-router-dom';
import TodayPage from '../../pages/TodayPage/TodayPage.tsx';

export function PageContainer() {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<Navigate to="/today" />} />
        <Route path="/today" element={<TodayPage />} />
        {/* <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/calendar" element={<CalendarPage />} /> */}
      </Routes>
    </div>
  );
}
