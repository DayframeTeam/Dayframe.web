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
}>;

export function CalendarGrid({ daysInMonth, currentDay, year, month, tasks }: Props) {
  const { t } = useTranslation();

  // Получаем день недели для первого дня месяца (0 - воскресенье, 1 - понедельник, и т.д.)
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Корректируем индекс, чтобы неделя начиналась с понедельника
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Создаем массив для пустых ячеек в начале месяца
  const emptyDays = Array(startOffset).fill(null);

  // Создаем массив дней недели с переводом
  const weekdays = [1, 2, 3, 4, 5, 6, 0].map((dayIndex) => t(`weekdaysShort.${dayIndex}`));

  return (
    <div className={styles.grid}>
      {/* Заголовки дней недели */}
      {weekdays.map((day) => (
        <div key={day} className={styles.weekDayHeader}>
          {day}
        </div>
      ))}

      {/* Пустые ячейки для выравнивания */}
      {emptyDays.map((_, index) => (
        <div key={`empty-${index}`} className={styles.emptyCell} />
      ))}

      {/* Дни месяца */}
      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateString = formatDateToISO(year, month, day);
        const tasksForDay = tasks.filter(
          (task) => toLocalDateString(task.task_date as string) === dateString
        );

        return (
          <DaySticker
            key={day}
            date={dateString}
            isToday={day === currentDay}
            tasks={tasksForDay}
          />
        );
      })}
    </div>
  );
}
