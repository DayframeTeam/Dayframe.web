import { memo } from 'react';
import styles from './SortableSubtaskItem.module.scss';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TextInput } from '../../ui/TextInput/TextInput';
import { Button } from '../../ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { Subtask, TemplateSubtask, DayTaskSubtask } from '../../../types/dbTypes';

type Props = Readonly<{
  subtask: Subtask | TemplateSubtask | DayTaskSubtask;
  onTitleChange: (special_id: string, newTitle: string) => void;
  onDelete: (special_id: string) => void;
}>;

// Custom equality function for memo to prevent unnecessary re-renders
const areEqual = (prevProps: Props, nextProps: Props) => {
  return (
    prevProps.subtask.special_id === nextProps.subtask.special_id &&
    prevProps.subtask.position === nextProps.subtask.position &&
    prevProps.subtask.is_deleted === nextProps.subtask.is_deleted &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onTitleChange === nextProps.onTitleChange
  );
};

const SortableSubtaskItem = ({ subtask, onTitleChange, onDelete }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: subtask.special_id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { t } = useTranslation();

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={styles.wrapper}>
      <div title={t('task.subtasks.delete')}>
        <Button
          type="button"
          variant="danger"
          size="small"
          onClick={() => onDelete(subtask.special_id)}
        >
          ✖
        </Button>
      </div>
      <TextInput
        id={`subtask-${subtask.special_id}`}
        className={styles.textField}
        value={subtask.title}
        onChange={(val) => onTitleChange(subtask.special_id, val)}
        placeholder={t('task.subtasks.placeholderTitle')}
        required
      />
      <div
        {...listeners}
        className={styles.dragHandle}
        style={{ color: 'var(--subtask-progress-complete' }}
        title={t('task.subtasks.move')}
      >
        ⇅
      </div>
    </div>
  );
};

export default memo(SortableSubtaskItem, areEqual);