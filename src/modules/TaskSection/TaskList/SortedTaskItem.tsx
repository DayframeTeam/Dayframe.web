import { memo } from 'react';
import { useAppSelector } from '../../../hooks/storeHooks';
import { selectTaskById } from '../../../entities/task/store/tasksSlice';
import { TaskItem } from './TaskItem/TaskItem';
import { TemplateTaskSelectors } from '../../../entities/template-tasks/store/templateTasksSlice';
import { TemplateTaskItemForComplete } from '../../Templates/TemplateTaskItemForComplete/TemplateTaskItemForComplete';

type Props = Readonly<{
  taskId: string;
  date: string;
}>;

export const SortedTaskItem = memo(({ taskId, date }: Props) => {
  const task = useAppSelector((state) => selectTaskById(state, taskId));
  const templateTask = useAppSelector((state) => TemplateTaskSelectors.selectTemplateTaskBySpecialId(state, taskId));

  if (!task && !templateTask) return null;

  if (task) {
    return <TaskItem task={task} completionDate={date} />;
  }
  if (templateTask) {
    return <TemplateTaskItemForComplete templateTask={templateTask} taskDate={date} />;
  }
});

SortedTaskItem.displayName = 'SortedTaskItem';
