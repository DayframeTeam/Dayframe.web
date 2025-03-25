import selectTemplates from '../data/select_options.json';

type SelectType = keyof typeof selectTemplates;

type OptionInfo = {
  label: string;
  priority: number;
} | null;

export function getTemplateInfoByValue(type: SelectType, value?: string): OptionInfo {
  if (!value) return null;

  const found = selectTemplates[type]?.find((item) => item.value === value);
  return found ? { label: found.label, priority: found.priority } : null;
}
