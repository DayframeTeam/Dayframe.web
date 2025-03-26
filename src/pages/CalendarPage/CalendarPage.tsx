import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchCalendarEvents } from '../../features/calendar/calendarThunks';
import Calendar from '../../components/Calendar/Calendar';

export default function CalendarPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector((state: RootState) => state.calendar);

  useEffect(() => {
    if (list.length === 0) {
      dispatch(fetchCalendarEvents(1)); // TODO: динамический userId
    }
  }, [dispatch, list.length]);

  if (loading) return <p>📅 Загрузка календаря...</p>;
  if (error) return <p style={{ color: 'red' }}>Ошибка: {error}</p>;

  return <Calendar events={list} />;
}
