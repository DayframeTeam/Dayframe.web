import styles from './PageContainer.module.scss'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { useSwipeable } from 'react-swipeable'

const TodayPage = lazy(() =>
  import('../TodayPage/TodayPage').then(m => ({ default: m.TodayPage }))
)
const TemplatesPage = lazy(() =>
  import('../TemplatesPage/TemplatesPage').then(m => ({ default: m.TemplatesPage }))
)
const CalendarPage = lazy(() =>
  import('../CalendarPage/CalendarPage').then(m => ({ default: m.CalendarPage }))
)

export function PageContainer() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // порядок роутов для свайпа
  const pages = ['/today', '/templates', '/calendar']
  const currentIndex = pages.findIndex(p => pathname.startsWith(p))

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex >= 0 && currentIndex < pages.length - 1) {
        navigate(pages[currentIndex + 1])
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        navigate(pages[currentIndex - 1])
      }
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
    delta: 50,
  })

  return (
    <div {...handlers} className={styles.container}>
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
  )
}
