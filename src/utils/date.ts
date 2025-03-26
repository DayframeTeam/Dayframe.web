export function formatDateToISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Форматирует дату вида '2025-03-27T00:00:00.000Z' в '2025-03-27'
export function extractISODate(dateString: string): string {
  return dateString.slice(0, 10);
}
