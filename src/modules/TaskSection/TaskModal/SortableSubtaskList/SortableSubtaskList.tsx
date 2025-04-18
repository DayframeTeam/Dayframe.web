import { memo, useCallback } from 'react';
import { Button } from '../../../../shared/UI/Button/Button';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableSubtaskItem from '../SortableSubtaskItem/SortableSubtaskItem';
import { useTranslation } from 'react-i18next';
import shared from '../../../../shared/UI/shared.module.scss';
import { DayTaskSubtask, Subtask, TemplateSubtask } from '../../../../types/dbTypes';

type AnySubtask = Subtask | TemplateSubtask | DayTaskSubtask;

type SortableSubtaskListProps = {
  subtasks: AnySubtask[];
  onSubtaskAdd: () => void;
  onSubtaskDelete: (special_id: string) => void;
  onSubtaskTitleChange: (special_id: string, newTitle: string) => void;
  onSubtasksReorder: (reorderedSubtasks: AnySubtask[]) => void;
};

export const SortableSubtaskList = memo(
  ({
    subtasks,
    onSubtaskAdd,
    onSubtaskDelete,
    onSubtaskTitleChange,
    onSubtasksReorder,
  }: SortableSubtaskListProps) => {
    const { t } = useTranslation();

    const sortedSubtasks = subtasks
      .filter((s) => !s.is_deleted)
      .sort((a, b) => a.position - b.position);

    // Memoize these callbacks to prevent rerenders of child components
    const handleTitleChange = useCallback(
      (special_id: string, newTitle: string) => {
        onSubtaskTitleChange(special_id, newTitle);
      },
      [onSubtaskTitleChange]
    );

    const handleDelete = useCallback(
      (special_id: string) => {
        onSubtaskDelete(special_id);
      },
      [onSubtaskDelete]
    );

    const handleDragEnd = useCallback(
      (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sortedSubtasks.findIndex((s) => s.special_id === active.id);
        const newIndex = sortedSubtasks.findIndex((s) => s.special_id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = [...sortedSubtasks];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);

        const updated = reordered.map((s, idx) => ({ ...s, position: idx }));
        const untouched = subtasks.filter((s) => s.is_deleted);

        onSubtasksReorder([...updated, ...untouched]);
      },
      [sortedSubtasks, subtasks, onSubtasksReorder]
    );

    return (
      <div className={shared.categoryWrapper} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', margin: 0, paddingLeft: '0.5rem' }}>
            {t('task.subtasks.edit')}
          </h3>
          <Button type="button" variant="secondary" size="small" onClick={onSubtaskAdd}>
            + {t('task.subtasks.add')}
          </Button>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={sortedSubtasks.map((s) => s.special_id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedSubtasks.map((subtask) => (
              <SortableSubtaskItem
                key={subtask.special_id}
                subtask={subtask}
                onTitleChange={handleTitleChange}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    );
  }
);

SortableSubtaskList.displayName = 'SortableSubtaskList';
