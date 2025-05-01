import { memo, useState } from 'react';
import { TaskList } from './TaskList/TaskList';
import { TaskModal } from './TaskModal/TaskModal';
import { TaskSectionHeader } from './TaskSectionHeader/TaskSectionHeader';

type Props = Readonly<{
  date: string;
}>;

export const TaskSection = memo(({ date }: Props) => {
  const [isAdding, setIsAdding] = useState(false);

  console.log('TaskSection');

  const handleAddTask = () => {
    setIsAdding(true);
  };

  return (
    <section>
      <TaskSectionHeader date={date} onAddTask={handleAddTask} />
      <TaskList date={date} />
      {isAdding && (
        <TaskModal isOpen={isAdding} onClose={() => setIsAdding(false)} task_date={date} />
      )}
    </section>
  );
});

TaskSection.displayName = 'TaskSection';
