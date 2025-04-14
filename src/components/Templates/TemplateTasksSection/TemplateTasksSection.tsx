import { memo, useState } from 'react';
import styles from './TemplateTasksSection.module.scss';
import { RepeatRule, TemplateTask } from '../../../types/dbTypes';
import { useTranslation } from 'react-i18next';
import { TemplateTaskItem } from '../TemplateTaskItem/TemplateTaskItem';
import { Button } from '../../ui/Button/Button';
import { InfoIcon, PlusIcon } from 'lucide-react';
import { QuestsInfoModal } from '../QuestsInfoModal/QuestsInfoModal';
import { nanoid } from 'nanoid';

type TemplateTasksSectionProps = {
  type: RepeatRule | 'custom' | 'daily';
  templateTasks: TemplateTask[];
};

export const TemplateTasksSection = memo(({ type, templateTasks }: TemplateTasksSectionProps) => {
  const { t } = useTranslation();
  const [isQuestsInfoOpen, setIsQuestsInfoOpen] = useState(false);

  return (
    <div
      className={styles.wrapper}
      style={{ borderColor: type === 'quests' ? '#FF9800' : 'var(--border-color)' }}
    >
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h3 style={{ margin: '0.5rem 0', paddingLeft: 'calc(1rem + 4px)' }}>
            {t(`templates.${type}`)}
          </h3>
          {type === 'quests' && (
            <Button size="small" variant="secondary" onClick={() => setIsQuestsInfoOpen(true)}>
              <InfoIcon />
            </Button>
          )}
        </div>

        <Button size="small" variant="secondary" onClick={() => {}}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: 'var(--font-size-secondary)',
            }}
          >
            <PlusIcon />
            {t('task.add')}
          </span>
        </Button>
      </div>

      {templateTasks.length > 0 ? (
        templateTasks.map((task) => <TemplateTaskItem key={nanoid()} templateTask={task} />)
      ) : (
        <div style={{ fontSize: 'var(--font-size-secondary)', color: 'var(--text-secondary)' }}>
          {t('templates.noTasks')}
        </div>
      )}

      {type === 'quests' && (
        <QuestsInfoModal isOpen={isQuestsInfoOpen} onClose={() => setIsQuestsInfoOpen(false)} />
      )}
    </div>
  );
});

TemplateTasksSection.displayName = 'TemplateTasksSection';
