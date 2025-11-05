import React, { useState, useEffect, useRef } from 'react';
import { CalendarHeader } from './CalendarHeader/CalendarHeader';
import { CalendarGrid } from './CalendarGrid/CalendarGrid';
import { taskService } from '../../entities/task/taskService';
import { useSelector } from 'react-redux';
import { selectAllTasks } from '../../entities/task/store/tasksSlice';

const today = new Date();

export const Calendar = React.memo(() => {
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const tasks = useSelector(selectAllTasks);
  const loadedMonthsRef = useRef<Set<string>>(new Set());

  // Обработчик изменения месяца/года
  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  // Загружаем задачи за месяц при смене месяца
  useEffect(() => {
    const monthKey = `${year}-${month}`;

    // Проверяем, не загружены ли уже задачи за этот месяц
    if (loadedMonthsRef.current.has(monthKey)) {
      return;
    }

    // Проверяем, есть ли задачи за этот месяц в store
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const tasksInMonth = tasks.filter((task) => {
      if (!task.task_date) return false;
      const taskDate = task.task_date.split('T')[0];
      return taskDate >= startDate && taskDate <= endDate;
    });

    // Если задач нет или их очень мало, загружаем задачи за месяц
    if (tasksInMonth.length === 0) {
      taskService.fetchTasksForPeriod(startDate, endDate).then(() => {
        loadedMonthsRef.current.add(monthKey);
      });
    } else {
      // Если задачи есть, помечаем месяц как загруженный
      loadedMonthsRef.current.add(monthKey);
    }
  }, [month, year, tasks]);

  return (
    <>
      <CalendarHeader month={month} year={year} onMonthChange={handleMonthChange} />
      <CalendarGrid daysInMonth={daysInMonth} year={year} month={month} />
    </>
  );
});

Calendar.displayName = 'Calendar';
