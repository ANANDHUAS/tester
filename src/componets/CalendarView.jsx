import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = ({ savedOpportunities, onViewDetails }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (offset) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(1); // Avoid issues with day numbers
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  // Group opportunities by their deadline date (YYYY-MM-DD)
  const deadlinesByDate = useMemo(() => {
    return savedOpportunities.reduce((acc, opp) => {
      // Normalize deadline to midnight in local timezone
      const deadline = new Date(opp.deadline);
      const localDeadline = new Date(deadline.getTime() + deadline.getTimezoneOffset() * 60000);
      const dateKey = localDeadline.toISOString().split('T')[0];
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(opp);
      return acc;
    }, {});
  }, [savedOpportunities]);

  // Calendar grid generation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create an array for all 42 cells (6 weeks)
  const calendarGrid = [];
  
  // 1. Add padding days from previous month
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = 0; i < firstDayOfMonth; i++) {
    const day = prevMonthDays - firstDayOfMonth + 1 + i;
    calendarGrid.push({ day, isCurrentMonth: false });
  }

  // 2. Add days for current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarGrid.push({ 
      day, 
      isCurrentMonth: true, 
      dateKey,
      deadlines: deadlinesByDate[dateKey] || []
    });
  }

  // 3. Add padding days from next month
  const gridCount = 42; // 6 weeks * 7 days
  let nextMonthDay = 1;
  while (calendarGrid.length < gridCount) {
    calendarGrid.push({ day: nextMonthDay++, isCurrentMonth: false });
  }
  
  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];

  return (
    <div className="bg-white p-6 rounded-lg border shadow-lg">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{`${monthName} ${year}`}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div>
        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-2">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7 gap-1">
          {calendarGrid.map((cell, index) => (
            <div
              key={index}
              className={`h-28 border border-gray-200 rounded-md p-1.5 overflow-hidden ${
                cell.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
              }`}
            >
              <div className={`font-semibold text-xs ${
                cell.isCurrentMonth && cell.dateKey === todayKey 
                ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' 
                : ''
              }`}>
                {cell.day}
              </div>
              {cell.isCurrentMonth && cell.deadlines.length > 0 && (
                <ul className="mt-1 space-y-1 overflow-y-auto max-h-[70px] custom-scrollbar">
                  {cell.deadlines.map(opp => (
                    <li 
                      key={opp.id}
                      onClick={() => onViewDetails(opp)}
                      className="text-xs font-medium text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-full truncate cursor-pointer hover:bg-blue-200"
                      title={opp.title}
                    >
                      {opp.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;