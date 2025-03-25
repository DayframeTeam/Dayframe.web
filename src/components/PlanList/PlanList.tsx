import { useState } from 'react';
import selectTemplates from '../../data/select_options.json';
import { Task, Plan } from '../../types/dbTypes';
import { AddPlanModal } from '../AddPlanModal/AddPlanModal';
import { Badge } from '../Badge/Badge';
import styles from './PlanList.module.scss';

type PlanListProps = Readonly<{
  title: string;
  repeat_rule: Plan['repeat_rule'];
  tasks: (Task | Plan)[];
}>;

const getLabelAndPriority = (type: keyof typeof selectTemplates, value?: string) => {
  if (!value) return null;
  const found = selectTemplates[type]?.find((opt) => opt.value === value);
  return found ? { label: found.label, priority: found.priority } : null;
};

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
        {tasks.map((task, index) => {
          const categoryInfo = getLabelAndPriority('category', task.category);
          const priorityInfo = getLabelAndPriority('priority', task.priority);

          return (
            <div key={index} className={styles.card} onDoubleClick={(e) => e.preventDefault()}>
              <div className={styles.row}>
                <span className={styles.title} title={task.title}>
                  {task.title}
                </span>
                {task.exp && (
                  <span
                    style={{
                      color: `var(--select-color-${categoryInfo?.priority ?? 1})`,
                    }}
                  >
                    +{task.exp}⚡
                  </span>
                )}
              </div>
              <div className={styles.meta}>
                {'start_time' in task && task.start_time && (
                  <span title="Время старта">🕒 {task.start_time}</span>
                )}
                {task.duration && (
                  <span className={styles.metaspans} title="Время выполнения">
                    ⏱ {task.duration}
                  </span>
                )}
                {categoryInfo && (
                  <span title="Категория">
                    <Badge {...categoryInfo} />
                  </span>
                )}
                {priorityInfo && (
                  <span title="Приоритет">
                    <Badge {...priorityInfo} />
                  </span>
                )}
              </div>
              {task.description && (
                <p title="Описание" className={styles.note}>
                  {task.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <AddPlanModal
        repeat_rule={repeat_rule}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
