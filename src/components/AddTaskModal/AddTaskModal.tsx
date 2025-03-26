import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask, updateTask, createTemplate, updateTemplate } from '@/store/tasksSlice';
import { nanoid } from 'nanoid';

// Внешние компоненты
import { Modal } from '@/components/ui/Modal';
import { TextInput } from '@/components/ui/TextInput';
import { TextArea } from '@/components/ui/TextArea';
import { SelectInput } from '@/components/ui/SelectInput';
import { DatePicker } from '@/components/ui/DatePicker';
import { TimePicker } from '@/components/ui/TimePicker';
import { SubtaskList } from '@/components/tasks/SubtaskList';
import { RepeatRuleSelector } from '@/components/tasks/RepeatRuleSelector';

export const AddTaskModal = ({
  isOpen,
  onClose,
  mode,
  taskType,
  defaultDate,
  initialData,
  initialSubtasks,
}) => {
  const dispatch = useDispatch();

  // Основные поля
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskDate, setTaskDate] = useState(defaultDate || null);
  const [startTime, setStartTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [exp, setExp] = useState(5);
  const [duration, setDuration] = useState('');
  const [type, setType] = useState('default');
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string }[]>([]);

  // При редактировании — подставляем данные
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setTaskDate(initialData.taskDate ? new Date(initialData.taskDate) : null);
      setStartTime(initialData.startTime || '');
      setPriority(initialData.priority || 'medium');
      setCategory(initialData.category || '');
      setExp(initialData.exp || 0);
      setDuration(initialData.duration || '');
      setType(initialData.type || 'default');
      setRepeatDays(initialData.repeatDays || []);
      setSubtasks(
        (initialSubtasks || []).map((s) => ({ id: String(s.id || nanoid()), title: s.title }))
      );
    }
  }, [mode, initialData, initialSubtasks]);

  // Сохранение задачи или шаблона
  const handleSave = () => {
    const payload = {
      title,
      description,
      category,
      priority,
      exp,
      duration,
      subtasks: subtasks.map((s) => ({ title: s.title })),
    };

    if (taskType === 'task') {
      Object.assign(payload, { taskDate, startTime });
      if (mode === 'create') {
        dispatch(createTask(payload));
      } else {
        dispatch(updateTask({ ...payload, id: initialData.id }));
      }
    } else {
      Object.assign(payload, { type, repeatDays });
      if (mode === 'create') {
        dispatch(createTemplate(payload));
      } else {
        dispatch(updateTemplate({ ...payload, id: initialData.id }));
      }
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Редактировать задачу' : 'Добавить задачу'}
    >
      <div className="flex flex-col gap-4">
        <TextInput label="Заголовок" value={title} onChange={setTitle} required />
        <TextArea label="Описание" value={description} onChange={setDescription} />

        <SelectInput
          label="Приоритет"
          value={priority}
          onChange={setPriority}
          options={[
            { value: 'low', label: 'Низкий' },
            { value: 'medium', label: 'Средний' },
            { value: 'high', label: 'Высокий' },
          ]}
        />

        <SelectInput
          label="Категория"
          value={category}
          onChange={setCategory}
          options={[]} // Добавь свои категории
          allowCustom
        />

        <TextInput label="EXP" value={exp} onChange={(v) => setExp(Number(v))} type="number" />
        <TextInput label="Длительность (чч:мм)" value={duration} onChange={setDuration} />

        {taskType === 'task' && (
          <>
            <DatePicker label="Дата выполнения" value={taskDate} onChange={setTaskDate} />
            <TimePicker label="Время начала" value={startTime} onChange={setStartTime} />
          </>
        )}

        {taskType === 'template' && (
          <RepeatRuleSelector
            type={type}
            onTypeChange={setType}
            repeatDays={repeatDays}
            onDaysChange={setRepeatDays}
          />
        )}

        <SubtaskList subtasks={subtasks} setSubtasks={setSubtasks} />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="btn btn-secondary">
            Отмена
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            {mode === 'edit' ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
