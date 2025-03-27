import { useState } from 'react';
import type { Task, TemplateTask, Subtask, TemplateSubtask } from '../../types/dbTypes';
import { Modal } from '../Modal/Modal';
import { TextInput } from '../ui/TextInput/TextInput';
import { TextArea } from '../ui/TextArea/TextArea';
import { SelectInput } from '../ui/SelectInput/SelectInput';
import TimePicker from '../ui/TimePicker/TimePicker';
import DatePicker from '../ui/DatePicker/DatePicker';
import SubtaskList from '../ui/SubtaskList/SubtaskList';
import { useTranslation } from 'react-i18next';
import { timeStringToDate } from '../../utils/dateUtils';

type Props = {
  task: Task | TemplateTask;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task | TemplateTask) => void;
};

export default function EditTaskModal({ task, isOpen, onClose, onSave }: Props) {
  const { t } = useTranslation();
  const isTemplate = 'repeat_rule' in task;

  const handleSave = () => {
    const updatedTask: Task | TemplateTask = {
      ...task,
      title,
      description,
      category,
      priority,
      exp,
      start_time: startTime,
      end_time: endTime,
      duration,
      ...(isTemplate && {
        start_date: startDate,
        end_date: endDate,
      }),
      subtasks,
    };
    onSave(updatedTask);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('Редактировать задачу')}>
      <TextInput label={t('Название')} value={title} onChange={setTitle} />
      <TextArea label={t('Описание')} value={description} onChange={setDescription} />
      <TextInput label={t('Категория')} value={category} onChange={setCategory} />
      <SelectInput
        label={t('Приоритет')}
        value={priority}
        onChange={setPriority}
        options={[
          { label: t('task.priorityType.low'), value: 'low' },
          { label: t('task.priorityType.medium'), value: 'medium' },
          { label: t('task.priorityType.high'), value: 'high' },
        ]}
      />
      <SelectInput
        label={t('Опыт')}
        value={exp}
        onChange={(val) => setExp(Number(val))}
        options={[0, 1, 5, 10, 20, 50].map((xp) => ({
          label: `${xp}⚡`,
          value: xp,
        }))}
      />
      <TimePicker label={t('task.timing.start')} value={startTime} onChange={setStartTime} />
      <TimePicker label={t('task.timing.end')} value={endTime} onChange={setEndTime} />
      <TextInput label={t('task.timing.duration')} value={duration} onChange={setDuration} />

      {isTemplate && (
        <>
          <DatePicker label={t('task.repeat.from')} value={startDate} onChange={setStartDate} />
          <DatePicker label={t('task.repeat.to')} value={endDate} onChange={setEndDate} />
        </>
      )}

      <SubtaskList subtasks={subtasks} onChange={setSubtasks} editable />

      <div
        style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}
      >
        <button onClick={onClose}>{t('Отмена')}</button>
        <button onClick={handleSave}>{t('Сохранить')}</button>
      </div>
    </Modal>
  );
}
