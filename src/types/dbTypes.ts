export type User = {
  id: number; // Уникальный идентификатор пользователя (PK)
  username: string; // Отображаемое имя или логин
  email?: string; // Email (опционально)
  password: string; // Захешированный пароль
  telegram_id?: number; // Telegram ID, если есть связка (опционально)
  is_premium: boolean; // Подписка: true — платный пользователь
  user_categories?: string; // Пользовательские категории (например, JSON или строка) (опционально)
  exp: number; // Очки опыта пользователя
  timezone: string; // Таймзона в формате IANA (например, 'Europe/Moscow') при регистрации получаем
  created_at: string; // Время регистрации (ISO timestamp в UTC)
};

export type Task = {
  id: number; // Уникальный идентификатор задачи (PK)
  title: string; // Название задачи
  description?: string; // Описание задачи (опционально)
  category?: string; // Категория задачи (выбирается пользователем) (опционально)
  priority?: 'low' | 'medium' | 'high'; // Приоритет задачи (опционально)
  exp: 0 | 1 | 5 | 10 | 20 | 50; // Кол-во XP за выполнение
  duration?: string; // Продолжительность, формат 'HH:mm' (опционально)
  start_time?: string; // Время начала (локальное), формат 'HH:mm:ss' (опционально)
  end_time?: string; // Время окончания, формат 'HH:mm:ss' (опционально)
  user_id: number; // Внешний ключ к пользователю
  created_at: string; // Время создания задачи (ISO timestamp в UTC)

  is_done: boolean; // Статус: false — запланировано, true — выполнено
  special_id: string; // Уникальный frontend ID (например, для виртуального отображения в календаре)

  task_date?: string; // Дата задачи (в UTC, ISO строка) (опционально)

  subtasks: Subtask[]; //TODO: чисто для фронта
};

export type TemplateTask = {
  id: number; // Уникальный ID шаблона
  title: string; // Название шаблона
  description?: string; // Описание шаблона (опционально)
  category?: string; // Категория (например, 'здоровье', 'работа') (опционально) если появл новое слово от пользователя оно добавляется в user_categories
  priority?: 'low' | 'medium' | 'high'; // Приоритет по умолчанию (опционально)
  exp: 0 | 1 | 5 | 10 | 20 | 50; // Награда XP за выполнение задачи из шаблона
  duration?: string; // Продолжительность (опционально)
  start_time?: string; // Время старта задачи по шаблону (опционально)
  end_time?: string; // Время окончания (опционально)
  user_id: number; // К какому пользователю относится шаблон
  created_at: string; // Время создания (ISO UTC)

  is_done: boolean; // Активен ли шаблон (можно временно выключить) базово включен
  special_id: string; // Уникальный frontend ID (например, для виртуального отображения в календаре)

  repeat_rule: RepeatRule; // Правило повторения: daily | weekly | quests | [дни недели]
  start_date?: string; // Начало действия шаблона (UTC) (опционально)
  end_date?: string; // Конец действия шаблона (UTC) (опционально)

  subtasks: TemplateSubtask[]; //TODO: чисто для фронта
};

export type RepeatRule =
  | 'daily' // Каждый день
  | 'weekly' // Каждую неделю
  | 'quests' // Квесты
  | number[]; // Конкретные дни недели (например, [1, 3, 5] = Пн, Ср, Пт)

export type Subtask = {
  id: number; // Уникальный ID подзадачи
  title: string; // Название подзадачи
  position: number; // Позиция в списке (для drag-and-drop)
  special_id: string; // Уникальный frontend ID (например, для виртуального отображения в календаре)
  user_id: number; // Внешний ключ к пользователю
  created_at: string; // Когда была создана (ISO UTC)

  is_done: boolean; // Выполнена или нет
  parent_task_id: number; // ID родительской задачи (Task.id)
};

export type TemplateSubtask = {
  id: number; // Уникальный ID шаблонной подзадачи
  title: string; // Название подзадачи
  position: number; // Позиция в списке
  special_id: string; // Уникальный frontend ID (например, для виртуального отображения в календаре)
  user_id: number; // Внешний ключ к пользователю
  created_at: string; // Когда была создана (ISO UTC)

  template_task_id: number; // К какому шаблону относится
};
