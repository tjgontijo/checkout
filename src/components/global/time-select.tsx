import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Gerar opções de horário das 6h às 22h em intervalos de 30 minutos
const generateTimeOptions = () => {
  const options: string[] = [];

  for (let hour = 6; hour <= 22; hour++) {
    // Hora cheia
    options.push(`${hour.toString().padStart(2, '0')}:00`);

    // Meia hora
    options.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  return options;
};

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TimeSelect: React.FC<TimeSelectProps> = ({
  value,
  onChange,
  placeholder = 'Selecione o horário',
}) => {
  const timeOptions = generateTimeOptions();

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto">
        {timeOptions.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
