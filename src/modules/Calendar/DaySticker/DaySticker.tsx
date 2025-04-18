import { memo, useMemo, useState, useCallback } from 'react';
import styles from './DaySticker.module.scss';
import { getPriorityColorIndex } from '../../../utils/getPriorityColorIndex';
import { TaskSection } from '../../TaskSection/TaskSection';
import { Modal } from '../../../shared/Modal/Modal';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { calendarService } from '../../../entities/calendar/calendarService';
import { format } from 'date-fns';

type Props = Readonly<{
  date: string;
}>;

export const DaySticker = memo(({ date }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  // Мемоизируем объект даты
  const dateObj = useMemo(() => new Date(date), [date]);

  // Мемоизируем текущую дату
  const today = useMemo(() => new Date(), []);

  // Определяем, сегодня ли это
  const isToday = useMemo(() => {
    return format(dateObj, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  }, [dateObj, today]);

  // Проверяем, что день уже прошёл
  const isPast = useMemo(() => dateObj < new Date(today.setHours(0, 0, 0, 0)), [dateObj, today]);

  // Получаем день месяца
  const dayNumber = useMemo(() => dateObj.getDate(), [dateObj]);

  // Получаем отсортированные по времени задачи для этой даты
  const tasks = useSelector(calendarService.selectTasksSortedByTime(dateObj));

  // Используем useCallback для стабильных ссылок на функции
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  console.log('DaySticker');

  // Мемоизируем список задач для предотвращения перерисовок
  const taskIdsList = useMemo(() => tasks.map((task) => task.special_id), [tasks]);

  return (
    <>
      <div
        className={`${styles.sticker} ${isToday ? styles.today : ''} ${isPast ? styles.past : ''}`}
        onClick={handleOpen}
        title={t('ui.clickToOpen')}
      >
        <div className={styles.day}>{dayNumber}</div>
        <div className={styles.events}>
          {tasks.map((task) => (
            <div
              key={task.special_id || task.id}
              className={`${styles.event} ${task.is_done ? styles.completed : ''}`}
              style={{
                borderLeftColor: `var(--select-color-${getPriorityColorIndex(task.priority)})`,
              }}
              title={task.title}
            >
              {task.start_time?.slice(0, 5)} {task.title}
            </div>
          ))}
        </div>
      </div>

      {open && (
        <Modal onClose={handleClose}>
          <TaskSection date={date} taskIds={taskIdsList} />
        </Modal>
      )}
    </>
  );
});

DaySticker.displayName = 'DaySticker';
