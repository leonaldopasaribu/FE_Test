import { useRef } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import type { Instance } from 'flatpickr/dist/types/instance';

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  className = '',
  disabled = false,
}: DatePickerProps) {
  const flatpickrRef = useRef<Instance | null>(null);

  const handleChange = (dates: Date[]) => {
    if (dates.length > 0) {
      const selectedDate = dates[0];
      const formattedDate = selectedDate.toISOString().split('T')[0];
      onChange(formattedDate);
    } else {
      onChange('');
    }
  };

  return (
    <div className="relative">
      <Flatpickr
        ref={fp => {
          if (fp?.flatpickr) {
            flatpickrRef.current = fp.flatpickr;
          }
        }}
        value={value}
        onChange={handleChange}
        options={{
          dateFormat: 'Y-m-d',
          allowInput: true,
          locale: {
            firstDayOfWeek: 1,
          },
        }}
        className={`focus:border-primary active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded-lg border border-gray-200 bg-transparent px-5 py-3 transition outline-none disabled:cursor-default dark:border-gray-700 dark:text-white ${className}`}
        placeholder={placeholder}
        disabled={disabled}
      />
      <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
  );
}
