import { memo } from 'react';
import { TemplateTasksSection } from '../TemplateTasksSection/TemplateTasksSection';
import { useAppSelector } from '../../../hooks/storeHooks';
import {
  selectDailyTemplateTasks,
  selectWeeklyTemplateTasks,
  selectQuestsTemplateTasks,
  selectCustomTemplateTasks,
} from '../../../entities/template-tasks/store/templateTasksSlice';

export const TemplatesSection = memo(() => {
  const daily = useAppSelector(selectDailyTemplateTasks);
  const weekly = useAppSelector(selectWeeklyTemplateTasks);
  const custom = useAppSelector(selectCustomTemplateTasks);
  const quests = useAppSelector(selectQuestsTemplateTasks);

  return (
    <section>
      <TemplateTasksSection type={[1, 2, 3, 4, 5, 6, 7]} templateTasks={daily} />
      <TemplateTasksSection type="weekly" templateTasks={weekly} />
      <TemplateTasksSection type={[1]} templateTasks={custom} />
      <TemplateTasksSection type="quests" templateTasks={quests} />
      {/* <TemplatesDaysSection /> */}
    </section>
  );
});

TemplatesSection.displayName = 'TemplatesSection';
