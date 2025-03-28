import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from 'react';
import { Modal } from '../../components/Modal/Modal';
import { Task, TemplateTask, RepeatRule, Subtask, TemplateSubtask } from '../../types/dbTypes';
import { Button } from '../ui/Button/Button';
import { TextInput } from '../ui/TextInput/TextInput';
import { SelectInput } from '../ui/SelectInput/SelectInput';

type Props = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  task: Task | TemplateTask;
  onSave: (updated: Partial<Task | TemplateTask>) => void;
}>;

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
          id: task.id,
          ...base,
          repeat_rule: repeatRule,
          subtasks: subtasks as TemplateSubtask[],
        }
      : {
          id: task.id,
          ...base,
          task_date: taskDate,
          subtasks: subtasks as Subtask[],
        };
    console.log('[Updated Task]', updated); // 👈 Выводим результат
    //onSave(updated);
    onClose();
  };

  const isChanged = useMemo(() => {
    return (
      title !== task.title ||
      description !== (task.description ?? '') ||
      category !== (task.category ?? '') ||
      priority !== (task.priority ?? null) ||
      exp !== task.exp ||
      duration !== (task.duration ?? '') ||
      startTime !== (task.start_time ?? '') ||
      endTime !== (task.end_time ?? '') ||
      (!isTemplate && taskDate !== (task.task_date ?? '')) ||
      (isTemplate &&
        JSON.stringify(repeatRule) !== JSON.stringify((task as TemplateTask).repeat_rule)) ||
      JSON.stringify(subtasks) !== JSON.stringify(task.subtasks || [])
    );
  }, [
    title,
    description,
    category,
    priority,
    exp,
    duration,
    startTime,
    endTime,
    taskDate,
    repeatRule,
    subtasks,
    task,
    isTemplate,
  ]);

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
        <TextInput label={t('task.duration')} value={duration} onChange={setDuration} type="time" />
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

        <div
          style={{
            display: 'flex',
            flexFlow: 'column wrap',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: "center", justifyContent: "space-between", margin: "20px 0" }}>
            <h3 style={{ margin: "0" }}>{t('task.subtasks.edit')}</h3>
            <Button type="button" variant="secondary" size="small" onClick={handleSubtaskAdd}>
              + {t('task.subtasks.add')}
            </Button>
          </div>
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
          </div>
        </div>

        <Button type="submit" disabled={!isChanged}>
          {t('task.save')}
        </Button>
      </form>
    </Modal>
  );
}
