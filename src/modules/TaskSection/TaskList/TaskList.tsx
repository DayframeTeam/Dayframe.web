import { useTranslation } from 'react-i18next';
import styles from './TaskList.module.scss';
import { memo, useMemo } from 'react';
import { SortedTaskItem } from './SortedTaskItem';
import { selectTasksByDateIncludingUndated } from '../../../entities/task/store/tasksSlice';
import { useAppSelector } from '../../../hooks/storeHooks';
import { TemplateTaskSelectors } from '../../../entities/template-tasks/store/templateTasksSlice';
import { Sorter } from '../../../utils/sort';

type Props = Readonly<{
  date: string;
}>;

export const TaskList = memo(({ date }: Props) => {
  const { t } = useTranslation();

  // Получаем все задачи для даты
  const tasks = useAppSelector((state) => selectTasksByDateIncludingUndated(state, date));

  // Получаем шаблонные задачи для даты
  const templateTasks = useAppSelector((state) =>
    TemplateTaskSelectors.selectTemplateTasksByDate(state, date)
  );

  // Мемоизируем список ID задач, чтобы предотвратить лишние перерисовки
  const taskIds = useMemo(() => {
    const sortedTasks = [...tasks, ...templateTasks].sort(Sorter.complexSort);
    return sortedTasks.map((task) => task.special_id);
  }, [tasks, templateTasks]);

  if (taskIds.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>{t('taskSection.empty')}</p>;
  }

  return (
    <div className={styles.taskListWrapper}>
      <ul className={styles.taskList}>
        {taskIds.map((taskId) => (
          <SortedTaskItem key={taskId} taskId={taskId} date={date} />
        ))}
      </ul>
    </div>
  );
});

TaskList.displayName = 'TaskList';
