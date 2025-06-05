
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'month' | 'week' | 'day';
  onNavigateDate: (direction: 'prev' | 'next') => void;
  onViewChange: (view: 'month' | 'week' | 'day') => void;
}

const CalendarHeader = ({ currentDate, view, onNavigateDate, onViewChange }: CalendarHeaderProps) => {
  const formatDateHeader = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long'
    };
    return currentDate.toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => onNavigateDate('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onNavigateDate('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold capitalize">{formatDateHeader()}</h2>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant={view === 'month' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => onViewChange('month')}
          className={view === 'month' ? 'bg-ninacare-primary hover:bg-ninacare-primary/90' : ''}
        >
          Mês
        </Button>
        <Button 
          variant={view === 'week' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => onViewChange('week')}
          className={view === 'week' ? 'bg-ninacare-primary hover:bg-ninacare-primary/90' : ''}
        >
          Semana
        </Button>
        <Button 
          variant={view === 'day' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => onViewChange('day')}
          className={view === 'day' ? 'bg-ninacare-primary hover:bg-ninacare-primary/90' : ''}
        >
          Dia
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
