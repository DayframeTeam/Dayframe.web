import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Modal } from '../../components/Modal/Modal';
import { Task, TemplateTask, RepeatRule, Subtask, TemplateSubtask } from '../../types/dbTypes';
import { Button } from '../ui/Button/Button';
import { TextInput } from '../ui/TextInput/TextInput';
import { SelectInput } from '../ui/SelectInput/SelectInput';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  task: Task | TemplateTask;
  onSave: (updated: Partial<Task | TemplateTask>) => void;
};

export default function TaskEditModal({ isOpen, onClose, task, onSave }: Props) {
  const { t } = useTranslation();
  const isTemplate = 'repeat_rule' in task;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [category, setCategory] = useState(task.category ?? '');
  const [priority, setPriority] = useState(task.priority ?? null);
  const [exp, setExp] = useState(task.exp);
  const [duration, setDuration] = useState(task.duration ?? '');
  const [startTime, setStartTime] = useState(task.start_time ?? '');
  const [endTime, setEndTime] = useState(task.end_time ?? '');
  const [taskDate, setTaskDate] = useState(!isTemplate ? (task.task_date ?? '') : '');
  const [repeatRule, setRepeatRule] = useState<RepeatRule>(isTemplate ? task.repeat_rule : 'daily');
  const [subtasks, setSubtasks] = useState<Subtask[] | TemplateSubtask[]>(task.subtasks || []);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description ?? '');
    setCategory(task.category ?? '');
    setPriority(task.priority ?? null);
    setExp(task.exp);
    setDuration(task.duration ?? '');
    setStartTime(task.start_time ?? '');
    setEndTime(task.end_time ?? '');
    if (!isTemplate) setTaskDate(task.task_date ?? '');
    else setRepeatRule(task.repeat_rule);
    setSubtasks(task.subtasks || []);
  }, [task, isTemplate]);

  const handleSubtaskTitleChange = (index: number, newTitle: string) => {
    const updated = [...subtasks];
    updated[index] = { ...updated[index], title: newTitle };
    if (isTemplate) {
      setSubtasks(updated as TemplateSubtask[]);
    } else {
      setSubtasks(updated as Subtask[]);
    }
  };

  const handleSubtaskDelete = (index: number) => {
    const updated = subtasks.filter((_, i) => i !== index).map((s, i) => ({ ...s, position: i }));

    setSubtasks(updated as Subtask[]); // или as TemplateSubtask[] если шаблон
  };

  const handleSubtaskAdd = () => {
    const newSubtask: any = {
      id: Date.now(), // Временный
      title: '',
      position: subtasks.length,
      special_id: crypto.randomUUID(),
      user_id: task.user_id,
      created_at: new Date().toISOString(),
    };

    if (isTemplate) {
      (newSubtask as TemplateSubtask).template_task_id = (task as TemplateTask).id;
    } else {
      (newSubtask as Subtask).parent_task_id = (task as Task).id;
      (newSubtask as Subtask).is_done = false;
    }

    setSubtasks((prev) => [...prev, newSubtask]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const base = {
      title,
      description,
      category,
      priority,
      exp,
      duration,
      start_time: startTime,
      end_time: endTime,
    };

    const updated = isTemplate
      ? {
          ...base,
          repeat_rule: repeatRule,
          subtasks: subtasks as TemplateSubtask[],
        }
      : {
          ...base,
          task_date: taskDate,
          subtasks: subtasks as Subtask[],
        };

    onSave(updated);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('task.edit')}>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <TextInput label={t('task.title')} value={title} onChange={setTitle} required />
        <TextInput label={t('task.description')} value={description} onChange={setDescription} />
        <TextInput label={t('task.category')} value={category} onChange={setCategory} />
        <SelectInput
          label={t('task.priority')}
          value={priority ?? ''}
          onChange={(val) => setPriority(val as 'low' | 'medium' | 'high')}
          options={[
            { value: 'low', label: t('task.priorityType.low') },
            { value: 'medium', label: t('task.priorityType.medium') },
            { value: 'high', label: t('task.priorityType.high') },
          ]}
        />
        <SelectInput
          label={t('task.exp')}
          value={exp}
          onChange={(v) => setExp(v as 0 | 1 | 5 | 10 | 20 | 50)}
          options={[0, 1, 5, 10, 20, 50].map((xp) => ({
            value: xp,
            label: `+${xp} ⚡`,
          }))}
        />
        <TextInput label={t('task.duration')} value={duration} onChange={setDuration} />
        <TextInput
          label={t('task.timing.start')}
          value={startTime}
          onChange={setStartTime}
          type="time"
        />
        <TextInput label={t('task.timing.end')} value={endTime} onChange={setEndTime} type="time" />

        {!isTemplate ? (
          <TextInput label={t('task.date')} value={taskDate} onChange={setTaskDate} type="date" />
        ) : (
          <SelectInput
            label={t('task.repeat.label')}
            value={Array.isArray(repeatRule) ? 'custom' : repeatRule}
            onChange={(value) =>
              setRepeatRule(value === 'custom' ? [1, 3, 5] : (value as RepeatRule))
            }
            options={[
              { value: 'daily', label: t('task.repeat.daily') },
              { value: 'weekly', label: t('task.repeat.weekly') },
              { value: 'custom', label: t('task.repeat.custom') },
            ]}
          />
        )}

        <div>
          <h3>{t('task.subtasks.label')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {subtasks.map((subtask, index) => (
              <div key={subtask.special_id} style={{ display: 'flex', gap: '0.5rem' }}>
                <TextInput
                  label="название"
                  value={subtask.title}
                  onChange={(val) => handleSubtaskTitleChange(index, val)}
                  placeholder={t('task.subtasks.placeholder')}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleSubtaskDelete(index)}
                >
                  ✖
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleSubtaskAdd}>
              + {t('task.subtasks.add')}
            </Button>
          </div>
        </div>

        <Button type="submit">{t('task.save')}</Button>
      </form>
    </Modal>
  );
}
