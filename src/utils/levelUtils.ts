/**
 * Вычисляет уровень пользователя на основе его опыта
 * @param exp - Текущий опыт пользователя
 * @returns Уровень пользователя (от 0 до 99)
 */
export const calculateLevel = (exp: number): number => {
  // Более сложная прогрессия для высоких уровней
  // Используем логарифмическую функцию для замедления роста
  const level = Math.floor(Math.log(1 + exp / 50) * 15);
  return Math.min(Math.max(level, 0), 99); // Ограничиваем уровень от 0 до 99
};

/**
 * Вычисляет количество опыта, необходимое для следующего уровня
 * @param currentLevel - Текущий уровень пользователя
 * @returns Количество опыта, необходимое для следующего уровня
 */
export const calculateNextLevelExp = (currentLevel: number): number => {
  // Экспоненциальный рост требуемого опыта
  return Math.ceil((Math.exp((currentLevel + 1) / 15) - 1) * 50);
};

/**
 * Определяет цветовую схему на основе уровня пользователя
 * @param level - Текущий уровень пользователя
 * @returns Объект с цветами для разных элементов интерфейса
 */
export const getLevelColorScheme = (level: number): { accent: string } => {
  if (level < 20) {
    return { accent: '#318CE7' }; // Начальный (синий)
  } else if (level < 40) {
    return { accent: '#4ade80' }; // Продвинутый (зеленый)
  } else if (level < 60) {
    return { accent: '#facc15' }; // Эксперт (желтый)
  } else if (level < 80) {
    return { accent: '#d946ef' }; // Мастер (фиолетовый)
  } else {
    return { accent: '#f43f5e' }; // Легенда (красный)
  }
};
