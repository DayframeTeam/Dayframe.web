import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './DaySticker.module.scss';
import type { CalendarEvent } from '../../../types/dbTypes';
import { DayDetailsModal } from '../DayDetailsModal/DayDetailsModal';
import { formatDateToISO } from '../../../utils/date';
import { getTemplateInfoByValue } from '../../../utils/getTemplateInfoByValue';
import { AppDispatch } from '../../../store';
import { updateCalendarEventStatus } from '../../../features/calendar/calendarThunks';

type Props = Readonly<{
  day: number;
  isToday?: boolean;
  events?: CalendarEvent[];
  year: number;
  month: number;
}>;

export function DaySticker({ day, isToday = false, events = [], year, month }: Props) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // защита от спама
  const dispatch = useDispatch<AppDispatch>();
  const dateString = formatDateToISO(year, month, day);

  const handleStatusChange = async (id: number) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const event = events.find((e) => e.id === id);
    if (!event) return;

    const newStatus = event.status === 'done' ? 'planned' : 'done';

    try {
      await dispatch(updateCalendarEventStatus({ eventId: id, status: newStatus }));
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div
        className={`${styles.sticker} ${isToday ? styles.today : ''}`}
        onClick={() => setOpen(true)}
        title="Нажмите, чтобы открыть"
      >
        <div className={styles.day}>{day}</div>
        <div className={styles.events}>
          {events.map((event) => (
            <div
              key={event.id}
              className={styles.event}
              style={{
                color: `var(--select-color-${getTemplateInfoByValue('priority', event.priority)?.priority})`,
              }}
              title={event.title}
            >
              {event.start_time?.slice(0, 5)} {event.title}
            </div>
          ))}
        </div>
      </div>

      {open && (
        <DayDetailsModal
          isOpen={open}
          onClose={() => setOpen(false)}
          day={day}
          date={dateString}
          events={events}
          onMarkDone={handleStatusChange}
          onDelete={(id) => {
            console.log('🗑 Удалить задачу:', id);
            // TODO: dispatch удаления
          }}
        />
      )}
    </>
  );
}
