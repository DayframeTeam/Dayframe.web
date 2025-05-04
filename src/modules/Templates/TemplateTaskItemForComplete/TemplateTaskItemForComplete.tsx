import { TemplateTask } from '../../../types/dbTypes';
import { memo, useState } from 'react';
import { TemplateTaskUtils } from '../../../entities/template-tasks/template.tasks.utils';
import { useTranslation } from 'react-i18next';
import { getPriorityColorIndex } from '../../../utils/getPriorityColorIndex';
import clsx from 'clsx';
import { Checkbox } from '../../../shared/UI/Checkbox/Checkbox';
import { calculateDuration, formatTime } from '../../../utils/dateUtils';
import { Badge } from '../../../shared/UI/Badge/Badge';
import { Button } from '../../../shared/UI/Button/Button';
import RepeatRuleSelector from '../../../widgets/RepeatRuleSelector/RepeatRuleSelector';
import styles from '../../TaskSection/TaskList/TaskItem/TaskItem.module.scss';
import templateVersionStyles from './TemplateTaskItemForComplete.module.scss';
import { taskService } from '../../../entities/task/taskService';
import { TaskUtils } from '../../../entities/task/tasks.utils';
import { TemplateForCompleteSubtaskList } from './TemplateForCompleteSubtaskList/TemplateForCompleteSubtaskList';

type Props = Readonly<{
  templateTask: TemplateTask;
  taskDate: string;
}>;

export const TemplateTaskItemForComplete = memo(({ templateTask, taskDate }: Props) => {
  const task = TemplateTaskUtils.convertTemplateToTask(templateTask, taskDate);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const { t } = useTranslation();
  const colorIndex = getPriorityColorIndex(task.priority);
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
  const [isLoading, setIsLoading] = useState(false);

  const createCompletedTask = async () => {
    setIsLoading(true);
    try {
      await taskService.createTask(TaskUtils.createCompletedTask(task));
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className={clsx(styles.taskListItem, task.is_done && styles.completed)}>
      <div
        className={clsx(styles.taskItem, templateVersionStyles.taskItem, hasSubtasks && styles.noPaddingBottom)}
        style={{ borderLeftColor: `var(--select-color-${colorIndex})` }}
      >
        <button className={styles.wrapper} onClick={createCompletedTask} disabled={isLoading}>
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
                  +{task.exp}⚡
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
              {task.category && <Badge label={'#' + task.category} title={t('task.category')} />}
              {task.priority && (
                <Badge
                  label={t(`task.priorityType.${task.priority}`)}
                  num={colorIndex}
                  title={t('task.priority')}
                />
              )}
            </div>
          </div>
          <RepeatRuleSelector value={templateTask.repeat_rule} selectable={false} className={templateVersionStyles.repeatRuleSelector} />
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

        {hasSubtasks && showSubtasks && <TemplateForCompleteSubtaskList task={task} subtasks={task.subtasks} />}
      </div>
    </li>
  );
});

TemplateTaskItemForComplete.displayName = 'TemplateTaskItemForComplete';
