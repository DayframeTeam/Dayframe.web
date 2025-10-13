// Функция для генерации массива уникальных цветов
export function generateUniqueColors(count: number) {
  const colors: string[] = [];
  const hueStep = 360 / count; // Равномерно распределяем оттенки

  for (let i = 0; i < count; i++) {
    // Добавляем небольшую случайность к базовому оттенку
    const hue = (i * hueStep + Math.random() * 20 - 10) % 360;
    // Более сбалансированные параметры для насыщенности и яркости
    colors.push(`hsl(${hue}, 65%, 65%)`);
  }

  return colors;
}
