import { useMemo, useState } from 'react';
import { CalendarHeader } from './CalendarHeader/CalendarHeader';
import { CalendarGrid } from './CalendarGrid/CalendarGrid';
import type { CalendarEvent } from '../../types/dbTypes';

const today = new Date();

type Props = Readonly<{
  events: CalendarEvent[];
}>;

export default function Calendar({ events }: Props) {
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay =
    today.getMonth() === month && today.getFullYear() === year ? today.getDate() : 0;

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  const monthLabel = new Date(year, month).toLocaleString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.event_date);
      return (
        eventDate.getFullYear() === year &&
        eventDate.getMonth() === month
      );
    });
  }, [events, year, month]);

  return (
    <div style={{ padding: '1rem' }}>
      <CalendarHeader monthLabel={monthLabel} onPrev={handlePrev} onNext={handleNext} />
      <CalendarGrid
        daysInMonth={daysInMonth}
        currentDay={currentDay}
        year={year}
        month={month}
        events={filteredEvents}
      />
    </div>
  );
}
