import clsx from 'clsx';
import { memo, useState } from 'react';
import { Subtask, Task } from '../../../../types/dbTypes';
import { Checkbox } from '../../../../shared/UI/Checkbox/Checkbox';
import styles from '../../../TaskSection/TaskList/TaskItem/SubtaskList/SubtaskItem/SubtaskItem.module.scss';
import { TaskUtils } from '../../../../entities/task/tasks.utils';
import { taskService } from '../../../../entities/task/taskService';

type Props = Readonly<{
  task: Task;
  subtask: Subtask;
}>;

export const TemplateForCompleteSubtaskItem = memo(({ task, subtask }: Props) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Обработчик для чекбокса
  const handleCheckboxChange = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await taskService.createTask(TaskUtils.setSubtaskDone(task, subtask.id, !subtask.is_done));
      //console.log(TaskUtils.setSubtaskDone(task, subtask.id, !subtask.is_done));
    } catch (error) {
      console.error('Ошибка при обновлении статуса подзадачи:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <li className={clsx(styles.item, subtask.is_done && styles.doneLi)}>
      <label
        className={clsx(styles.labelWrapper, subtask.is_done && styles.done)}
        htmlFor={`subtask-${subtask.id}`}
        style={{ pointerEvents: isUpdating ? 'none' : undefined }}
      >
        <Checkbox
          onChange={handleCheckboxChange}
          id={`subtask-${subtask.id}`}
          checked={subtask.is_done}
          disabled={isUpdating}
        />
        <div className={styles.title}>{subtask.title}</div>
      </label>
    </li>
  );
});

TemplateForCompleteSubtaskItem.displayName = 'TemplateForCompleteSubtaskItem';
