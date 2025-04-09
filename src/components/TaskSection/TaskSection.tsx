import { useTranslation } from 'react-i18next';
import TaskList from '../TaskList/TaskList';
import type { Task } from '../../types/dbTypes';
import { PlusIcon } from 'lucide-react';
import { Button } from '../ui/Button/Button';
import { useState } from 'react';
import TaskModal from '../TaskModal/TaskModal';

type Props = Readonly<{
  date: string; // в формате 'YYYY-MM-DD'
  tasks: Task[];
}>;

export default function TaskSection({ date, tasks }: Props) {
  const { t } = useTranslation();
  const today = new Date().toLocaleDateString('sv-SE');
  const isToday = date === today;
  const [isAdding, setIsAdding] = useState(false);
  
  return (
    <section style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          {isToday ? t('taskSection.today') : t('taskSection.dateTasks', { date })}
        </h2>
        <Button size="small" variant="primary" onClick={() => setIsAdding(true)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <PlusIcon />
            {t('task.add')}
          </span>
        </Button>
      </div>

      <TaskList tasks={tasks} />
      {isAdding && (
        <TaskModal isOpen={isAdding} onClose={() => setIsAdding(false)}/>
      )}
    </section>
  );
}
