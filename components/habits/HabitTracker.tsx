
import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { Habit } from '../../types';
import HabitGrid from './HabitGrid';
import { getTodayDateString } from '../../utils/dateUtils';

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
  const today = getTodayDateString();

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName,
      createdAt: Date.now(),
      completions: {},
    };
    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };
  
  const deleteHabit = (id: string) => {
      setHabits(habits.filter(h => h.id !== id));
      if (selectedHabit?.id === id) {
          setSelectedHabit(null);
      }
  }

  const toggleHabitCompletion = (id: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newCompletions = { ...habit.completions };
        if (newCompletions[date]) {
          delete newCompletions[date];
        } else {
          newCompletions[date] = true;
        }
        const updatedHabit = { ...habit, completions: newCompletions };
        if (selectedHabit?.id === id) {
            setSelectedHabit(updatedHabit);
        }
        return updatedHabit;
      }
      return habit;
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-8">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">Add a New Habit</h2>
                <form onSubmit={addHabit} className="flex gap-2">
                    <input
                        type="text"
                        value={newHabitName}
                        onChange={e => setNewHabitName(e.target.value)}
                        placeholder="e.g., Read 10 pages"
                        className="flex-grow p-2 bg-slate-700 border border-slate-600 rounded-md"
                    />
                    <button type="submit" className="bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-700">Add</button>
                </form>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">Today's Habits</h2>
                <ul className="space-y-3">
                    {habits.map(habit => (
                        <li key={habit.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-md">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={!!habit.completions[today]}
                                    onChange={() => toggleHabitCompletion(habit.id, today)}
                                    className="h-5 w-5 rounded border-slate-500 text-cyan-600 bg-slate-800 focus:ring-cyan-500"
                                />
                                <span className="ml-3 font-medium">{habit.name}</span>
                            </label>
                            <div className="flex gap-2">
                                <button onClick={() => setSelectedHabit(habit)} className="text-slate-400 hover:text-cyan-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                </button>
                                <button onClick={() => deleteHabit(habit.id)} className="text-slate-400 hover:text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </li>
                    ))}
                    {habits.length === 0 && <p className="text-center text-slate-400 py-4">Add a habit to get started.</p>}
                </ul>
            </div>
        </div>

        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl shadow-lg">
            {selectedHabit ? (
                <HabitGrid habit={selectedHabit} />
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <h3 className="text-2xl font-bold">Select a habit</h3>
                    <p className="text-slate-400 mt-2">Click the chart icon on a habit to see its progress grid and streak.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default HabitTracker;
