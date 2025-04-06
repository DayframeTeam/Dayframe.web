import styles from './UserProfile.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useTranslation } from 'react-i18next';

// Функция для вычисления уровня на основе опыта
const calculateLevel = (exp: number): number => {
  // Более сложная прогрессия для высоких уровней
  // Используем логарифмическую функцию для замедления роста
  const level = Math.floor(Math.log(1 + exp / 50) * 15);
  return Math.min(Math.max(level, 0), 99); // Ограничиваем уровень от 0 до 99
};

// Функция для вычисления опыта, необходимого для следующего уровня
const calculateNextLevelExp = (currentLevel: number): number => {
  // Экспоненциальный рост требуемого опыта
  return Math.ceil((Math.exp((currentLevel + 1) / 15) - 1) * 50);
};

// Функция для определения цветовой схемы на основе уровня
const getLevelColorScheme = (level: number): { accent: string } => {
  if (level < 20) {
    return { accent: '#646cff' }; // Начальный (синий)
  } else if (level < 40) {
    return { accent: '#4ade80' }; // Продвинутый (зеленый)
  } else if (level < 60) {
    return { accent: '#facc15' }; // Эксперт (желтый)
  } else if (level < 80) {
    return { accent: '#f43f5e' }; // Мастер (красный)
  } else {
    return { accent: '#d946ef' }; // Легенда (фиолетовый)
  }
};

export default function UserProfile() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user.user);

  if (!user) return null;

  const currentLevel = calculateLevel(user.exp);
  const nextLevelExp = calculateNextLevelExp(currentLevel);
  const progressPercent = (user.exp / nextLevelExp) * 100;
  const colors = getLevelColorScheme(currentLevel);

  return (
    <div
      className={styles.userProfile}
      title={`${t('user.level')} ${currentLevel}, ${t('user.exp')}: ${user.exp}/${nextLevelExp} ⚡`}
    >
      <div className={styles.levelInfo}>
        <div
          className={styles.progressRing}
          style={
            {
              '--progress': `${progressPercent}%`,
              '--ring-color': colors.accent,
            } as React.CSSProperties
          }
        />
        <div className={styles.expCircle}>
          <div className={styles.exp}>
            {currentLevel}
            {/* <span className={styles.lightning}>⚡</span> */}
          </div>
        </div>
      </div>
    </div>
  );
}
