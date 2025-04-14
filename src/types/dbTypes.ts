export type User = {
  id: number; // Уникальный идентификатор пользователя (PK)
  username: string; // Отображаемое имя или логин
  email: string | undefined; // Email (опционально)
  password: string; // Захешированный пароль
  telegram_id: number | undefined; // Telegram ID, если есть связка (опционально)
  is_premium: boolean; // Подписка: true — платный пользователь
  user_categories: string | undefined; // Пользовательские категории (например, JSON или строка) (опционально)
  exp: number; // Очки опыта пользователя
  timezone: string; // Таймзона в формате IANA (например, 'Europe/Moscow') при регистрации получаем
  created_at: string; // Время регистрации (ISO timestamp в UTC)
};

type BaseTaskFields = {
  id: number; // Уникальный идентификатор задачи (PK)
  title: string; // Название задачи
  description: string | undefined; // Описание задачи (опционально)
  category: string | undefined; // Категория задачи (выбирается пользователем) (опционально)
  priority: 'low' | 'medium' | 'high' | undefined; // Приоритет задачи (опционально)
  exp: 0 | 1 | 5 | 10 | 20 | 50; // Кол-во XP за выполнение
  start_time: string | undefined; // Время начала (локальное), формат 'HH:mm:ss' (опционально)
  end_time: string | undefined; // Время окончания, формат 'HH:mm:ss' (опционально)
  user_id: number; // Внешний ключ к пользователю
  created_at: string; // Время создания задачи (ISO timestamp в UTC)
};

export type Task = BaseTaskFields & {
  is_done: boolean; // Статус: false — запланировано, true — выполнено
  special_id: string | undefined; // Уникальный frontend ID (например, для виртуального отображения в календаре)
  task_date: string | undefined; // Дата задачи (в UTC, ISO строка) (опционально)

  subtasks: Subtask[]; //TODO: чисто для фронта
};

export type TemplateTask = BaseTaskFields & {
  is_active: boolean; // Активен ли шаблон (можно временно выключить) базово включен
  special_id: string; // Уникальный frontend ID (например, для виртуального отображения в календаре)
  repeat_rule: RepeatRule; // Правило повторения: daily | weekly | quests | [дни недели]
  start_active_date: string | undefined; // Начало действия шаблона (UTC) (опционально)
  end_active_date: string | undefined; // Конец действия шаблона (UTC) (опционально)

  subtasks: TemplateSubtask[]; //TODO: чисто для фронта
};

export type RepeatRule =
  | 'daily' // Каждый день
  | 'weekly' // Каждую неделю
  | 'quests' // Квесты
  | number[]; // Конкретные дни недели (например, [1, 3, 5] = Пн, Ср, Пт)

type BaseSubtaskFields = {
  id: number; // Уникальный ID подзадачи
  title: string; // Название подзадачи
  position: number; // Позиция в списке (для drag-and-drop)
  user_id: number; // Внешний ключ к пользователю
  created_at: string; // Когда была создана (ISO UTC)
};

export type Subtask = BaseSubtaskFields & {
  special_id: string | undefined; // Уникальный frontend ID (например, для виртуального отображения в календаре)
  is_done: boolean; // Выполнена или нет
  parent_task_id: number; // ID родительской задачи (Task.id)
};

export type TemplateSubtask = BaseSubtaskFields & {
  special_id: string; // Уникальный frontend ID (например, для виртуального отображения в календаре)
  template_task_id: number; // К какому шаблону относится
};

export type Day = {
  id: number;
  name: string;
  user_id: number;
  repeat_days: number[] | undefined;

  tasks: DayTask[]; //TODO: чисто для фронта
};

export type DayTask = BaseTaskFields & {
  day_id: number;

  subtasks: DayTaskSubtask[]; //TODO: чисто для фронта
};

export type DayTaskSubtask = BaseSubtaskFields & {
  day_task_id: number;
};
