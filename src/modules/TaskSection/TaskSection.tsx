import { memo, useState } from 'react';
import { TaskList } from './TaskList/TaskList';
import { TaskModal } from './TaskModal/TaskModal';
import { TaskSectionHeader } from './TaskSectionHeader/TaskSectionHeader';

type Props = Readonly<{
  date: string;
  taskIds: string[];
}>;

export const TaskSection = memo(({ date, taskIds }: Props) => {
  const [isAdding, setIsAdding] = useState(false);

  console.log('TaskSection');

  const handleAddTask = () => {
    setIsAdding(true);
  };

  return (
    <section>
      <TaskSectionHeader date={date} onAddTask={handleAddTask} />
      <TaskList taskIds={taskIds} />
      {isAdding && (
        <TaskModal
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
          type="Task"
          task_date={date}
        />
      )}
    </section>
  );
});

TaskSection.displayName = 'TaskSection';
