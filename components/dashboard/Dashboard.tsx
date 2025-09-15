
import React from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { Expense, Task, PomodoroSession, Habit, View } from '../../types';
import DashboardCard from './DashboardCard';
import { getTodayDateString } from '../../utils/dateUtils';

const BudgetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
const TimerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const TodoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);
const HabitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-2.714 4.222a2 2 0 00.175 2.773l2.714 4.222a2 2 0 001.736.97h.085a2 2 0 002-2v-5z" />
    </svg>
);

interface DashboardProps {
    setActiveView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
  const [expenses] = useLocalStorage<Expense[]>('expenses', []);
  const [tasks] = useLocalStorage<Task[]>('tasks', []);
  const [pomodoroHistory] = useLocalStorage<PomodoroSession[]>('pomodoroHistory', []);
  const [habits] = useLocalStorage<Habit[]>('habits', []);
  const today = getTodayDateString();

  const spentToday = expenses
    .filter(e => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);

  const pomodoroSessionsToday = pomodoroHistory.find(p => p.date === today)?.count || 0;

  const tasksLeftToday = tasks.filter(t => !t.isCompleted && (!t.dueDate || t.dueDate === today)).length;
  
  const habitsCompletedToday = habits.filter(h => h.completions[today]).length;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Spent Today"
          value={`$${spentToday.toFixed(2)}`}
          description="Total expenses for today"
          icon={<BudgetIcon />}
          color="bg-red-500"
          onClick={() => setActiveView('budget')}
        />
        <DashboardCard
          title="Focus Sessions"
          value={pomodoroSessionsToday}
          description="Pomodoro sessions completed"
          icon={<TimerIcon />}
          color="bg-cyan-500"
          onClick={() => setActiveView('pomodoro')}
        />
        <DashboardCard
          title="Tasks Remaining"
          value={tasksLeftToday}
          description="Incomplete tasks for today"
          icon={<TodoIcon />}
          color="bg-yellow-500"
          onClick={() => setActiveView('todo')}
        />
        <DashboardCard
          title="Habits Done"
          value={`${habitsCompletedToday} / ${habits.length}`}
          description="Habits completed today"
          icon={<HabitIcon />}
          color="bg-green-500"
          onClick={() => setActiveView('habits')}
        />
      </div>
       <div className="mt-8 bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Welcome to Campus Companion!</h2>
            <p className="text-slate-400">
                This is your personal dashboard for staying productive. All your data is saved securely in your browser.
                Click on a card above or use the sidebar to navigate to your tools.
            </p>
        </div>
    </div>
  );
};

export default Dashboard;
