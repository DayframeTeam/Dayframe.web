import styles from './SortableSubtaskItem.module.scss';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TextInput } from '../../ui/TextInput/TextInput';
import { Button } from '../../ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { SubtaskLocal, TemplateSubtaskLocal } from '../types';

type Props = Readonly<{
  subtask: SubtaskLocal | TemplateSubtaskLocal;
  onTitleChange: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}>;

export default function SortableSubtaskItem({ subtask, onTitleChange, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: subtask.uniqueKey,
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
          onClick={() => onDelete(subtask.uniqueKey)}
        >
          ✖
        </Button>
      </div>
      <TextInput
        className={styles.textField}
        value={subtask.title}
        onChange={(val) => onTitleChange(subtask.uniqueKey, val)}
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
}
