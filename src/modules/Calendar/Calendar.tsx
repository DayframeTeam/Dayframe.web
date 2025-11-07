import React, { useState } from 'react';
import { CalendarHeader } from './CalendarHeader/CalendarHeader';
import { CalendarGrid } from './CalendarGrid/CalendarGrid';

const today = new Date();

export const Calendar = React.memo(() => {
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Обработчик изменения месяца/года
  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <>
      <CalendarHeader month={month} year={year} onMonthChange={handleMonthChange} />
      <CalendarGrid daysInMonth={daysInMonth} year={year} month={month} />
    </>
  );
});

Calendar.displayName = 'Calendar';
