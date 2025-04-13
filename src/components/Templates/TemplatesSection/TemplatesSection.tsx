import { memo } from 'react';
import { TemplateTask } from '../../../types/dbTypes';
import { TemplateTasksSection } from '../TemplateTasksSection/TemplateTasksSection';

type TemplatesSectionProps = {
  templates: TemplateTask[];
};

export const TemplatesSection = memo(({ templates }: TemplatesSectionProps) => {
  const daily: TemplateTask[] = [];
  const weekly: TemplateTask[] = [];
  const custom: TemplateTask[] = [];
  const quests: TemplateTask[] = [];

  templates.forEach((template) => {
    if (template.repeat_rule === 'daily') {
      daily.push(template);
    } else if (template.repeat_rule === 'weekly') {
      weekly.push(template);
    } else if (template.repeat_rule === 'quests') {
      quests.push(template);
    } else {
      custom.push(template);
    }
  });
  return (
    <section>
      <TemplateTasksSection type='daily' templateTasks={daily} />
      <TemplateTasksSection type='weekly' templateTasks={weekly} />
      <TemplateTasksSection type='custom' templateTasks={custom} />
      <TemplateTasksSection type='quests' templateTasks={quests} />
    </section>
  );
});

TemplatesSection.displayName = 'TemplatesSection';
