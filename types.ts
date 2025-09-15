
export type View = 'dashboard' | 'budget' | 'pomodoro' | 'todo' | 'habits';

export enum ExpenseCategory {
  Food = 'Food',
  Books = 'Books',
  Travel = 'Travel',
  Misc = 'Misc',
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  createdAt: number;
}

export interface Habit {
  id: string;
  name: string;
  createdAt: number;
  completions: Record<string, boolean>; // YYYY-MM-DD -> boolean
}

export interface PomodoroSession {
    date: string; // YYYY-MM-DD
    count: number;
}
