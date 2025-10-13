import { useTranslation } from 'react-i18next';
import styles from './UserModal.module.scss';
import statsStyles from './Statistics.module.scss';
import { useSelector } from 'react-redux';
import { LevelIndicator } from '../LevelIndicator/LevelIndicator';
import { useState, useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { nanoid } from 'nanoid';
import { RootState } from '../../../../store';
import {
  calculateLevel,
  calculateNextLevelExp,
  getLevelColorScheme,
} from '../../../../utils/levelUtils';
import { Modal } from '../../../../shared/Modal/Modal';
import { Button } from '../../../../shared/UI/Button/Button';
import { Badge } from '../../../../shared/UI/Badge/Badge';
import {
  selectAllTasks,
  selectCompletedTasksFromPreviousWeek,
} from '../../../../entities/task/store/tasksSlice';
import { getPriorityColorIndex } from '../../../../utils/getPriorityColorIndex';
import { StreakUtils } from '../../../../utils/stats/streakUtils';
import { CompletedTasksUtils } from '../../../../utils/stats/completedTasksUtils';
import { ActivityUtils } from '../../../../utils/stats/activityUtils';
import { generateUniqueColors } from '../../../../utils/uniqueColors';

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
  const tasks = useSelector(selectAllTasks);
  const completedTasksFromPreviousWeek = useSelector(selectCompletedTasksFromPreviousWeek);
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

  const progressRef = useRef<HTMLDivElement>(null);
  const currentStreakFillRef = useRef<HTMLDivElement>(null);
  const currentStreakValueRef = useRef<HTMLDivElement>(null);

  const currentLevel = user ? calculateLevel(user.exp) : 0;
  const nextLevelExp = calculateNextLevelExp(currentLevel);
  const progressPercent = user ? (user.exp / nextLevelExp) * 100 : 0;
  const colors = getLevelColorScheme(currentLevel);

  useEffect(() => {
    if (isOpen && progressRef.current && user) {
      animate(progressRef.current!, {
        width: {
          from: '0%',
          to: `${progressPercent}%`,
          duration: 1000,
          ease: 'outQuad',
        },
      });
    }
  }, [isOpen, progressPercent, user?.exp]);

  useEffect(() => {
    if (showStatistics) {
      // Анимация для текущего стрика
      if (currentStreakFillRef.current) {
        const currentStreakFill = currentStreakFillRef.current;
        const targetWidth = currentStreakFill.style.width;
        currentStreakFill.style.width = '0%';

        animate(currentStreakFill, {
          width: {
            from: '0%',
            to: targetWidth,
            duration: 800,
            ease: 'outQuad',
          },
        });
      }

      // Анимация для значения текущего стрика
      if (currentStreakValueRef.current) {
        const currentStreakValue = currentStreakValueRef.current;
        const targetValue = currentStreakValue.textContent;
        const targetNumber = parseInt(targetValue || '0');
        currentStreakValue.textContent = '0';

        // Используем CSS-анимацию для числового значения
        currentStreakValue.style.transition = 'none';
        currentStreakValue.style.opacity = '0';

        setTimeout(() => {
          currentStreakValue.style.transition = 'opacity 0.3s ease';
          currentStreakValue.style.opacity = '1';

          let currentNumber = 0;
          const step = targetNumber / 20; // 20 шагов анимации
          const interval = 800 / 20; // 800ms / 20 шагов

          const numberInterval = setInterval(() => {
            currentNumber += step;
            if (currentNumber >= targetNumber) {
              currentNumber = targetNumber;
              clearInterval(numberInterval);
            }
            currentStreakValue.textContent = Math.floor(currentNumber).toString();
          }, interval);
        }, 50);
      }
    }
  }, [showStatistics]);

  if (!user) return null;

  return (
    isOpen && (
      <Modal onClose={onClose} title={t('user.expDetails')}>
        <div className={styles.content}>
          <div className={styles.levelInfo}>
            <div className={styles.levelRing}>
              <LevelIndicator exp={user.exp} size='large' />
            </div>
            <div className={styles.expProgress}>
              <div className={styles.progressContainer}>
                <div className={styles.expLabels}>
                  <div className={styles.nextLevel}>{nextLevelExp}⚡</div>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progress}
                    ref={progressRef}
                    style={{
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
                <div key={nanoid()} className={styles.exampleItem}>
                  <LevelIndicator exp={example.exp} />
                </div>
              ))}
            </div>
          </div>

          <div className={statsStyles.statisticsSection}>
            <div className={statsStyles.statisticsButtonContainer}>
              <Button
                type='button'
                variant='secondary'
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
                      // Получаем реальные данные стриков
                      const streakStats = StreakUtils.getStreakStats(tasks);
                      const {
                        currentStreak,
                        bestStreak,
                        lastCompletedDate,
                        bestStreakStart,
                        bestStreakEnd,
                      } = streakStats;

                      return (
                        <>
                          {/* Текущий стрик */}
                          <div className={statsStyles.streakBar}>
                            <div className={statsStyles.streakLabel}>
                              {t('stats.streaks.current')}
                              <div className={statsStyles.streakValue}>
                                <span ref={currentStreakValueRef}>{currentStreak}</span>
                                <span>{t('stats.streaks.days')}</span>
                              </div>
                            </div>
                            <div className={statsStyles.streakProgress}>
                              <div
                                className={statsStyles.streakFill}
                                ref={currentStreakFillRef}
                                style={{
                                  width: `${bestStreak > 0 ? (currentStreak / bestStreak) * 100 : 0}%`,
                                }}
                              />
                            </div>
                            {lastCompletedDate && (
                              <div className={statsStyles.streakDate}>
                                {t('stats.streaks.lastCompleted')}:{' '}
                                {StreakUtils.formatDateForDisplay(lastCompletedDate, t)}
                              </div>
                            )}
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
                            {bestStreakStart && bestStreakEnd && (
                              <div className={statsStyles.streakDate}>
                                {t('stats.streaks.period')}:{' '}
                                {StreakUtils.formatDateForDisplay(bestStreakStart, t)} -{' '}
                                {StreakUtils.formatDateForDisplay(bestStreakEnd, t)}
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
                {/* 
                <div className={statsStyles.sectionWrapper}>
                  <div className={statsStyles.productivityTitle}>
                    <span>🧠</span>
                    {t('stats.productivity.title')}
                  </div>
                  {(() => {
                    // Получаем реальные данные продуктивности
                    const productivityStats = ProductivityUtils.getProductivityStats(tasks);
                    const { peakTime } = productivityStats;

                    return (
                      <>
                        <div className={statsStyles.peakTimeWrapper}>
                          <div className={statsStyles.peakTimeLabel}>
                            {t('stats.productivity.peakTime')}
                          </div>
                          <div className={statsStyles.peakTimeRange}>
                            {t('stats.productivity.timeRange', {
                              start: peakTime.peakStartTime,
                              end: peakTime.peakEndTime,
                            })}
                          </div>
                        </div>

                        <div className={statsStyles.clockContainer}>
                          <div className={statsStyles.clockFace}>
                            <div className={statsStyles.clockMarkers}>
                              {[...Array(24)].map((_, i) => (
                                <div
                                  key={nanoid()}
                                  className={statsStyles.clockMarker}
                                  style={{
                                    transform: `rotate(${i * 15}deg)`,
                                  }}
                                />
                              ))}
                            </div>
                            <div
                              className={`${statsStyles.clockNumber} ${statsStyles.clockNumber0}`}
                            >
                              0
                            </div>
                            <div
                              className={`${statsStyles.clockNumber} ${statsStyles.clockNumber6}`}
                            >
                              6
                            </div>
                            <div
                              className={`${statsStyles.clockNumber} ${statsStyles.clockNumber12}`}
                            >
                              12
                            </div>
                            <div
                              className={`${statsStyles.clockNumber} ${statsStyles.clockNumber18}`}
                            >
                              18
                            </div>
                            <div
                              className={statsStyles.clockSector}
                              style={{
                                clipPath: `path('M 100,100 L ${100 + 95 * Math.cos(((peakTime.peakMinuteIndex / 60) * 15 * Math.PI) / 180 - Math.PI / 2)},${
                                  100 +
                                  95 *
                                    Math.sin(
                                      ((peakTime.peakMinuteIndex / 60) * 15 * Math.PI) / 180 -
                                        Math.PI / 2
                                    )
                                } A 95,95 0 ${
                                  ((peakTime.peakMinuteIndex + 1) % 1440) -
                                    peakTime.peakMinuteIndex >
                                  720
                                    ? 1
                                    : 0
                                },1 ${100 + 95 * Math.cos(((((peakTime.peakMinuteIndex + 1) % 1440) / 60) * 15 * Math.PI) / 180 - Math.PI / 2)},${
                                  100 +
                                  95 *
                                    Math.sin(
                                      ((((peakTime.peakMinuteIndex + 1) % 1440) / 60) *
                                        15 *
                                        Math.PI) /
                                        180 -
                                        Math.PI / 2
                                    )
                                } Z')`,
                              }}
                            />
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  <div className={statsStyles.dailyComparison}>
                    <div className={statsStyles.dailyComparisonTitle}>
                      {t('stats.productivity.dailyComparison')}
                    </div>
                    <div className={statsStyles.dailyList}>
                      {(() => {
                        // Получаем реальные данные продуктивности
                        const productivityStats = ProductivityUtils.getProductivityStats(tasks);
                        const { weeklyData } = productivityStats;

                        return weeklyData.map((dayData) => (
                          <div key={nanoid()} className={statsStyles.dailyItem}>
                            <div className={statsStyles.dailyDay}>{dayData.day}</div>
                            <div className={statsStyles.dailyTimeRange}>
                              {dayData.timeRange.start} - {dayData.timeRange.end}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div> */}

                <div className={statsStyles.sectionWrapper}>
                  <div className={statsStyles.timeAnalysisTitle}>
                    <span>⏱️</span>
                    {t('stats.timeAnalysis.title')}
                  </div>

                  {(() => {
                    // Анализируем реальные данные из прошлой недели
                    const categoryStats = new Map<string, number>();
                    const dailyStats = new Map<string, Map<string, number>>();

                    // Обрабатываем каждую выполненную задачу из прошлой недели
                    completedTasksFromPreviousWeek.forEach((task) => {
                      if (task.start_time && task.end_time) {
                        // Используем категорию или "остальные" если её нет
                        const category = task.category || t('stats.timeAnalysis.other');

                        // Вычисляем время выполнения в минутах
                        const startTime = new Date(`2000-01-01T${task.start_time}`);
                        const endTime = new Date(`2000-01-01T${task.end_time}`);
                        const timeSpent = Math.max(
                          0,
                          (endTime.getTime() - startTime.getTime()) / (1000 * 60)
                        ); // в минутах

                        // Общая статистика по категориям
                        categoryStats.set(category, (categoryStats.get(category) || 0) + timeSpent);

                        // Статистика по дням
                        if (task.task_date) {
                          // Используем дату как есть, без конвертации в Date объект
                          const dayKey = task.task_date;

                          if (!dailyStats.has(dayKey)) {
                            dailyStats.set(dayKey, new Map());
                          }

                          const dayMap = dailyStats.get(dayKey)!;
                          dayMap.set(category, (dayMap.get(category) || 0) + timeSpent);
                        }
                      }
                    });

                    // Получаем все уникальные категории и создаем цветовую схему
                    const allCategories = Array.from(categoryStats.keys());
                    const categoryColors = new Map<string, string>();

                    // Генерируем цвета для всех категорий
                    const uniqueColors = generateUniqueColors(allCategories.length);
                    allCategories.forEach((category, index) => {
                      if (category === t('stats.timeAnalysis.other')) {
                        // Категория "Остальные" всегда серая
                        categoryColors.set(category, '#808080');
                      } else {
                        categoryColors.set(category, uniqueColors[index]);
                      }
                    });
                    // Генерируем данные для каждого дня недели
                    const weekdays = t('weekdaysShort', { returnObjects: true }) as string[];
                    // Переставляем воскресенье в конец: Пн, Вт, Ср, Чт, Пт, Сб, Вс
                    const reorderedWeekdays = [...weekdays.slice(1), weekdays[0]];

                    // Вычисляем даты прошлой недели
                    const now = new Date();
                    const currentWeekStart = new Date(now);
                    currentWeekStart.setDate(now.getDate() - now.getDay() + 1);
                    const previousWeekStart = new Date(currentWeekStart);
                    previousWeekStart.setDate(currentWeekStart.getDate() - 7);

                    const dailyData = reorderedWeekdays.map((_, dayIndex) => {
                      const dataIndex = dayIndex + 1;

                      const currentDate = new Date(previousWeekStart);
                      currentDate.setDate(previousWeekStart.getDate() + dataIndex);
                      const dateKey = currentDate.toISOString().split('T')[0];

                      const dayCategories = dailyStats.get(dateKey) || new Map();
                      const totalMinutes = Array.from(dayCategories.values()).reduce(
                        (sum, time) => sum + time,
                        0
                      );

                      const categories = Array.from(dayCategories.entries()).map(
                        ([category, minutes]) => ({
                          id: category.toLowerCase(),
                          label: category,
                          color: categoryColors.get(category) || '#808080',
                          minutes,
                        })
                      );

                      return {
                        total: totalMinutes,
                        categories,
                      };
                    });

                    return reorderedWeekdays.map((day, dayIndex) => {
                      const dayData = dailyData[dayIndex];
                      const hours = Math.floor(dayData.total / 60);
                      const minutes = dayData.total % 60;

                      return (
                        <div key={nanoid()} className={statsStyles.timeBar}>
                          <div className={statsStyles.timeBarHeader}>
                            <div className={statsStyles.timeBarDay}>{day}</div>
                            <div className={statsStyles.timeBarTotal}>
                              {t('stats.timeAnalysis.hours', { hours, minutes })}
                            </div>
                          </div>
                          <div className={statsStyles.stackedBar}>
                            {dayData.categories.map((category) => {
                              const percentage = (category.minutes / dayData.total) * 100;
                              const hours = Math.floor(category.minutes / 60);
                              const minutes = category.minutes % 60;

                              return (
                                <div
                                  key={nanoid()}
                                  className={statsStyles.stackedSegment}
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: category.color,
                                  }}
                                  title={`${category.label}: ${t('stats.timeAnalysis.hours', {
                                    hours,
                                    minutes,
                                  })} (${Math.round(percentage)}%)`}
                                >
                                  {percentage > 15 && (
                                    <div className={statsStyles.segmentTooltip}>
                                      {Math.round(percentage)}%
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className={statsStyles.timeBarLegend}>
                            {dayData.categories.map((category) => (
                              <div key={nanoid()} className={statsStyles.legendItem}>
                                <div
                                  className={statsStyles.legendColor}
                                  style={{ backgroundColor: category.color }}
                                />
                                {category.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                <div className={statsStyles.sectionWrapper}>
                  <div className={statsStyles.completedTasksHeader}>
                    <div className={statsStyles.completedTasksTitle}>
                      <span className={statsStyles.completedTasksIcon}>✓</span>
                      {t('stats.completedTasks')}
                    </div>
                  </div>

                  <div className={statsStyles.completedTasksOverview}>
                    {(() => {
                      const stats = CompletedTasksUtils.getCompletedTasksStats(tasks);

                      return (
                        <div className={statsStyles.completedTasksNumbers}>
                          <div className={statsStyles.completedTasksNumber}>
                            <div className={statsStyles.completedTasksValue}>
                              {stats.allTime.toLocaleString()}
                            </div>
                            <div className={statsStyles.completedTasksLabel}>
                              {t('stats.allTime')}
                            </div>
                          </div>
                          <div className={statsStyles.completedTasksNumber}>
                            <div className={statsStyles.completedTasksValue}>
                              {stats.thisMonth.toLocaleString()}
                            </div>
                            <div className={statsStyles.completedTasksLabel}>
                              {t('stats.thisMonth')}
                            </div>
                          </div>
                          <div className={statsStyles.completedTasksNumber}>
                            <div className={statsStyles.completedTasksValue}>
                              {stats.today.toLocaleString()}
                            </div>
                            <div className={statsStyles.completedTasksLabel}>
                              {t('stats.today')}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    <div className={statsStyles.completedTasksChart}>
                      <div className={statsStyles.completedTasksChartTitle}>
                        <span>{t('stats.yearlyProgress')}</span>
                        <span className={statsStyles.year}>{new Date().getFullYear()}</span>
                      </div>
                      <div className={statsStyles.chartBars}>
                        {(() => {
                          const currentYear = new Date().getFullYear();
                          const monthlyData = CompletedTasksUtils.getMonthlyData(
                            tasks,
                            currentYear
                          );
                          const maxValue = Math.max(...monthlyData, 1);
                          const MAX_HEIGHT = 180;

                          return monthlyData.map((value, index) => {
                            const heightPercentage = (value / maxValue) * 100;
                            const heightPx = Math.max((heightPercentage * MAX_HEIGHT) / 100, 20);

                            const monthDate = new Date(currentYear, index);
                            const monthLabel = t(`monthNamesShort.${monthDate.getMonth()}`);

                            return (
                              <div key={nanoid()} className={statsStyles.chartBarWrapper}>
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
                      <div className={statsStyles.breakdownTitle}>
                        {t('stats.byCategory') + ' #'}
                      </div>
                      <div className={statsStyles.breakdownItems}>
                        {(() => {
                          const categoryStats = CompletedTasksUtils.getCategoryStats(tasks);
                          const sortedCategories = Array.from(categoryStats.entries())
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 3); // Показываем топ-3 категории

                          return sortedCategories.map(([category, count]) => (
                            <div key={category} className={statsStyles.breakdownItem}>
                              <div className={statsStyles.breakdownLabel}>
                                {category === 'other' ? t('stats.timeAnalysis.other') : category}
                              </div>
                              <div className={statsStyles.breakdownValue}>
                                {count.toLocaleString()}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    <div className={statsStyles.breakdownSection}>
                      <div className={statsStyles.breakdownTitle}>{t('stats.byPriority')}</div>
                      <div className={statsStyles.breakdownItems}>
                        {(() => {
                          const priorityStats = CompletedTasksUtils.getPriorityStats(tasks);
                          const priorities = ['high', 'medium', 'low', 'none'];

                          return priorities.map((priority) => {
                            const count = priorityStats.get(priority) || 0;
                            return (
                              <div key={priority} className={statsStyles.breakdownItem}>
                                <div className={statsStyles.breakdownLabel}>
                                  <Badge
                                    label={'🎯 ' + t(`task.priorityType.${priority}`)}
                                    num={getPriorityColorIndex(priority as any)}
                                    title={t('task.priority')}
                                  />
                                </div>
                                <div className={statsStyles.breakdownValue}>
                                  {count.toLocaleString()}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    <div className={statsStyles.timeSpentChart}>
                      <div className={statsStyles.timeSpentTitle}>
                        {t('stats.timeSpent')}
                        <span className={statsStyles.year}> {new Date().getFullYear()}</span>
                      </div>
                      <div className={statsStyles.timeSpentLine}>
                        {(() => {
                          const totalMinutes = CompletedTasksUtils.getTotalTimeSpent(tasks);
                          const totalHours = Math.floor(totalMinutes / 60);
                          const minutes = Math.floor(totalMinutes % 60);

                          // Вычисляем процент заполнения (максимум 1000 часов для визуализации)
                          const maxHours = 1000;
                          const fillPercent = Math.min((totalHours / maxHours) * 100, 100);

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
                        type='button'
                        variant='secondary'
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
                        type='button'
                        variant='secondary'
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
                    {(() => {
                      // Переставляем дни недели так, чтобы понедельник был первым
                      const weekdays = t('weekdaysShort', { returnObjects: true }) as string[];
                      const reorderedWeekdays = [...weekdays.slice(1), weekdays[0]]; // Пн, Вт, Ср, Чт, Пт, Сб, Вс

                      return reorderedWeekdays.map((day: string) => (
                        <div key={nanoid()} className={statsStyles.weekdayHeader}>
                          {day}
                        </div>
                      ));
                    })()}

                    {(() => {
                      const activityData = ActivityUtils.getActivityData(tasks, currentMonth);

                      // Сдвигаем данные на один день вперед для соответствия новому порядку дней недели
                      const shiftedDays = activityData.days.map((_, index) => {
                        const shiftedIndex = (index + 1) % activityData.days.length;
                        return activityData.days[shiftedIndex];
                      });

                      return (
                        <>
                          {activityData.emptyCells.map(() => (
                            <div
                              key={nanoid()}
                              className={`${statsStyles.calendarDay} ${statsStyles.emptyDay}`}
                            />
                          ))}

                          {shiftedDays.map((day) => (
                            <div
                              key={nanoid()}
                              className={statsStyles.calendarDay}
                              style={{
                                backgroundColor: ActivityUtils.getIntensityColor(day.intensity),
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
    )
  );
};
