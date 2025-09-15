import React, { useState, useEffect, useRef, useCallback } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { PomodoroSession } from '../../types';
import { getTodayDateString } from '../../utils/dateUtils';

const TimerCircle: React.FC<{ progress: number }> = ({ progress }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg className="w-52 h-52">
            <circle
                className="text-slate-700"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="104"
                cy="104"
            />
            <circle
                className="text-cyan-500"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="104"
                cy="104"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
        </svg>
    );
};

const PomodoroTimer: React.FC = () => {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [time, setTime] = useState(focusMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  
  const [history, setHistory] = useLocalStorage<PomodoroSession[]>('pomodoroHistory', []);
  const today = getTodayDateString();
  const todaysSessions = history.find(s => s.date === today)?.count || 0;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const updateTodaysCount = useCallback(() => {
     setHistory(prevHistory => {
        const todayEntry = prevHistory.find(entry => entry.date === today);
        if (todayEntry) {
            return prevHistory.map(entry => 
                entry.date === today ? { ...entry, count: entry.count + 1 } : entry
            );
        } else {
            return [...prevHistory, { date: today, count: 1 }];
        }
     });
  }, [setHistory, today]);


  useEffect(() => {
    // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
    // In a browser environment, setInterval returns a number, not a Timeout object.
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      if (audioRef.current) {
          audioRef.current.play();
      }
      if(mode === 'focus') {
        updateTodaysCount();
        setMode('break');
        setTime(breakMinutes * 60);
      } else {
        setMode('focus');
        setTime(focusMinutes * 60);
      }
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, mode, breakMinutes, focusMinutes, updateTodaysCount]);

  useEffect(() => {
      setTime(mode === 'focus' ? focusMinutes * 60 : breakMinutes * 60);
  }, [focusMinutes, breakMinutes, mode]);


  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMode('focus');
    setTime(focusMinutes * 60);
  };
  
  const totalDuration = mode === 'focus' ? focusMinutes * 60 : breakMinutes * 60;
  const progress = (time / totalDuration) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl text-center w-full max-w-md">
        <div className="relative flex items-center justify-center mb-8">
            <TimerCircle progress={progress} />
            <div className="absolute">
                <p className="text-5xl font-bold tracking-tighter">{formatTime(time)}</p>
                <p className="text-slate-400 uppercase tracking-widest text-sm mt-1">{mode}</p>
            </div>
        </div>
        
        <div className="flex justify-center space-x-4 mb-8">
          <button onClick={toggleTimer} className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-cyan-600 hover:bg-cyan-700'} text-white`}>
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button onClick={resetTimer} className="px-8 py-3 rounded-lg font-semibold text-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
            Reset
          </button>
        </div>
        
        <div className="flex justify-around items-center border-t border-slate-700 pt-6">
            <div className="text-center">
                <label className="block text-sm text-slate-400 mb-1">Focus</label>
                <input type="number" value={focusMinutes} onChange={e => setFocusMinutes(parseInt(e.target.value, 10))} className="w-20 p-2 text-center bg-slate-700 rounded-md" />
            </div>
            <div className="text-center">
                <label className="block text-sm text-slate-400 mb-1">Break</label>
                <input type="number" value={breakMinutes} onChange={e => setBreakMinutes(parseInt(e.target.value, 10))} className="w-20 p-2 text-center bg-slate-700 rounded-md" />
            </div>
        </div>

        <div className="mt-8 text-lg">
          <p>You completed <span className="font-bold text-cyan-400">{todaysSessions}</span> sessions today.</p>
        </div>
      </div>
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3" preload="auto"></audio>
    </div>
  );
};

export default PomodoroTimer;