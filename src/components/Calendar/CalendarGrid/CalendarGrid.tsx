import React, { useMemo } from 'react';
import { DaySticker } from '../DaySticker/DaySticker';
import styles from './CalendarGrid.module.scss';
import type { Task } from '../../../types/dbTypes';
import { formatDateToISO, toLocalDateString } from '../../../utils/dateUtils';
import { useTranslation } from 'react-i18next';

type Props = Readonly<{
  daysInMonth: number;
  currentDay: number;
  year: number;
  month: number;
  tasks: Task[];
  tasksWithoutDate?: Task[];
  todayISO?: string;
}>;

export const CalendarGrid = React.memo(
  ({
    daysInMonth,
    currentDay,
    year,
    month,
    tasks,
    tasksWithoutDate = [],
    todayISO = '',
  }: Props) => {
    const { t } = useTranslation();

    // Получаем день недели для первого дня месяца (0 - воскресенье, 1 - понедельник, и т.д.)
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Корректируем индекс, чтобы неделя начиналась с понедельника
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Создаем массив для пустых ячеек в начале месяца
    const emptyDays = useMemo(() => Array(startOffset).fill(null), [startOffset]);

    // Создаем массив дней недели с переводом
    const weekdays = useMemo(
      () => [1, 2, 3, 4, 5, 6, 0].map((dayIndex) => t(`weekdaysShort.${dayIndex}`)),
      [t]
    );
    console.log('CalendarGrid');
    // Подготовка дней месяца
    const monthDays = useMemo(() => {
      return Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateString = formatDateToISO(year, month, day);
        const tasksForDay = tasks.filter(
          (task) => toLocalDateString(task.task_date as string) === dateString
        );

        // If this is today's date, add tasks without dates
        if (dateString === todayISO && tasksWithoutDate.length > 0) {
          tasksForDay.push(...tasksWithoutDate);
        }

        return {
          day,
          dateString,
          isToday: day === currentDay,
          tasksForDay,
          key: `${year}-${month}-${day}`,
        };
      });
    }, [daysInMonth, year, month, currentDay, tasks, tasksWithoutDate, todayISO]);

    return (
      <div className={styles.grid}>
        {/* Заголовки дней недели */}
        {weekdays.map((day, index) => (
          <div key={`weekday-${index}`} className={styles.weekDayHeader}>
            {day}
          </div>
        ))}

        {/* Пустые ячейки для выравнивания */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className={styles.emptyCell} />
        ))}

        {/* Дни месяца */}
        {monthDays.map(({ key, dateString, isToday, tasksForDay }) => (
          <DaySticker key={key} date={dateString} isToday={isToday} tasks={tasksForDay} />
        ))}
      </div>
    );
  }
);

CalendarGrid.displayName = 'CalendarGrid';
