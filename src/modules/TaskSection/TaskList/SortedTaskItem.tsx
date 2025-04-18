import { memo } from 'react';
import { useAppSelector } from '../../../hooks/storeHooks';
import { selectTaskById } from '../../../entities/task/store/tasksSlice';
import TaskItem from './TaskItem/TaskItem';

type Props = Readonly<{
  taskId: string;
}>;

export const SortedTaskItem = memo(({ taskId }: Props) => {
  // Only get the specific task we need from the store
  const task = useAppSelector((state) => selectTaskById(state, taskId));

  // If task doesn't exist, don't render anything
  if (!task) return null;

  console.log('SortedTaskItem', taskId);

  return <TaskItem task={task} />;
});

SortedTaskItem.displayName = 'SortedTaskItem';
