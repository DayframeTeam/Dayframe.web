import React from 'react';
import ReactDatePicker from 'react-datepicker';
import styles from './TimePicker.module.scss';

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
};

export default function TimePicker({ value, onChange, placeholder }: Props) {
  return (
    <div className={styles.wrapper}>
      <ReactDatePicker
        selected={value}
        onChange={onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={5}
        timeCaption="Время"
        dateFormat="HH:mm"
        placeholderText={placeholder || 'Выберите время'}
        className={styles.input}
      />
    </div>
  );
}
