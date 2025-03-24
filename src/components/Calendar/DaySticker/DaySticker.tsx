import styles from './DaySticker.module.scss';
import type { CalendarEvent } from '../../../types/dbTypes';

type Props = Readonly<{
  day: number;
  isToday?: boolean;
  events?: CalendarEvent[];
}>;

export function DaySticker({ day, isToday = false, events = [] }: Props) {
  return (
    <div className={`${styles.sticker} ${isToday ? styles.today : ''}`}>
      <div className={styles.day}>{day}</div>
      <div className={styles.events}>
        {events.map((event, index) => (
          <div
            key={event.id + '-' + index}
            className={styles.event}
            style={{
              color: `var(--select-color-${event.category === 'required' ? 1 : 2})`,
            }}
            title={event.title}
          >
            {event.start_time?.slice(0, 5)} {event.title}
          </div>
        ))}
      </div>
    </div>
  );
}
