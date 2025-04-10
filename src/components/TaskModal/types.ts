import { Subtask, Task, TemplateSubtask, TemplateTask } from '../../types/dbTypes';

export type TaskLocal = Task & {
  is_deleted: boolean;
  subtasks: SubtaskLocal[];
};

export type TemplateTaskLocal = TemplateTask & {
  is_deleted: boolean;
  subtasks: TemplateSubtaskLocal[];
};

export type SubtaskLocal = Subtask & {
  is_deleted: boolean;
  uniqueKey: string; // нужно только для сортировки Drag&Drop
};
export type TemplateSubtaskLocal = TemplateSubtask & {
  is_deleted: boolean;
  uniqueKey: string; // нужно только для сортировки Drag&Drop
};
