import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import Card from '../components/ui/Card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar: React.FC = () => {
  const { trades } = useTrades();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Format numbers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => {
      const year = prevDate.getMonth() === 0 ? prevDate.getFullYear() - 1 : prevDate.getFullYear();
      const month = prevDate.getMonth() === 0 ? 11 : prevDate.getMonth() - 1;
      return new Date(year, month, 1);
    });
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(prevDate => {
      const year = prevDate.getMonth() === 11 ? prevDate.getFullYear() + 1 : prevDate.getFullYear();
      const month = prevDate.getMonth() === 11 ? 0 : prevDate.getMonth() + 1;
      return new Date(year, month, 1);
    });
  };
  
  // Generate calendar data
  const generateCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const startDayIndex = firstDay.getDay();
    
    // Total days in the month
    const totalDays = lastDay.getDate();
    
    // Generate calendar array
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayIndex; i++) {
      calendarDays.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= totalDays; day++) {
      calendarDays.push(day);
    }
    
    return calendarDays;
  };
  
  // Get trades for a specific day
  const getTradesForDay = (day: number | null) => {
    if (day === null) return [];
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, day);
    
    // Format date to YYYY-MM-DD for comparison
    const formattedDate = date.toISOString().split('T')[0];
    
    return trades.filter(trade => {
      const tradeDate = new Date(trade.date).toISOString().split('T')[0];
      return tradeDate === formattedDate;
    });
  };
  
  // Calculate total profit for a day
  const getDayProfit = (day: number | null) => {
    if (day === null) return 0;
    
    const dayTrades = getTradesForDay(day);
    return dayTrades.reduce((total, trade) => total + trade.profit, 0);
  };
  
  // Get day class based on profit
  const getDayClass = (day: number | null) => {
    if (day === null) return 'bg-gray-50 dark:bg-gray-900';
    
    const profit = getDayProfit(day);
    
    if (profit > 0) return 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30';
    if (profit < 0) return 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30';
    
    const dayTrades = getTradesForDay(day);
    return dayTrades.length > 0 
      ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700' 
      : 'hover:bg-gray-100 dark:hover:bg-gray-800';
  };
  
  const calendarDays = generateCalendarData();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trading Calendar</h1>
      
      {/* Calendar Card */}
      <Card className="overflow-hidden">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {monthName} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {daysOfWeek.map((day, index) => (
            <div 
              key={index} 
              className="p-2 text-center font-medium text-gray-700 dark:text-gray-300"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map((day, index) => {
            const dayTrades = getTradesForDay(day);
            const dayProfit = getDayProfit(day);
            const hasData = dayTrades.length > 0;
            
            return (
              <div 
                key={index} 
                className={`min-h-24 p-2 border border-gray-200 dark:border-gray-700 rounded-md transition-colors 
                  ${getDayClass(day)}`}
              >
                {day !== null && (
                  <>
                    <div className="font-medium">{day}</div>
                    {hasData && (
                      <div className="mt-1">
                        <div className="text-xs font-medium">
                          {dayTrades.length} {dayTrades.length === 1 ? 'trade' : 'trades'}
                        </div>
                        <div className={`text-sm font-medium ${
                          dayProfit > 0 ? 'text-green-600 dark:text-green-400' : 
                          dayProfit < 0 ? 'text-red-600 dark:text-red-400' : 
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {formatCurrency(dayProfit)}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 mr-2"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Profitable Day</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 mr-2"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Loss Day</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 mr-2"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Breakeven Day</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;