const priorityColorMap: Record<'low' | 'medium' | 'high', number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export function getPriorityColorIndex(
  priority: 'low' | 'medium' | 'high' | null | undefined
): number {
  return priority ? (priorityColorMap[priority] ?? 0) : 0;
}
