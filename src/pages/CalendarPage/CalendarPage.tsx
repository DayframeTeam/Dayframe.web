import React from 'react';
import { Calendar } from '../../modules/Calendar/Calendar';

export const CalendarPage: React.FC = React.memo(() => {
  console.log('CalendarPage');
  return <Calendar />;
});

CalendarPage.displayName = 'CalendarPage';
