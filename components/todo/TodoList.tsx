
import React, { useState, useMemo } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { Task } from '../../types';

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'completion'>('date');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      dueDate: newDueDate || undefined,
      isCompleted: false,
      createdAt: Date.now(),
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewDueDate('');
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (sortBy === 'completion') {
        return (a.isCompleted ? 1 : 0) - (b.isCompleted ? 1 : 0);
      }
      // Sort by date (due date first, then creation date)
      if (a.isCompleted && !b.isCompleted) return 1;
      if (!a.isCompleted && b.isCompleted) return -1;

      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      
      if(dateA !== dateB) return dateA - dateB;
      return b.createdAt - a.createdAt; // Newer tasks first if dates are same
    });
  }, [tasks, sortBy]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add a New Task</h2>
        <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="e.g., Finish React project"
            className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
          />
          <button type="submit" className="bg-cyan-600 text-white font-bold py-3 px-6 rounded-md hover:bg-cyan-700 transition-colors">
            Add
          </button>
        </form>
      </div>

      <div className="mt-8 bg-slate-800 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Tasks</h2>
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Sort by:</span>
                <select value={sortBy} onChange={e => setSortBy(e.target.value as 'date' | 'completion')} className="p-1 bg-slate-700 border border-slate-600 rounded-md text-sm">
                    <option value="date">Date</option>
                    <option value="completion">Completion</option>
                </select>
            </div>
        </div>
        
        <ul className="space-y-3">
          {sortedTasks.map(task => (
            <li
              key={task.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                task.isCompleted ? 'bg-slate-700/50' : 'bg-slate-700'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => toggleTaskCompletion(task.id)}
                  className="h-6 w-6 rounded-full border-slate-500 text-cyan-600 bg-slate-800 focus:ring-cyan-500 cursor-pointer"
                />
                <div className="ml-4">
                  <p className={`font-medium ${task.isCompleted ? 'line-through text-slate-500' : ''}`}>{task.title}</p>
                  {task.dueDate && <p className={`text-sm ${task.isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>{new Date(task.dueDate+'T00:00:00').toLocaleDateString()}</p>}
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="text-slate-500 hover:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
          {tasks.length === 0 && <p className="text-center text-slate-400 py-8">You're all caught up!</p>}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
