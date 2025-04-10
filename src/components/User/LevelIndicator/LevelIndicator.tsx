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

  return (
    <div className={`${styles.levelInfo} ${size === 'large' ? styles.levelInfoLarge : ''}`}>
      <div
        className={styles.progressRing}
        style={
          {
            '--progress': `${progressPercent}deg`,
            '--ring-color': colors.accent,
          } as React.CSSProperties
        }
      />
      <div className={styles.expCircle}>
        <div className={styles.exp}>{currentLevel}</div>
      </div>
    </div>
  );
});

LevelIndicator.displayName = 'LevelIndicator';
