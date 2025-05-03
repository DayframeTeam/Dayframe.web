interface TelegramWebAppUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebAppInitDataUnsafe {
  user?: TelegramWebAppUser;
  chat?: { id: number };
  // ... другие поля по необходимости
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: TelegramWebAppInitDataUnsafe;
  // ... другие методы и свойства
}

interface TelegramNamespace {
  WebApp: TelegramWebApp;
}

interface Window {
  Telegram?: TelegramNamespace;
}
