export type User = {
  id: number;
  username: string;
  email: string | null;
  password: string;
  telegram_id?: number;
  is_premium: boolean;
  exp: number;
  created_at: string; // ISO string
};

export type Task = {
  id: number;
  title: string;
  status: 'done' | 'planned';
  duration?: string;
  category?: 'required' | 'optional';
  priority?: 'low' | 'medium' | 'high';
  start_time?: string; // hh:mm:ss
  exp?: number;
  description?: string;
  task_date?: string | null; // YYYY-MM-DD or null
  source?: 'manual' | 'plan' | 'calendar';
  repeat_rule?: 'daily' | 'weekly' | 'quest';
  source_id?: number | null;
  user_id: number;
  created_at: string;
};

export type Plan = {
  id: number;
  title: string;
  duration?: string;
  category?: 'required' | 'optional';
  priority?: 'low' | 'medium' | 'high';
  start_time?: string; // hh:mm:ss
  exp?: number;
  description?: string;
  is_active: boolean;
  repeat_rule: 'daily' | 'weekly' | 'quest';
  user_id: number;
  created_at: string;
};

export type CalendarEvent = {
  id: number;
  title: string;
  start_time: string; // hh:mm:ss
  event_date: string; // YYYY-MM-DD
  duration?: string;
  category?: 'required' | 'optional';
  priority?: 'low' | 'medium' | 'high';
  repeat_rule?: 'daily' | 'weekly' | 'quest';
  exp?: number;
  description?: string;
  user_id: number;
  created_at: string;
};
