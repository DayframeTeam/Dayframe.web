import { nanoid } from 'nanoid';
import { Subtask, Task } from '../../types/dbTypes';

/**
 * Class containing utility methods for working with tasks
 */
export class TaskUtils {
  /**
   * Creates an empty task with default values
   * @param task_date Optional date for the task
   * @returns A new empty task object
   */
  static createEmptyTask(task_date?: string): Task {
    return {
      id: 0,
      title: '',
      description: undefined,
      category: undefined,
      priority: undefined,
      exp: 0,
      start_time: undefined,
      end_time: undefined,
      user_id: 0,
      created_at: '',
      special_id: nanoid(),
      is_done: false,
      task_date,
      subtasks: [],
    };
  }

  static createCompletedTask(task: Task): Task {
    return {
      ...task,
      is_done: true,
      subtasks: task.subtasks.map((subtask) => this.createCompletedSubtask(subtask)),
    };
  }

  static createCompletedSubtask(subtask: Subtask): Subtask {
    return {
      ...subtask,
      is_done: true,
    };
  }

  static setSubtaskDone(task: Task, subtaskId: number, isDone: boolean): Task {
    return {
      ...task,
      subtasks: task.subtasks.map((st) => (st.id === subtaskId ? { ...st, is_done: isDone } : st)),
    };
  }

  //создаю уникальный ключ для стора и верстки
  static createTaskUniqueKey(task: Task): string {
    return `t${task.id}`;
  }
}

// Export the createEmptyTask function directly for backward compatibility
export const createEmptyTask = TaskUtils.createEmptyTask;
