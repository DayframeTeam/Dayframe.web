import React, { useMemo, useState } from 'react';
import { CalendarHeader } from './CalendarHeader/CalendarHeader';
import { CalendarGrid } from './CalendarGrid/CalendarGrid';
import { Task } from '../../types/dbTypes';
import { useTranslation } from 'react-i18next';
import { formatDateToISO } from '../../utils/dateUtils';

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const currentDate = today.getDate();
const todayISO = formatDateToISO(currentYear, currentMonth, currentDate);

type Props = Readonly<{
  tasks: Task[];
}>;

export const Calendar = React.memo(({ tasks }: Props) => {
  const { t } = useTranslation();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay =
    today.getMonth() === month && today.getFullYear() === year ? today.getDate() : 0;

  const handlePrev = useMemo(() => {
    return () => {
      if (month === 0) {
        setMonth(11);
        setYear((prev) => prev - 1);
      } else {
        setMonth((prev) => prev - 1);
      }
    };
  }, [month]);

  const handleNext = useMemo(() => {
    return () => {
      if (month === 11) {
        setMonth(0);
        setYear((prev) => prev + 1);
      } else {
        setMonth((prev) => prev + 1);
      }
    };
  }, [month]);

  const handleMonthSelect = useMemo(() => {
    return (selectedMonth: number) => {
      setMonth(selectedMonth);
    };
  }, []);

  const monthNames = t('monthNames', { returnObjects: true }) as string[];
  const monthLabel = `${monthNames[month]} ${year}`;

  // Split tasks into those with dates and those without
  const tasksWithoutDate = useMemo(() => tasks.filter((task) => !task.task_date), [tasks]);

  const filteredTasks = useMemo(() => {
    const withDates = tasks.filter((task) => {
      if (!task.task_date) return false;

      const tasksDate = new Date(task.task_date);
      return tasksDate.getFullYear() === year && tasksDate.getMonth() === month;
    });

    // For today's date, add tasks without dates only if we're in the current month/year
    const isCurrentMonthYear = year === currentYear && month === currentMonth;

    return {
      withDates,
      tasksWithoutDate: isCurrentMonthYear ? tasksWithoutDate : [],
      todayISO,
    };
  }, [tasks, year, month, tasksWithoutDate]);

  return (
    <>
      <CalendarHeader
        monthLabel={monthLabel}
        onPrev={handlePrev}
        onNext={handleNext}
        onMonthSelect={handleMonthSelect}
        currentMonthIndex={month}
        realCurrentMonth={currentMonth}
      />
      <CalendarGrid
        daysInMonth={daysInMonth}
        currentDay={currentDay}
        year={year}
        month={month}
        tasks={filteredTasks.withDates}
        tasksWithoutDate={filteredTasks.tasksWithoutDate}
        todayISO={filteredTasks.todayISO}
      />
    </>
  );
});

Calendar.displayName = 'Calendar';
