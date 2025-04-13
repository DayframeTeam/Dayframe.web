import { TemplatesSection } from '../../components/Templates/TemplatesSection/TemplatesSection';
import { TemplateTask } from '../../types/dbTypes';

const mockTemplates: TemplateTask[] = [
  // Daily tasks
  {
    id: 1,
    title: 'Morning Exercise',
    description: '30 minutes of workout',
    category: 'health',
    priority: 'high',
    exp: 20,
    duration: '00:30',
    start_time: '07:00:00',
    end_time: '07:30:00',
    user_id: 1,
    created_at: '2024-03-20T10:00:00Z',
    is_done: false,
    special_id: 'daily-1',
    repeat_rule: 'daily',
    subtasks: [
      {
        id: 1,
        title: 'Warm up',
        position: 0,
        special_id: 'subtask-1',
        user_id: 1,
        created_at: '2024-03-20T10:00:00Z',
        template_task_id: 1,
      },
      {
        id: 2,
        title: 'Main workout',
        position: 1,
        special_id: 'subtask-2',
        user_id: 1,
        created_at: '2024-03-20T10:00:00Z',
        template_task_id: 1,
      },
    ],
  },
  {
    id: 2,
    title: 'Evening Reading',
    description: 'Read for 1 hour',
    category: 'education',
    priority: 'medium',
    exp: 10,
    duration: '01:00',
    start_time: '20:00:00',
    end_time: '21:00:00',
    user_id: 1,
    created_at: '2024-03-20T10:00:00Z',
    is_done: false,
    special_id: 'daily-2',
    repeat_rule: 'daily',
    subtasks: [],
  },

  // Weekly tasks
  {
    id: 3,
    title: 'Weekly Planning',
    description: "Plan next week's tasks",
    category: 'work',
    priority: 'high',
    exp: 50,
    duration: '01:30',
    start_time: '18:00:00',
    end_time: '19:30:00',
    user_id: 1,
    created_at: '2024-03-20T10:00:00Z',
    is_done: false,
    special_id: 'weekly-1',
    repeat_rule: 'weekly',
    subtasks: [
      {
        id: 3,
        title: 'Review last week',
        position: 0,
        special_id: 'subtask-3',
        user_id: 1,
        created_at: '2024-03-20T10:00:00Z',
        template_task_id: 3,
      },
      {
        id: 4,
        title: 'Set new goals',
        position: 1,
        special_id: 'subtask-4',
        user_id: 1,
        created_at: '2024-03-20T10:00:00Z',
        template_task_id: 3,
      },
    ],
  },

  // Quest tasks
  {
    id: 4,
    title: 'Learn New Language',
    description: 'Complete language course',
    category: 'education',
    priority: 'medium',
    exp: 50,
    duration: '02:00',
    start_time: '15:00:00',
    end_time: '17:00:00',
    user_id: 1,
    created_at: '2024-03-20T10:00:00Z',
    is_done: false,
    special_id: 'quest-1',
    repeat_rule: 'quests',
    subtasks: [
      {
        id: 5,
        title: 'Complete 5 lessons',
        position: 0,
        special_id: 'subtask-5',
        user_id: 1,
        created_at: '2024-03-20T10:00:00Z',
        template_task_id: 4,
      },
    ],
  },

  // Custom tasks (specific days)
  {
    id: 5,
    title: 'Team Meeting',
    description: 'Weekly team sync',
    category: 'work',
    priority: 'high',
    exp: 10,
    duration: '01:00',
    start_time: '11:00:00',
    end_time: '12:00:00',
    user_id: 1,
    created_at: '2024-03-20T10:00:00Z',
    is_done: false,
    special_id: 'custom-1',
    repeat_rule: [1, 3], // Monday and Wednesday
    subtasks: [],
  },
  {
    id: 6,
    title: 'Grocery Shopping',
    description: 'Buy weekly groceries',
    category: 'household',
    priority: 'medium',
    exp: 5,
    duration: '01:00',
    start_time: '18:00:00',
    end_time: '19:00:00',
    user_id: 1,
    created_at: '2024-03-20T10:00:00Z',
    is_done: false,
    special_id: 'custom-2',
    repeat_rule: [5], // Friday
    subtasks: [],
  },
];

export const TemplatesPage = () => {
  return <TemplatesSection templates={mockTemplates} />;
};

TemplatesPage.displayName = 'TemplatesPage';
