import { useRef, useState } from 'react';
import type { Task } from '../../../../types/dbTypes';
import { getPriorityColorIndex } from '../../../../utils/getPriorityColorIndex';
import { formatTime, calculateDuration } from '../../../../utils/dateUtils';
import styles from './TaskItem.module.scss';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '../../../../shared/UI/Checkbox/Checkbox';
import { Badge } from '../../../../shared/UI/Badge/Badge';
import { SubtaskList } from './SubtaskList/SubtaskList';
import { Button } from '../../../../shared/UI/Button/Button';
import { TaskModal } from '../../TaskModal/TaskModal';
import { CustomEditBtn } from '../../../../shared/UI/CustomEditBtn/CustomEditBtn';
import { taskService } from '../../../../entities/task/taskService';

type Props = Readonly<{
  task: Task;
}>;

export function TaskItem({ task }: Props) {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const { t } = useTranslation();
  const colorIndex = getPriorityColorIndex(task.priority);
  console.log('TaskItem');

  // Проверяем наличие подзадач
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  // Вычисляем прогресс выполнения подзадач
  const completedCount = hasSubtasks
    ? task.is_done
      ? task.subtasks.length
      : task.subtasks.filter((s) => s.is_done).length
    : 0;

  const progressPercent = hasSubtasks ? completedCount / task.subtasks.length : 0;
  const progressColor =
    progressPercent === 1
      ? 'var(--subtask-progress-complete)'
      : 'var(--subtask-progress-incomplete)';

  const [showXPAnim, setShowXPAnim] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const animTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUpdateTaskStatus = async () => {
    try {
      setIsLoading(true);
      const newStatus = !task.is_done;
      console.log('newStatus', newStatus);
      // Обновляем статус задачи
      await taskService.updateTaskStatus(task.id, newStatus);

      // Показываем анимацию XP только при выполнении задачи с опытом
      if (newStatus && task.exp && task.exp > 0) {
        setShowXPAnim(true);

        if (animTimeout.current) clearTimeout(animTimeout.current);
        animTimeout.current = setTimeout(() => {
          setShowXPAnim(false);
        }, 1000);
      }
    } catch (err) {
      console.error('Task status update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className={clsx(styles.taskListItem, task.is_done && styles.completed)}>
      <div
        className={clsx(styles.taskItem, hasSubtasks && styles.noPaddingBottom)}
        style={{ borderLeftColor: `var(--select-color-${colorIndex})` }}
      >
        <button className={styles.wrapper} onClick={handleUpdateTaskStatus} disabled={isLoading}>
          <div className={styles.header}>
            <Checkbox id={`task-${task.id}`} checked={task.is_done} disabled />

            <div className={styles.titleBlock}>
              <span
                title={task.title}
                className={clsx(styles.title, task.is_done && styles.completedText)}
              >
                {task.title}
              </span>

              {hasSubtasks && (
                <div className={styles.subtaskSummary} title={t('task.subtasks.progress')}>
                  <div className={styles.subtaskProgress}>
                    <div
                      className={styles.subtaskProgressBar}
                      style={{ width: `${progressPercent * 100}%`, background: progressColor }}
                    />
                  </div>
                  <div className={styles.subtaskText} style={{ color: progressColor }}>
                    {completedCount}/{task.subtasks.length}
                  </div>
                </div>
              )}

              {task.exp !== undefined && task.exp > 0 && (
                <div title={t('task.exp')} className={styles.xp}>
                  +{task.exp}⚡{showXPAnim && <span className={styles.xpAnim}>+{task.exp}⚡</span>}
                </div>
              )}
            </div>
          </div>

          {task.description && (
            <div className={styles.descriptionBlock}>
              <div className={styles.description}>{task.description}</div>
            </div>
          )}

          <div className={styles.metaAndTiming}>
            {(task.start_time || task.end_time) && (
              <div className={styles.timing}>
                {task.start_time && (
                  <span className={styles.timeLabel} title={t('task.timing.start')}>
                    {t('task.timing.from')}{' '}
                    <span className={styles.timeValue}>{formatTime(task.start_time)}</span>
                  </span>
                )}
                {task.end_time && (
                  <span className={styles.timeLabel} title={t('task.timing.end')}>
                    {t('task.timing.to')}{' '}
                    <span className={styles.timeValue}>{formatTime(task.end_time)}</span>
                  </span>
                )}
                {task.start_time && task.end_time && (
                  <span className={styles.durationText} title={t('task.timing.duration')}>
                    {'\u00A0 '}⏳{calculateDuration(task.start_time, task.end_time)}
                    {' ' + t('time.hour') + ':' + t('time.minute')}
                  </span>
                )}
              </div>
            )}

            <div className={styles.meta}>
              {task.category && <Badge label={'# ' + task.category} title={t('task.category')} />}
              {task.priority && (
                <Badge
                  label={t(`task.priorityType.${task.priority}`)}
                  num={colorIndex}
                  title={t('task.priority')}
                />
              )}
            </div>
          </div>
        </button>

        {hasSubtasks && (
          <Button
            className={styles.subtaskToggleBtn}
            onClick={() => setShowSubtasks((prev) => !prev)}
            variant="secondary"
            size="small"
          >
            {showSubtasks ? '▲' : '▼'}
          </Button>
        )}

        {hasSubtasks && showSubtasks && <SubtaskList subtasks={task.subtasks} />}
      </div>

      <CustomEditBtn onClick={() => setIsEditing(true)} />

      {isEditing && (
        <TaskModal isOpen={isEditing} onClose={() => setIsEditing(false)} type="Task" task={task} />
      )}
    </li>
  );
}
