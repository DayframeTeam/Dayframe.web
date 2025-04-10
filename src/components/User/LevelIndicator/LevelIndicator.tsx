import styles from './LevelIndicator.module.scss';
import {
  calculateLevel,
  calculateNextLevelExp,
  getLevelColorScheme,
} from '../../../utils/levelUtils';
import { memo } from 'react';

type LevelIndicatorProps = Readonly<{
  exp: number;
  size?: 'large';
}>;

export const LevelIndicator = memo(({ exp, size = undefined }: LevelIndicatorProps) => {
  const currentLevel = calculateLevel(exp);
  const nextLevelExp = calculateNextLevelExp(currentLevel);
  const progressPercent = (exp / nextLevelExp) * 300;
  const colors = getLevelColorScheme(currentLevel);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashArray = (circumference * 300) / 360; // Длина дуги для 300 градусов
  const progress = (dashArray * progressPercent) / 300;

  return (
    <div className={`${styles.levelInfo} ${size === 'large' ? styles.levelInfoLarge : ''}`}>
      <svg className={styles.progressRing} viewBox="0 0 100 100">
        <circle
          className={styles.backgroundRing}
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
        />
        <circle
          className={styles.progressPath}
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          stroke={colors.accent}
          strokeDasharray={`${progress} ${dashArray}`}
        />
      </svg>
      <div className={styles.expCircle}>
        <div className={styles.exp}>{currentLevel}</div>
      </div>
    </div>
  );
});

LevelIndicator.displayName = 'LevelIndicator';
