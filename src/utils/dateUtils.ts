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
