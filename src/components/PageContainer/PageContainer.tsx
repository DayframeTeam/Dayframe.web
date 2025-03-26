// src/components/PageContainer/PageContainer.tsx
import styles from './PageContainer.module.scss';
import { Routes, Route, Navigate } from 'react-router-dom';
import Today from '../../pages/Today/Today.tsx';
import Plans from '../../pages/Plans/Plans.tsx';
import CalendarPage from '../../pages/CalendarPage/CalendarPage.tsx';

export function PageContainer() {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<Navigate to="/today" />} />
        <Route path="/today" element={<Today />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </div>
  );
}
