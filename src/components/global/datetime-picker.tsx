import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { EventCalendar } from './event-calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  location?: string;
  onLocationChange?: (location: string) => void;
  placeholder?: string;
  className?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  location = '',
  onLocationChange,
  // placeholder não utilizado
  className,
}) => {
  const [date, setDate] = useState<Date>(value);
  const [time, setTime] = useState<string>(
    `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
  );
  const timeOptions = generateTimeOptions();

  // Função handleDateSelect removida pois não estava sendo utilizada

  const handleTimeChange = (selectedTime: string) => {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(hours, minutes, 0, 0);

    setTime(selectedTime);
    onChange(combinedDateTime);
  };

  return (
    <div className={cn('grid grid-cols-1 gap-2', className)}>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="mb-1 block text-xs text-muted-foreground">Local</Label>
          <Input
            placeholder="Digite o local da sessão"
            value={location}
            onChange={(e) => onLocationChange?.(e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-1 block text-xs text-muted-foreground">Data</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP', { locale: ptBR }) : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <EventCalendar
                value={date}
                onChange={(selectedDate) => {
                  const [hours, minutes] = time.split(':').map(Number);
                  const combinedDateTime = new Date(selectedDate);
                  combinedDateTime.setHours(hours, minutes, 0, 0);

                  setDate(combinedDateTime);
                  onChange(combinedDateTime);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="mb-1 block text-xs text-muted-foreground">Início</Label>
          <Select onValueChange={handleTimeChange} value={time}>
            <SelectTrigger>
              <SelectValue placeholder="Hora Início">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {time}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {timeOptions.map((timeOption) => (
                <SelectItem key={timeOption} value={timeOption}>
                  {timeOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block text-xs text-muted-foreground">Término</Label>
          <Select
            onValueChange={() => {
              // Lógica para lidar com o horário de término
            }}
            value={time} // Você pode querer criar um estado separado para o horário de término
          >
            <SelectTrigger>
              <SelectValue placeholder="Hora Término">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {time}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {timeOptions.map((timeOption) => (
                <SelectItem key={timeOption} value={timeOption}>
                  {timeOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
