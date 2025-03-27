import { DaySticker } from '../DaySticker/DaySticker';
import styles from './CalendarGrid.module.scss';
import type { Task } from '../../../types/dbTypes';
import { formatDateToISO, toLocalDateString } from '../../../utils/dateUtils';

type Props = Readonly<{
  daysInMonth: number;
  currentDay: number;
  year: number;
  month: number;
  tasks: Task[];
}>;

export function CalendarGrid({ daysInMonth, currentDay, year, month, tasks }: Props) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateString = formatDateToISO(year, month, day);
        const tasksForDay = tasks.filter((task) => toLocalDateString(task.task_date as string) === dateString);

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
