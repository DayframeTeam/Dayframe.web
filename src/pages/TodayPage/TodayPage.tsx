import { useAppSelector } from '../../hooks/storeHooks';
import { TaskSection } from '../../modules/TaskSection/TaskSection';
import { selectTaskIdsByDateIncludingUndated } from '../../entities/task/store/tasksSlice';
import { TemplateTaskSelectors } from '../../entities/template-tasks/store/templateTasksSlice';
import { TemplateTaskUtils } from '../../entities/template-tasks/template.tasks.utils';

export const TodayPage = () => {
  // Получаем сегодняшнюю дату в формате YYYY-MM-DD
  const today = new Date().toLocaleDateString('sv-SE');

  // Получаем ID задач на сегодня через селектор
  const todayTaskIds = useAppSelector((state) => selectTaskIdsByDateIncludingUndated(state, today));
  const allTemplateTasks = useAppSelector(TemplateTaskSelectors.selectAllTemplateTasks);
  // получаем только те шаблонные задачи, которых ещё нет и которые надо создать сегодня
  const templateToCreate = TemplateTaskUtils.getTasksForDate(allTemplateTasks, todayTaskIds, today);
  console.log('suggestedTemplateIds', templateToCreate);
  return <TaskSection date={today} taskIds={todayTaskIds} />;
};

TodayPage.displayName = 'TodayPage';
