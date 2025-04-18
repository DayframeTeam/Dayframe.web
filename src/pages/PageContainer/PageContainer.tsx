import styles from './PageContainer.module.scss';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TodayPage } from '../TodayPage/TodayPage.tsx';
import { CalendarPage } from '../CalendarPage/CalendarPage.tsx';
import { TemplatesPage } from '../TemplatesPage/TemplatesPage.tsx';

export function PageContainer() {
  console.log('PageContainer');
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<Navigate to="/today" />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </div>
  );
}
