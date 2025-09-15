
import React, { useMemo, useState } from 'react';
import type { Habit } from '../../types';
import { getMonthName, getDaysInMonth, getFirstDayOfMonth } from '../../utils/dateUtils';

interface HabitGridProps {
  habit: Habit;
}

const HabitGrid: React.FC<HabitGridProps> = ({ habit }) => {
  const [date, setDate] = useState(new Date());

  const year = date.getFullYear();
  const month = date.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const gridDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ key: `empty-${i}`, empty: true });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        key: dateString,
        day,
        isCompleted: !!habit.completions[dateString],
      });
    }
    return days;
  }, [year, month, daysInMonth, firstDay, habit.completions]);
  
  const calculateStreak = () => {
      let currentStreak = 0;
      let maxStreak = 0;
      const sortedDates = Object.keys(habit.completions).sort();
      if(sortedDates.length === 0) return { current: 0, max: 0};
      
      let lastDate = new Date(sortedDates[0]);
      currentStreak = 1;
      maxStreak = 1;
      
      for(let i=1; i < sortedDates.length; i++){
          let currentDate = new Date(sortedDates[i]);
          const diff = (currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
          if (diff === 1) {
              currentStreak++;
          } else {
              currentStreak = 1;
          }
          if(currentStreak > maxStreak) {
              maxStreak = currentStreak;
          }
          lastDate = currentDate;
      }
      
      const today = new Date();
      today.setHours(0,0,0,0);
      const lastCompletionDate = new Date(sortedDates[sortedDates.length-1]);
      const diffToday = (today.getTime() - lastCompletionDate.getTime()) / (1000 * 3600 * 24);

      if(diffToday > 1){
          currentStreak = 0;
      }

      return { current: currentStreak, max: maxStreak };
  }

  const streak = calculateStreak();

  const changeMonth = (offset: number) => {
      setDate(d => {
          const newDate = new Date(d);
          newDate.setMonth(d.getMonth() + offset);
          return newDate;
      });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">{habit.name}</h2>
      <div className="flex justify-between items-center mb-4">
        <p className="text-slate-400">Current Streak: <span className="font-bold text-green-400">{streak.current} days</span></p>
        <p className="text-slate-400">Max Streak: <span className="font-bold text-cyan-400">{streak.max} days</span></p>
      </div>

      <div className="flex justify-between items-center mb-4 bg-slate-700/50 p-2 rounded-md">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-md hover:bg-slate-600">&lt;</button>
        <h3 className="font-semibold text-lg">{getMonthName(month)} {year}</h3>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-md hover:bg-slate-600">&gt;</button>
      </div>
      
      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map(day => (
          <div key={day} className="text-center font-bold text-xs text-slate-400">{day}</div>
        ))}
        {gridDays.map(d => (
          d.empty ? <div key={d.key} /> : (
            <div
              key={d.key}
              title={d.key}
              className={`w-full aspect-square rounded ${d.isCompleted ? 'bg-cyan-500' : 'bg-slate-700'}`}
            ></div>
          )
        ))}
      </div>
    </div>
  );
};

export default HabitGrid;
