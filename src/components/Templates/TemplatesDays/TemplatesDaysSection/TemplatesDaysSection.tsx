import { PlusIcon } from 'lucide-react';
import { Button } from '../../../ui/Button/Button';
import styles from './TemplatesDaysSection.module.scss';
import { useTranslation } from 'react-i18next';
import { Day } from '../../../../types/dbTypes';
import { TemplateDay } from '../TemplateDay/TemplateDay';

export const TemplatesDaysSection = () => {
  const { t } = useTranslation();

  // Mock data for days
  const mockDays: Day[] = [
    {
      id: 1,
      name: 'Work Day',
      user_id: 1,
      tasks: [
        {
          id: 101,
          title: 'Morning Standup',
          description: 'Daily team meeting',
          category: 'work',
          priority: 'high',
          exp: 10,
          start_time: '09:00:00',
          end_time: '09:30:00',
          user_id: 1,
          created_at: '2023-01-01T00:00:00Z',
          day_id: 1,
          subtasks: [
            {
              id: 1001,
              title: 'Prepare updates',
              position: 0,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              day_task_id: 101,
            },
            {
              id: 1002,
              title: 'Share blockers',
              position: 1,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              day_task_id: 101,
            },
          ],
        },
        {
          id: 102,
          title: 'Lunch Break',
          description: 'Take a break and eat',
          category: 'health',
          priority: 'medium',
          exp: 5,
          start_time: '12:00:00',
          end_time: '13:00:00',
          user_id: 1,
          created_at: '2023-01-01T00:00:00Z',
          day_id: 1,
          subtasks: [],
        },
        {
          id: 103,
          title: 'Project Planning',
          description: 'Plan next sprint',
          category: 'work',
          priority: 'high',
          exp: 20,
          start_time: '14:00:00',
          end_time: '15:30:00',
          user_id: 1,
          created_at: '2023-01-01T00:00:00Z',
          day_id: 1,
          subtasks: [
            {
              id: 1003,
              title: 'Review backlog',
              position: 0,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              day_task_id: 103,
            },
            {
              id: 1004,
              title: 'Assign tasks',
              position: 1,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              day_task_id: 103,
            },
            {
              id: 1005,
              title: 'Set deadlines',
              position: 2,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              day_task_id: 103,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Weekend Day',
      user_id: 1,
      tasks: [
        {
          id: 201,
          title: 'Morning Exercise',
          description: '30 minutes workout',
          category: 'health',
          priority: 'high',
          exp: 20,
          start_time: '08:00:00',
          end_time: '08:30:00',
          user_id: 1,
          created_at: '2023-01-01T00:00:00Z',
          day_id: 2,
          subtasks: [
            {
              id: 2001,
              title: 'Warm up',
              position: 0,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              day_task_id: 201,
            },
            {
              id: 2002,
              title: 'Main workout',
              position: 1,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              day_task_id: 201,
            },
            {
              id: 2003,
              title: 'Cool down',
              position: 2,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              day_task_id: 201,
            },
          ],
        },
        {
          id: 202,
          title: 'Grocery Shopping',
          description: 'Buy weekly groceries',
          category: 'household',
          priority: 'medium',
          exp: 5,
          start_time: '10:00:00',
          end_time: '11:00:00',
          user_id: 1,
          created_at: '2023-01-01T00:00:00Z',
          day_id: 2,
          subtasks: [
            {
              id: 2004,
              title: 'Make shopping list',
              position: 0,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              day_task_id: 202,
            },
            {
              id: 2005,
              title: 'Go to store',
              position: 1,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              day_task_id: 202,
            },
          ],
        },
        {
          id: 203,
          title: 'Evening Reading',
          description: 'Read for 1 hour',
          category: 'education',
          priority: 'low',
          exp: 10,
          start_time: '20:00:00',
          end_time: '21:00:00',
          user_id: 1,
          created_at: '2023-01-01T00:00:00Z',
          day_id: 2,
          subtasks: [],
        },
      ],
    },
    {
      id: 3,
      name: 'Study Day',
      user_id: 1,
      tasks: [
        {
          id: 301,
          title: 'Online Course',
          description: 'Complete one module',
          category: 'education',
          priority: 'high',
          exp: 20,
          start_time: '10:00:00',
          end_time: '12:00:00',
          user_id: 1,
          created_at: '2023-01-01T00:00:00Z',
          day_id: 3,
          subtasks: [
            {
              id: 3001,
              title: 'Watch lectures',
              position: 0,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              day_task_id: 301,
            },
            {
              id: 3002,
              title: 'Complete exercises',
              position: 1,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              day_task_id: 301,
            },
            {
              id: 3003,
              title: 'Take quiz',
              position: 2,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              day_task_id: 301,
            },
          ],
        },
        {
          id: 302,
          title: 'Practice Coding',
          description: 'Work on personal project',
          category: 'education',
          priority: 'medium',
          exp: 10,
          start_time: '14:00:00',
          end_time: '15:30:00',
          user_id: 1,
          created_at: '2023-01-01T00:00:00Z',
          day_id: 3,
          subtasks: [
            {
              id: 3004,
              title: 'Fix bugs',
              position: 0,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              day_task_id: 302,
            },
            {
              id: 3005,
              title: 'Add new feature',
              position: 1,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              day_task_id: 302,
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h3 style={{ margin: '0.5rem 0', paddingLeft: 'calc(1rem + 4px)' }}>
            {t(`templates.days.title`)}
          </h3>
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
            {t('templates.days.add')}
          </span>
        </Button>
      </div>

      {/* Display mock days */}
      <div className={styles.daysList}>
        {mockDays.map((day) => (
          <TemplateDay key={day.id} day={day} />
        ))}
      </div>
    </div>
  );
};

TemplatesDaysSection.displayName = 'TemplatesDaysSection';
