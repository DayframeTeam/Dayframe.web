export const toLocalDateString = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('sv-SE'); // формат YYYY-MM-DD
};

export function formatDateToLocalYYYYMMDD(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
}

export const formatDateDayMonth = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  // const day = date.getDate();
  return `${day}.${month}`;
};

export const formatTime = (time: string | null | undefined): string | null => {
  if (!time) return null;
  return time.split(':').slice(0, 2).join(':');
};

export const calculateDuration = (
  startTime: string | null | undefined,
  endTime: string | null | undefined
): string | null => {
  if (!startTime || !endTime) return null;

  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  let durationMinutes = endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
  if (durationMinutes < 0) durationMinutes += 24 * 60; // если конец на следующий день

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
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
