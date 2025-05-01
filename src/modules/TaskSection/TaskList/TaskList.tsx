import { useTranslation } from 'react-i18next';
import styles from './TaskList.module.scss';
import { memo } from 'react';
import { SortedTaskItem } from './SortedTaskItem';
import { selectTaskIdsByDateIncludingUndated, selectTasksByDateIncludingUndated } from '../../../entities/task/store/tasksSlice';
import { useAppSelector } from '../../../hooks/storeHooks';
import { TemplateTaskSelectors } from '../../../entities/template-tasks/store/templateTasksSlice';
import { TemplateTaskUtils } from '../../../entities/template-tasks/template.tasks.utils';
import { Sorter } from '../../../utils/sort';

type Props = Readonly<{
  date: string;
}>;

export const TaskList = memo(({ date }: Props) => {
  const { t } = useTranslation();
  const tasks = useAppSelector((state) => selectTasksByDateIncludingUndated(state, date));
  const templateTasks = useAppSelector((state) => TemplateTaskSelectors.selectTemplateTasksByDate(state, date));
  const sortedTasks = [...tasks, ...templateTasks].sort(Sorter.complexSort);

  if (sortedTasks.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>{t('taskSection.empty')}</p>;
  }

  console.log('TaskList');
  return (
    <div className={styles.taskListWrapper}>
      <ul className={styles.taskList}>
        {sortedTasks.map((task) => (
          <SortedTaskItem key={task.special_id} taskId={task.special_id} date={date} />
        ))}
      </ul>
    </div>
  );
});

TaskList.displayName = 'TaskList';
