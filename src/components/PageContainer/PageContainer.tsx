// src/components/PageContainer/PageContainer.tsx
import styles from './PageContainer.module.scss';
import { Routes, Route, Navigate } from 'react-router-dom';
import Today from '../../pages/Today/Today.tsx';
import Templates from '../../pages/Templates/Templates.tsx';
import Calendar from '../../pages/Calendar/Calendar.tsx';

export function PageContainer() {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<Navigate to="/today" />} />
        <Route path="/today" element={<Today />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </div>
  );
}
