import { useState } from 'react';
import styles from './PlanList.module.scss';
import { AddPlanModal } from '../AddPlanModal/AddPlanModal';
import { TaskMetaInfo } from '../TaskMetaInfo/TaskMetaInfo';
import type { Task, Plan } from '../../types/dbTypes';

type PlanListProps = Readonly<{
  title: string;
  repeat_rule: Plan['repeat_rule'];
  tasks: (Task | Plan)[];
}>;

export function PlanList({ title, repeat_rule, tasks }: PlanListProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>
        {title}{' '}
        <button
          className={styles.addButton}
          title="Добавить задачу"
          onClick={() => setModalOpen(true)}
        >
          ＋
        </button>
      </h3>

      <div className={styles.grid}>
        {tasks.map((task, index) => (
          <div key={index} className={styles.card} onDoubleClick={(e) => e.preventDefault()}>
            <span className={styles.title} title={task.title}>
              {task.title}
            </span>

            <TaskMetaInfo
              start_time={'start_time' in task ? task.start_time : undefined}
              duration={task.duration}
              exp={task.exp}
              category={task.category}
              priority={task.priority}
              description={task.description}
            />
          </div>
        ))}
      </div>

      <AddPlanModal
        repeat_rule={repeat_rule}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
