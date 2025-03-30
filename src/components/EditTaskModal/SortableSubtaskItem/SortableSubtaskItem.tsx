import styles from './SortableSubtaskItem.module.scss';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TextInput } from '../../ui/TextInput/TextInput';
import { Button } from '../../ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { SubtaskLocal, TemplateSubtaskLocal } from '../EditTaskModal';

type Props = Readonly<{
  id: string;
  subtask: SubtaskLocal | TemplateSubtaskLocal;
  onTitleChange: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}>;

export default function SortableSubtaskItem({ id, subtask, onTitleChange, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { t } = useTranslation();

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={styles.wrapper}>
      <TextInput
        value={subtask.title}
        onChange={(val) => onTitleChange(id, val)}
        placeholder={t('task.subtasks.placeholderTitle')}
      />
      <Button type="button" variant="danger" onClick={() => onDelete(id)}>
        ✖
      </Button>
    </div>
  );
}
