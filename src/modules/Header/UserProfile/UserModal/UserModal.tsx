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
import { getPriorityColorIndex } from '../../../../utils/getPriorityColorIndex';
import { StreakUtils } from '../../../../utils/streakUtils';
import { ProductivityUtils } from '../../../../utils/productivityUtils';
import { selectAllTasks } from '../../../../entities/task/store/tasksSlice';

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
                </div>

                <div className={statsStyles.sectionWrapper}>
                  <div className={statsStyles.timeAnalysisTitle}>
                    <span>⏱️</span>
                    {t('stats.timeAnalysis.title')}
                  </div>

                  {(() => {
                    // Функция для генерации массива уникальных цветов
                    const generateUniqueColors = (count: number) => {
                      const colors: string[] = [];
                      const hueStep = 360 / count; // Равномерно распределяем оттенки

                      for (let i = 0; i < count; i++) {
                        // Добавляем небольшую случайность к базовому оттенку
                        const hue = (i * hueStep + Math.random() * 20 - 10) % 360;
                        // Более сбалансированные параметры для насыщенности и яркости
                        colors.push(`hsl(${hue}, 65%, 65%)`);
                      }

                      return colors;
                    };

                    // Список возможных категорий
                    const allCategories = [
                      'Work',
                      'Study',
                      'Personal',
                      'Health',
                      'Shopping',
                      'Family',
                      'Friends',
                      'Hobby',
                      'Sport',
                      'Reading',
                      'Learning',
                      'Projects',
                      'Meetings',
                      'Planning',
                      'Rest',
                    ];

                    // Генерируем данные для каждого дня
                    const weekdays = t('weekdaysShort', { returnObjects: true }) as string[];
                    const reorderedWeekdays = [...weekdays.slice(1), weekdays[0]];

                    const dailyData = reorderedWeekdays.map(() => {
                      // Выбираем случайное количество категорий (2-5) для этого дня
                      const numCategories = Math.floor(Math.random() * 4) + 2;

                      // Генерируем уникальные цвета для этого дня
                      const uniqueColors = generateUniqueColors(numCategories);

                      // Перемешиваем массив категорий и берем первые numCategories элементов
                      const shuffledCategories = [...allCategories]
                        .sort(() => Math.random() - 0.5)
                        .slice(0, numCategories)
                        .map((label, index) => ({
                          id: label.toLowerCase(),
                          label,
                          color: uniqueColors[index], // Используем предварительно сгенерированный уникальный цвет
                        }));

                      // Общее время в минутах (2-6 часов)
                      const totalMinutes = (Math.floor(Math.random() * 4) + 2) * 60;

                      // Распределяем время по категориям
                      let remainingMinutes = totalMinutes;
                      const categoryTimes = shuffledCategories.map((_, index) => {
                        if (index === shuffledCategories.length - 1) {
                          return remainingMinutes;
                        }
                        const minutes = Math.floor(Math.random() * remainingMinutes * 0.6);
                        remainingMinutes -= minutes;
                        return minutes;
                      });

                      return {
                        total: totalMinutes,
                        categories: shuffledCategories.map((cat, index) => ({
                          ...cat,
                          minutes: categoryTimes[index],
                        })),
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
                    <div className={statsStyles.completedTasksNumbers}>
                      <div className={statsStyles.completedTasksNumber}>
                        <div className={statsStyles.completedTasksValue}>1,234</div>
                        <div className={statsStyles.completedTasksLabel}>{t('stats.allTime')}</div>
                      </div>
                      <div className={statsStyles.completedTasksNumber}>
                        <div className={statsStyles.completedTasksValue}>156</div>
                        <div className={statsStyles.completedTasksLabel}>
                          {t('stats.thisMonth')}
                        </div>
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
                    {(t('weekdaysShort', { returnObjects: true }) as string[]).map(
                      (day: string) => (
                        <div key={nanoid()} className={statsStyles.weekdayHeader}>
                          {day}
                        </div>
                      )
                    )}

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
                          {emptyCells.map(() => (
                            <div
                              key={nanoid()}
                              className={`${statsStyles.calendarDay} ${statsStyles.emptyDay}`}
                            />
                          ))}

                          {days.map((day) => (
                            <div
                              key={nanoid()}
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
    )
  );
};
