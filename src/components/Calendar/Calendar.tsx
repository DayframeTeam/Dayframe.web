import { useState } from 'react';
import { CalendarHeader } from './CalendarHeader/CalendarHeader';
import { CalendarGrid } from './CalendarGrid/CalendarGrid';

const today = new Date();

export default function CalendarPage() {
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay =
    today.getMonth() === month && today.getFullYear() === year ? today.getDate() : 0;

  const handlePrev = () => setMonth((prev) => (prev === 0 ? 11 : prev - 1));
  const handleNext = () => setMonth((prev) => (prev === 11 ? 0 : prev + 1));

  const monthLabel = new Date(year, month).toLocaleString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div style={{ padding: '1rem' }}>
      <CalendarHeader monthLabel={monthLabel} onPrev={handlePrev} onNext={handleNext} />
      <CalendarGrid daysInMonth={daysInMonth} currentDay={currentDay} year={year} month={month} />
    </div>
  );
}
