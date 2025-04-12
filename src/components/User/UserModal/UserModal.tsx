import { useTranslation } from 'react-i18next';
import { Modal } from '../../Modal/Modal';
import styles from './UserModal.module.scss';
import statsStyles from './Statistics.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  calculateLevel,
  calculateNextLevelExp,
  getLevelColorScheme,
} from '../../../utils/levelUtils';
import { LevelIndicator } from '../LevelIndicator/LevelIndicator';
import { useState } from 'react';
import { Button } from '../../ui/Button/Button';
import { getPriorityColorIndex } from '../../../utils/getPriorityColorIndex';
import { Badge } from '../../ui/Badge/Badge';

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
  const [showStatistics, setShowStatistics] = useState(false);

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

        <div className={statsStyles.statisticsSection}>
          <div className={statsStyles.statisticsButtonContainer}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowStatistics(!showStatistics)}
              className={statsStyles.statisticsButton}
            >
              <span>{t(showStatistics ? 'stats.hideStatistics' : 'stats.viewStatistics')}</span>
              <span
                className={`${statsStyles.arrow} ${showStatistics ? statsStyles.arrowUp : statsStyles.arrowDown}`}
              >
                ▼
              </span>
            </Button>
          </div>

          {showStatistics && (
            <div className={statsStyles.statisticsContent}>
              <div className={statsStyles.completedTasksSection}>
                <div className={statsStyles.completedTasksHeader}>
                  <div className={statsStyles.completedTasksTitle}>
                    <span className={statsStyles.completedTasksIcon}>✓</span>
                    {t('stats.completedTasks')}
                  </div>
                </div>

                <div className={statsStyles.completedTasksOverview}>
                  <div className={statsStyles.completedTasksNumbers}>
                    <div className={statsStyles.completedTasksNumber}>
                      <div className={statsStyles.completedTasksValue}>1,234</div>
                      <div className={statsStyles.completedTasksLabel}>{t('stats.allTime')}</div>
                    </div>
                    <div className={statsStyles.completedTasksNumber}>
                      <div className={statsStyles.completedTasksValue}>156</div>
                      <div className={statsStyles.completedTasksLabel}>{t('stats.thisMonth')}</div>
                    </div>
                    <div className={statsStyles.completedTasksNumber}>
                      <div className={statsStyles.completedTasksValue}>12</div>
                      <div className={statsStyles.completedTasksLabel}>{t('stats.today')}</div>
                    </div>
                  </div>

                  <div className={statsStyles.completedTasksChart}>
                    <div className={statsStyles.completedTasksChartTitle}>
                      <span>{t('stats.monthlyProgress')}</span>
                      <span className={statsStyles.year}>2024</span>
                    </div>
                    <div className={statsStyles.chartBars}>
                      {(() => {
                        // Генерируем тестовые данные
                        const monthlyData = Array.from(
                          { length: 12 },
                          () => Math.floor(Math.random() * 150) + 10
                        );

                        const maxValue = Math.max(...monthlyData);
                        const MAX_HEIGHT = 180;

                        return monthlyData.map((value, index) => {
                          const heightPercentage = (value / maxValue) * 100;
                          const heightPx = Math.max((heightPercentage * MAX_HEIGHT) / 100, 20);

                          // Используем правильный индекс для месяца
                          const monthDate = new Date(2024, index);
                          const monthLabel = t(`monthNamesShort.${monthDate.getMonth()}`);

                          return (
                            <div key={index + 1} className={statsStyles.chartBarWrapper}>
                              <div
                                className={statsStyles.chartBar}
                                style={{ height: `${heightPx}px` }}
                                title={`${monthLabel}: ${value} ${t('stats.completedTasks')}`}
                              />
                              <div className={statsStyles.chartBarLabel}>{monthLabel}</div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  <div className={statsStyles.breakdownSection}>
                    <div className={statsStyles.breakdownTitle}>{t('stats.byCategory') + ' #'}</div>
                    <div className={statsStyles.breakdownItems}>
                      <div className={statsStyles.breakdownItem}>
                        <div className={statsStyles.breakdownLabel}>Work</div>
                        <div className={statsStyles.breakdownValue}>532</div>
                      </div>
                      <div className={statsStyles.breakdownItem}>
                        <div className={statsStyles.breakdownLabel}>Personal</div>
                        <div className={statsStyles.breakdownValue}>328</div>
                      </div>
                      <div className={statsStyles.breakdownItem}>
                        <div className={statsStyles.breakdownLabel}>Study</div>
                        <div className={statsStyles.breakdownValue}>374</div>
                      </div>
                    </div>
                  </div>

                  <div className={statsStyles.breakdownSection}>
                    <div className={statsStyles.breakdownTitle}>{t('stats.byPriority')}</div>
                    <div className={statsStyles.breakdownItems}>
                      <div className={statsStyles.breakdownItem}>
                        <div className={statsStyles.breakdownLabel}>
                          <Badge
                            label={'🎯 ' + t(`task.priorityType.high`)}
                            num={getPriorityColorIndex('high')}
                            title={t('task.priority')}
                          />
                        </div>
                        <div className={statsStyles.breakdownValue}>245</div>
                      </div>
                      <div className={statsStyles.breakdownItem}>
                        <div className={statsStyles.breakdownLabel}>
                          <Badge
                            label={'🎯 ' + t(`task.priorityType.medium`)}
                            num={getPriorityColorIndex('medium')}
                            title={t('task.priority')}
                          />
                        </div>
                        <div className={statsStyles.breakdownValue}>567</div>
                      </div>
                      <div className={statsStyles.breakdownItem}>
                        <div className={statsStyles.breakdownLabel}>
                          <Badge
                            label={'🎯 ' + t(`task.priorityType.low`)}
                            num={getPriorityColorIndex('low')}
                            title={t('task.priority')}
                          />
                        </div>
                        <div className={statsStyles.breakdownValue}>422</div>
                      </div>
                      <div className={statsStyles.breakdownItem}>
                        <div className={statsStyles.breakdownLabel}>
                          <Badge
                            label={'🎯 ' + t(`task.priorityType.none`)}
                            title={t('task.priority')}
                          />
                        </div>
                        <div className={statsStyles.breakdownValue}>722</div>
                      </div>
                    </div>
                  </div>

                  <div className={statsStyles.timeSpentChart}>
                    <div className={statsStyles.timeSpentTitle}>
                      {t('stats.timeSpent')}
                      <span className={statsStyles.year}> 2024</span>
                    </div>
                    <div className={statsStyles.timeSpentLine}>
                      {(() => {
                        // Генерируем случайное количество часов (от 100 до 500)
                        const totalHours = Math.floor(Math.random() * 400) + 100;
                        // Генерируем случайное количество минут (0-59)
                        const minutes = Math.floor(Math.random() * 60);
                        // Вычисляем процент заполнения (максимум 500 часов)
                        const fillPercent = (totalHours / 500) * 100;

                        return (
                          <>
                            <div
                              className={statsStyles.trendLine}
                              style={{ width: `${fillPercent}%` }}
                            />
                            <div
                              className={statsStyles.timeLabel}
                              style={{ right: `${100 - fillPercent}%` }}
                            >
                              {`${totalHours} ${t('time.hour')} ${minutes} ${t('time.minute')}`}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
