import { DaySticker } from '../DaySticker/DaySticker';
import styles from './CalendarGrid.module.scss';
import type { CalendarEvent } from '../../../types/dbTypes';

type Props = Readonly<{
  daysInMonth: number;
  currentDay: number;
  year: number;
  month: number; // от 0 до 11
}>;

// 🔹 Мок данные для примера
const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'Встреча с командой',
    start_time: '10:00:00',
    event_date: '2025-03-05',
    category: 'required',
    priority: 'high',
    user_id: 1,
    created_at: '',
  },
  {
    id: 2,
    title: 'Созвон с заказчиком',
    start_time: '15:30:00',
    event_date: '2025-03-05',
    category: 'optional',
    priority: 'medium',
    user_id: 1,
    created_at: '',
  },
  {
    id: 3,
    title: 'Созвон с заказчиком',
    start_time: '15:30:00',
    event_date: '2025-03-05',
    category: 'optional',
    priority: 'medium',
    user_id: 1,
    created_at: '',
  },
  {
    id: 4,
    title: 'Созвон с заказчиком',
    start_time: '15:30:00',
    event_date: '2025-03-05',
    category: 'optional',
    priority: 'medium',
    user_id: 1,
    created_at: '',
  },
  {
    id: 6,
    title: 'Созвон с заказчикомвававаывавыаываываывавыавыавыаыва',
    start_time: '15:30:00',
    event_date: '2025-03-05',
    category: 'required',
    priority: 'high',
    user_id: 1,
    created_at: '',
  },
  {
    id: 7,
    title: 'Созвон с заказчикомвававаывавыаываываывавыавыавыаыва',
    start_time: '15:30:00',
    event_date: '2025-03-27',
    category: 'required',
    priority: 'high',
    user_id: 1,
    created_at: '',
  },
  {
    id: 5,
    title: 'Йога',
    start_time: '07:00:00',
    event_date: '2025-03-12',
    category: 'optional',
    priority: 'low',
    user_id: 1,
    created_at: '',
  },
];

export function CalendarGrid({ daysInMonth, currentDay, year, month }: Props) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        // 🔸 Фильтруем события по текущему дню
        const eventsForDay = mockEvents.filter((event) => event.event_date === dateString);

        return (
          <DaySticker key={day} day={day} isToday={day === currentDay} events={eventsForDay} />
        );
      })}
    </div>
  );
}
