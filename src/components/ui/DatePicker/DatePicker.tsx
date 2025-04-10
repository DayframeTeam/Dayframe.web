import { useId } from 'react';
import ReactDatePicker from 'react-datepicker';
import shared from '../shared.module.scss';
import { ru, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

type Props = Readonly<{
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}>;

export default function DatePicker({
  value,
  label,
  onChange,
  placeholder,
  minDate,
  maxDate,
}: Props) {
  const inputId = useId();
  const { i18n } = useTranslation();

  const localeMap = {
    ru,
    en: enUS,
  };

  const currentLocale = localeMap[i18n.language as keyof typeof localeMap] || enUS;

  return (
    <div className={shared.wrapper}>
      {label && (
        <label htmlFor={inputId} className={shared.label}>
          {label}
        </label>
      )}
      <ReactDatePicker
        id={inputId}
        selected={value}
        onChange={onChange}
        dateFormat="yyyy-MM-dd"
        placeholderText={placeholder}
        className={shared.input}
        minDate={minDate}
        maxDate={maxDate}
        locale={currentLocale}
      />
    </div>
  );
}
