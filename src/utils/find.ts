import { Task } from '../types/dbTypes';

export class TaskFind {
  static findTaskById(tasks: Task[], id: number): Task | undefined {
    return tasks.find((task) => task.id === id);
  }
}

