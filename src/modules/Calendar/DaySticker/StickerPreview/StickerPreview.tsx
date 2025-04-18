import { memo } from 'react';
import { useAppSelector } from '../../../../hooks/storeHooks';
import { selectTaskById } from '../../../../entities/task/store/tasksSlice';
import styles from './StickerPreview.module.scss';
import { getPriorityColorIndex } from '../../../../utils/getPriorityColorIndex';

type Props = Readonly<{
  taskId: string;
}>;

/**
 * Компонент для отображения превью задачи в календаре
 * Получает задачу по ID и отрисовывает только необходимые данные
 * Такой подход позволяет избежать ненужных перерисовок,
 * когда меняется только одна задача
 */
export const StickerPreview = memo(({ taskId }: Props) => {
  // Получаем задачу по ID
  const task = useAppSelector((state) => selectTaskById(state, taskId));

  // Если задача не найдена, не рендерим ничего
  if (!task) return null;

  console.log('StickerPreview render', taskId);

  return (
    <div
      className={`${styles.event} ${task.is_done ? styles.completed : ''}`}
      style={{
        borderLeftColor: `var(--select-color-${getPriorityColorIndex(task.priority)})`,
      }}
      title={task.title}
    >
      {task.start_time?.slice(0, 5)} {task.title}
    </div>
  );
});

StickerPreview.displayName = 'StickerPreview';
