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
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Создаем границы для навигации
  const minDate = new Date(2025, 0, 1); // Январь 2024
  const maxDate = new Date(); // Текущая дата

  const isMinMonth = currentMonth.getTime() <= minDate.getTime();
  const isMaxMonth =
    currentMonth.getMonth() === maxDate.getMonth() &&
    currentMonth.getFullYear() === maxDate.getFullYear();

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
            <div>
              <div className={statsStyles.sectionWrapper}>
                <div className={statsStyles.streakHeader}>
                  <span>🔥</span>
                  {t('stats.streaks.title')}
                </div>
                <div className={statsStyles.streakBars}>
                  {(() => {
                    // Генерируем случайные значения для стриков
                    const bestStreak = Math.floor(Math.random() * 30) + 15; // 15-45 дней
                    const currentStreak = Math.floor(Math.random() * bestStreak); // 0-bestStreak дней

                    return (
                      <>
                        {/* Текущий стрик */}
                        <div className={statsStyles.streakBar}>
                          <div className={statsStyles.streakLabel}>
                            {t('stats.streaks.current')}
                            <div className={statsStyles.streakValue}>
                              <span>{currentStreak}</span>
                              <span>{t('stats.streaks.days')}</span>
                            </div>
                          </div>
                          <div className={statsStyles.streakProgress}>
                            <div
                              className={statsStyles.streakFill}
                              style={{ width: `${(currentStreak / bestStreak) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Максимальный стрик */}
                        <div className={statsStyles.streakBar}>
                          <div className={statsStyles.streakLabel}>
                            {t('stats.streaks.best')}
                            <div className={statsStyles.streakValue}>
                              <span>{bestStreak}</span>
                              <span>{t('stats.streaks.days')}</span>
                            </div>
                          </div>
                          <div className={statsStyles.streakProgress}>
                            <div className={statsStyles.streakFill} style={{ width: '100%' }} />
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className={statsStyles.sectionWrapper}>
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
                      <span>{t('stats.yearlyProgress')}</span>
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

              <div className={statsStyles.sectionWrapper}>
                <div className={statsStyles.activityHeader}>
                  <div className={statsStyles.activityTitle}>
                    <span>🔍</span>
                    {t('stats.activity')}
                  </div>
                  <div className={statsStyles.monthNavigation}>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        const prevMonth = new Date(currentMonth);
                        prevMonth.setMonth(prevMonth.getMonth() - 1);
                        setCurrentMonth(prevMonth);
                      }}
                      disabled={isMinMonth}
                    >
                      ◀
                    </Button>
                    <div className={statsStyles.currentMonth}>
                      {t(`monthNames.${currentMonth.getMonth()}`)} {currentMonth.getFullYear()}
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        const nextMonth = new Date(currentMonth);
                        nextMonth.setMonth(nextMonth.getMonth() + 1);
                        setCurrentMonth(nextMonth);
                      }}
                      disabled={isMaxMonth}
                    >
                      ▶
                    </Button>
                  </div>
                </div>

                <div className={statsStyles.calendarGrid}>
                  {(t('weekdaysShort', { returnObjects: true }) as string[]).map((day: string) => (
                    <div key={day} className={statsStyles.weekdayHeader}>
                      {day}
                    </div>
                  ))}

                  {(() => {
                    const firstDay = new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      1
                    );
                    const lastDay = new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                      0
                    );

                    // Получаем день недели для первого дня месяца (0 = воскресенье)
                    const firstDayOfWeek = firstDay.getDay();
                    // Общее количество дней в месяце
                    const daysInMonth = lastDay.getDate();

                    // Генерируем пустые ячейки для выравнивания календаря
                    const emptyCells = Array(firstDayOfWeek).fill(null);

                    // Генерируем данные для каждого дня
                    const days = Array.from({ length: daysInMonth }, (_, index) => {
                      const doneToday = Math.floor(Math.random() * 10);
                      const avgPerDay = 5;
                      const greenPercent = Math.min(100, (doneToday / avgPerDay) * 100);
                      return {
                        day: index + 1,
                        count: doneToday,
                        intensity: greenPercent,
                      };
                    });

                    return (
                      <>
                        {emptyCells.map((_, index) => (
                          <div
                            key={`empty-${firstDay.getTime()}-${index}`}
                            className={`${statsStyles.calendarDay} ${statsStyles.emptyDay}`}
                          />
                        ))}

                        {days.map((day) => (
                          <div
                            key={`${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${day.day}`}
                            className={statsStyles.calendarDay}
                            style={{
                              backgroundColor: `hsl(120, 50%, ${90 - day.intensity * 0.4}%)`,
                            }}
                            title={`${day.count} ${t('stats.tasksCompleted')}`}
                          >
                            <span className={statsStyles.dayNumber}>{day.day}</span>
                          </div>
                        ))}
                      </>
                    );
                  })()}
                </div>
                <div className={statsStyles.activityLegend}>
                  {t('stats.legend.less')}
                  <div
                    className={statsStyles.legendDot}
                    style={{ backgroundColor: `hsl(120, 50%, 90%)` }}
                  />
                  <div
                    className={statsStyles.legendDot}
                    style={{ backgroundColor: `hsl(120, 50%, 80%)` }}
                  />
                  <div
                    className={statsStyles.legendDot}
                    style={{ backgroundColor: `hsl(120, 50%, 70%)` }}
                  />
                  <div
                    className={statsStyles.legendDot}
                    style={{ backgroundColor: `hsl(120, 50%, 60%)` }}
                  />
                  <div
                    className={statsStyles.legendDot}
                    style={{ backgroundColor: `hsl(120, 50%, 50%)` }}
                  />
                  {t('stats.legend.more')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
