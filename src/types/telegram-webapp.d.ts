// Тип данных пользователя
export interface TelegramWebAppUser {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

// Тип небезопасных данных (initDataUnsafe)
export interface TelegramWebAppInitDataUnsafe {
  user?: TelegramWebAppUser;
  chat?: { id: number; type?: string; title?: string };
  auth_date?: number;
  hash?: string;
  query_id?: string;
  receiver?: TelegramWebAppUser;
  start_param?: string;
}

// Основной WebApp интерфейс
export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: TelegramWebAppInitDataUnsafe;
  version?: string;
  platform?: string;
  colorScheme?: 'light' | 'dark';
  isExpanded?: boolean;
  isClosingConfirmationEnabled?: boolean;
  themeParams?: {
    colorScheme?: 'light' | 'dark';
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData: (data: string) => void;
  onEvent: (eventType: string, callback: () => void) => void;
  offEvent: (eventType: string, callback: () => void) => void;
}

// Глобальное пространство Telegram в window
export interface TelegramNamespace {
  WebApp: TelegramWebApp;
}

// Расширяем глобальный объект Window
declare global {
  interface Window {
    Telegram?: TelegramNamespace;
  }
}
