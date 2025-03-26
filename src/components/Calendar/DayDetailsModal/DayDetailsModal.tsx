import { CalendarEvent } from '../../../types/dbTypes';
import { Modal } from '../../Modal/Modal';
import { CalendarTaskItem } from '../CalendarTaskItem/CalendarTaskItem';

type Props = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  day: number;
  date: string;
  events: CalendarEvent[];
  onMarkDone: (id: number) => void;
  onDelete: (id: number) => void;
}>;

export function DayDetailsModal({
  isOpen,
  onClose,
  date,
  events,
  onMarkDone,
  onDelete,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3>Задачи на {date}</h3>
      {events.length === 0 && <p>Нет задач на этот день</p>}
      {events.map((event) => (
        <CalendarTaskItem
          key={event.id}
          event={event}
          onMarkDone={onMarkDone}
          onDelete={onDelete}
        />
      ))}
    </Modal>
  );
}
