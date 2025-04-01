export const toLocalDateString = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('sv-SE'); // формат YYYY-MM-DD
};

export const timeStringToDate = (time: string | null | undefined): Date | null => {
  if (!time) return null;
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const now = new Date();
  now.setHours(hours || 0);
  now.setMinutes(minutes || 0);
  now.setSeconds(seconds || 0);
  now.setMilliseconds(0);
  return now;
};

export function formatDateToISO(year: number, month: number, day: number): string {
  const paddedMonth = String(month + 1).padStart(2, '0');
  const paddedDay = String(day).padStart(2, '0');
  return `${year}-${paddedMonth}-${paddedDay}`;
}

export function parseTaskDate(dateString: string | null | undefined): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return formatDateToISO(date.getFullYear(), date.getMonth(), date.getDate());
}
