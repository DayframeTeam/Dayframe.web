import styles from './PageContainer.module.scss';
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

const TodayPage = lazy(() =>
  import('../TodayPage/TodayPage').then((module) => ({
    default: module.TodayPage,
  }))
);

const TemplatesPage = lazy(() =>
  import('../TemplatesPage/TemplatesPage').then((module) => ({
    default: module.TemplatesPage,
  }))
);

const CalendarPage = lazy(() =>
  import('../CalendarPage/CalendarPage').then((module) => ({
    default: module.CalendarPage,
  }))
);

export function PageContainer() {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<Navigate to="/today" replace />} />
        <Route
          path="/today"
          element={
            <Suspense fallback={<div>{t('pageLoading.today')}</div>}>
              <TodayPage />
            </Suspense>
          }
        />

        <Route
          path="/templates"
          element={
            <Suspense fallback={<div>{t('pageLoading.templates')}</div>}>
              <TemplatesPage />
            </Suspense>
          }
        />

        <Route
          path="/calendar"
          element={
            <Suspense fallback={<div>{t('pageLoading.calendar')}</div>}>
              <CalendarPage />
            </Suspense>
          }
        />

        {/* можно добавить 404 */}
        <Route path="*" element={<div>{t('pageLoading.notFound')}</div>} />
      </Routes>
    </div>
  );
}
