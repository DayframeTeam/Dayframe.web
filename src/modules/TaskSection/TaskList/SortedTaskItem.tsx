import { memo } from 'react';
import { useAppSelector } from '../../../hooks/storeHooks';
import { selectTaskBySpecialId } from '../../../entities/task/store/tasksSlice';
import { TaskItem } from './TaskItem/TaskItem';

type Props = Readonly<{
  special_id: string;
}>;

export const SortedTaskItem = memo(({ special_id }: Props) => {
  const task = useAppSelector((state) => selectTaskBySpecialId(state, special_id));
  if (!task) return null;

  console.log('SortedTaskItem', special_id);
  return <TaskItem task={task} />;
});

SortedTaskItem.displayName = 'SortedTaskItem';
