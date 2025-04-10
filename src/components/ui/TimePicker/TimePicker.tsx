import ReactDatePicker from 'react-datepicker';
import shared from '../shared.module.scss';

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
};

export default function TimePicker({ value, onChange, placeholder }: Props) {
  return (
    <div className={shared.wrapper}>
      <ReactDatePicker
        selected={value}
        onChange={onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={5}
        timeCaption="Время"
        dateFormat="HH:mm"
        placeholderText={placeholder || 'Выберите время'}
        className={shared.input}
      />
    </div>
  );
}
