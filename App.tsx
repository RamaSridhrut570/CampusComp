
import React, { useState } from 'react';
import type { View } from './types';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import BudgetManager from './components/budget/BudgetManager';
import PomodoroTimer from './components/pomodoro/PomodoroTimer';
import TodoList from './components/todo/TodoList';
import HabitTracker from './components/habits/HabitTracker';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'budget':
        return <BudgetManager />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'todo':
        return <TodoList />;
      case 'habits':
        return <HabitTracker />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  const viewTitles: Record<View, string> = {
    dashboard: 'Dashboard',
    budget: 'Budget Manager',
    pomodoro: 'Pomodoro Timer',
    todo: 'To-Do List',
    habits: 'Habit Tracker',
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title={viewTitles[activeView]} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
