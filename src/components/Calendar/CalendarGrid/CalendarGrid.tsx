import { DaySticker } from '../DaySticker/DaySticker';
import styles from './CalendarGrid.module.scss';
import type { CalendarEvent } from '../../../types/dbTypes';
import { extractISODate, formatDateToISO } from '../../../utils/date';

type Props = Readonly<{
  daysInMonth: number;
  currentDay: number;
  year: number;
  month: number;
  events: CalendarEvent[];
}>;

export function CalendarGrid({ daysInMonth, currentDay, year, month, events }: Props) {

  return (
    <div className={styles.grid}>
      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateString = formatDateToISO(year, month, day);

        const eventsForDay = events.filter((event) => extractISODate(event.event_date) === dateString);
        return (
          <DaySticker
            key={day}
            day={day}
            year={year}
            month={month}
            isToday={day === currentDay}
            events={eventsForDay}
          />
        );
      })}
    </div>
  );
}
