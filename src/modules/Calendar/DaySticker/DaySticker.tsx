import { memo, useMemo, useState, useCallback } from 'react';
import styles from './DaySticker.module.scss';
import { TaskSection } from '../../TaskSection/TaskSection';
import { Modal } from '../../../shared/Modal/Modal';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../hooks/storeHooks';
import { selectTaskIdsByDate } from '../../../entities/task/store/tasksSlice';
import { CommonTaskSelectors } from '../../../entities/common/selectors';
import { format } from 'date-fns';
import { StickerPreview } from './StickerPreview/StickerPreview';
import { shallowEqual } from 'react-redux';

type Props = Readonly<{
  date: string;
}>;

/**
 * Оптимизированная версия DaySticker, которая не перерисовывается
 * при изменениях в задачах, не относящихся к этому дню
 */
export const DaySticker = memo(
  ({ date }: Props) => {
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

    // Для прошедших дней используем только обычные задачи, для остальных - все задачи
    const taskIds = useAppSelector(
      (state) =>
        isPast
          ? selectTaskIdsByDate(state, date)
          : CommonTaskSelectors.selectSortedTaskIdsForDate(state, date),
      shallowEqual
    );

    // Используем useCallback для стабильных ссылок на функции
    const handleOpen = useCallback(() => {
      setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
      setOpen(false);
    }, []);

    console.log('DaySticker render', date);

    const renderContent = useMemo(() => {
      // Мемоизируем превью задач, чтобы не создавать элементы заново при перерисовке
      return (
        <>
          <div className={styles.day}>{dayNumber}</div>
          <div className={styles.events}>
            {taskIds.map((special_id) => (
              <StickerPreview key={special_id} taskId={special_id} />
            ))}
          </div>
        </>
      );
    }, [dayNumber, taskIds]);

    return (
      <>
        <div
          className={`${styles.sticker} ${isToday ? styles.today : ''} ${isPast ? styles.past : ''}`}
          onClick={handleOpen}
          title={t('ui.clickToOpen')}
        >
          {renderContent}
        </div>

        {open && (
          <Modal onClose={handleClose}>
            <TaskSection date={date} />
          </Modal>
        )}
      </>
    );
  },
  (prevProps, nextProps) => {
    // Дополнительная проверка для memo - перерисовываем только если изменилась дата
    return prevProps.date === nextProps.date;
  }
);

DaySticker.displayName = 'DaySticker';
