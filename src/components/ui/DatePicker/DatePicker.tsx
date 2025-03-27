import React from 'react';
import ReactDatePicker from 'react-datepicker';
import styles from './DatePicker.module.scss';

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
};

export default function DatePicker({ value, onChange, placeholder, minDate, maxDate }: Props) {
  return (
    <div className={styles.wrapper}>
      <ReactDatePicker
        selected={value}
        onChange={onChange}
        dateFormat="yyyy-MM-dd"
        placeholderText={placeholder || 'Выберите дату'}
        className={styles.input}
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  );
}
