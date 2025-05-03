import { memo } from 'react';
import { useAppSelector } from '../../../../hooks/storeHooks';
import { selectTaskById } from '../../../../entities/task/store/tasksSlice';
import styles from './StickerPreview.module.scss';
import { getPriorityColorIndex } from '../../../../utils/getPriorityColorIndex';
import { TemplateTaskSelectors } from '../../../../entities/template-tasks/store/templateTasksSlice';

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
  const templateTask = useAppSelector((state) =>
    TemplateTaskSelectors.selectTemplateTaskBySpecialId(state, taskId)
  );

  if (!task && !templateTask) return null;

  // Определяем, какую задачу отображать
  const displayTask = task || templateTask;
  const isTemplate = !!templateTask;

  return (
    <div
      className={`${styles.event} ${!isTemplate && task.is_done ? styles.completed : ''}`}
      style={{
        borderLeftColor: `var(--select-color-${getPriorityColorIndex(displayTask.priority)})`,
      }}
      title={displayTask.title}
    >
      {displayTask.start_time?.slice(0, 5)} {displayTask.title}
    </div>
  );
});

StickerPreview.displayName = 'StickerPreview';
