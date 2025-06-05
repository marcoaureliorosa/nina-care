
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Appointment {
  id: number;
  patient: string;
  type: string;
  date: string;
  time: string;
  status: string;
}

interface CalendarGridProps {
  view: 'month' | 'week' | 'day';
  currentDate: Date;
  appointments: Appointment[];
}

const CalendarGrid = ({ view, currentDate, appointments }: CalendarGridProps) => {
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month's days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonth.getDate() - i)
      });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: new Date(year, month, day)
      });
    }
    
    // Next month's days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, day)
      });
    }
    
    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  if (view === 'month') {
    return (
      <Card className="h-full">
        <CardContent className="p-0">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day} className="p-3 text-center font-medium text-gray-500 bg-gray-50">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 h-full">
            {getMonthDays().map((day, index) => {
              const dayAppointments = getAppointmentsForDate(day.fullDate);
              const isToday = day.fullDate.toDateString() === new Date().toDateString();
              
              return (
                <div 
                  key={index} 
                  className={`min-h-32 p-2 border-r border-b relative ${
                    !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
                  } ${isToday ? 'bg-blue-50' : ''} hover:bg-gray-50 transition-colors`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isToday ? 'text-ninacare-primary' : ''
                  }`}>
                    {day.date}
                  </div>
                  
                  <div className="space-y-1">
                    {dayAppointments.map((appointment) => (
                      <div 
                        key={appointment.id}
                        className={`text-xs p-1 rounded text-white truncate cursor-pointer ${
                          appointment.status === 'confirmado' ? 'bg-green-500' : 'bg-ninacare-primary'
                        }`}
                        title={`${appointment.time} - ${appointment.patient}`}
                      >
                        {appointment.time} {appointment.patient}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (view === 'week') {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-gray-500 py-16">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">Visualização Semanal</h3>
            <p>Em desenvolvimento...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-center text-gray-500 py-16">
          <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">Visualização Diária</h3>
          <p>Em desenvolvimento...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarGrid;
