import { useTranslation } from 'react-i18next';
import { Modal } from '../../Modal/Modal';
import styles from './UserModal.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  calculateLevel,
  calculateNextLevelExp,
  getLevelColorScheme,
} from '../../../utils/levelUtils';
import { LevelIndicator } from '../LevelIndicator/LevelIndicator';

const LEVEL_EXAMPLES = [
  { level: 0, exp: 0 },
  { level: 20, exp: Math.floor(50 * (Math.exp(20 / 15) - 1)) },
  { level: 40, exp: Math.floor(50 * (Math.exp(40 / 15) - 1)) },
  { level: 60, exp: Math.floor(50 * (Math.exp(60 / 15) - 1)) },
  { level: 80, exp: Math.floor(50 * (Math.exp(80 / 15) - 1)) },
  { level: 100, exp: Math.floor(50 * (Math.exp(100 / 15) - 1)) },
];

type Props = Readonly<{
  isOpen: boolean;
  onClose: () => void;
}>;

export const UserModal = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user.user);
  if (!user) return null;

  const currentLevel = calculateLevel(user.exp);
  const nextLevelExp = calculateNextLevelExp(currentLevel);
  const colors = getLevelColorScheme(currentLevel);
  const progressPercent = (user.exp / nextLevelExp) * 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('user.expDetails')}>
      <div className={styles.content}>
        <div className={styles.levelInfo}>
          <div className={styles.levelRing}>
            <LevelIndicator exp={user.exp} size="large" />
          </div>
          <div className={styles.expProgress}>
            <div className={styles.progressContainer}>
              <div className={styles.expLabels}>
                <div className={styles.nextLevel}>{nextLevelExp}⚡</div>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: colors.accent,
                  }}
                >
                  <div className={styles.currentExp}>{user.exp}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.examples}>
          <div className={styles.examplesTitle}>{t('user.levelExamples')}</div>
          <div className={styles.examplesList}>
            {LEVEL_EXAMPLES.map((example) => (
              <div key={example.level} className={styles.exampleItem}>
                <LevelIndicator exp={example.exp} />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.completedTasks}>
          <div className={styles.completedTasksLabel}>{t('user.completedTasksTotal')}</div>
          <div className={styles.completedTasksValue}>333</div>
          <div className={styles.completedByPriority}>
            <div className={styles.priorityStats}>
              <div className={styles.priorityItem}>
                <div className={styles.priorityValue} style={{ color: 'var(--select-color-3)' }}>
                  125
                </div>
                <div>{t('user.completedByPriority.high')}</div>
              </div>
              <div className={styles.priorityItem}>
                <div className={styles.priorityValue} style={{ color: 'var(--select-color-2)' }}>
                  98
                </div>
                <div>{t('user.completedByPriority.medium')}</div>
              </div>
              <div className={styles.priorityItem}>
                <div className={styles.priorityValue} style={{ color: 'var(--select-color-1)' }}>
                  110
                </div>
                <div>{t('user.completedByPriority.low')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
