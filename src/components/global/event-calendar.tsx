import React, { useState } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EventCalendarProps {
  value?: Date
  onChange?: (date: Date) => void
  className?: string
}

export const EventCalendar: React.FC<EventCalendarProps> = ({ 
  value = new Date(), 
  onChange, 
  className 
}) => {
  const [currentMonth, setCurrentMonth] = useState(value)

  const renderHeader = () => {
    const monthYear = format(currentMonth, 'MMMM yyyy', { locale: ptBR })
    return (
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-sm font-semibold capitalize">
          {monthYear}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  const renderDays = () => {
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    return (
      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-2">
        {weekdays.map((day) => (
          <div key={day} className="font-medium">{day}</div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const dateRows = eachDayOfInterval({ start: startDate, end: endDate })

    return (
      <div className="grid grid-cols-7 gap-1">
        {dateRows.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = value && isSameDay(day, value)
          const isDayToday = isToday(day)

          return (
            <div 
              key={idx} 
              className={cn(
                "h-10 flex items-center justify-center rounded-md cursor-pointer",
                !isCurrentMonth && "text-muted-foreground opacity-50",
                isSelected && "bg-primary text-primary-foreground",
                isDayToday && !isSelected && "bg-accent text-accent-foreground",
                "hover:bg-accent hover:text-accent-foreground transition-colors"
              )}
              onClick={() => {
                if (isCurrentMonth && onChange) {
                  onChange(day)
                }
              }}
            >
              {format(day, 'd')}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn("p-4 border rounded-lg shadow-sm", className)}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  )
}
