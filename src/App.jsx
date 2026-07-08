import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useKeybindings } from './hooks/useKeybindings';
import { useNotification } from './hooks/useNotification';
import Settings from './components/Settings';
import ProgressRing from './components/ProgressRing';
import SoundControl from './components/SoundControl';
import Stats from './components/Stats';
import TaskList from './components/TaskList';

const DEFAULT_CONFIG = { WORK: 25, SHORT_BREAK: 5, LONG_BREAK: 15 };

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  const [config, setConfig] = useLocalStorage('pomodoro_config', DEFAULT_CONFIG);
  const [mode, setMode] = useState('WORK');
  const [timeLeft, setTimeLeft] = useState(config.WORK * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const [soundEnabled, setSoundEnabled] = useLocalStorage('pomodoro_sound', true);
  const [volume, setVolume] = useLocalStorage('pomodoro_volume', 1);
  const [tasks, setTasks] = useLocalStorage('pomodoro_tasks', []);
  const [stats, setStats] = useLocalStorage('pomodoro_stats', {
    today: getToday(),
    dailyCount: 0,
    totalWork: 0,
    allTime: 0,
    streak: 0,
    lastDate: null,
  });

  const timerRef = useRef(null);
  const audioRef = useRef(new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg'));
  const { notify } = useNotification();

  const totalTime = config[mode] * 60;
  const progress = totalTime > 0 ? timeLeft / totalTime : 1;

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const resetTimer = useCallback(() => {
    setTimeLeft(config[mode] * 60);
    setIsRunning(false);
  }, [config, mode]);

  const updateStats = useCallback(() => {
    setStats((prev) => {
      const newStats = { ...prev };
      const today = getToday();

      if (prev.today === today) {
        newStats.dailyCount = prev.dailyCount + 1;
      } else {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        newStats.today = today;
        newStats.dailyCount = 1;
        newStats.streak = prev.lastDate === yesterday ? (prev.streak || 0) + 1 : 1;
      }

      newStats.lastDate = today;
      newStats.totalWork = (prev.totalWork || 0) + config.WORK;
      newStats.allTime = (prev.allTime || 0) + 1;
      return newStats;
    });
  }, [config.WORK, setStats]);

  const handleSessionEnd = useCallback(() => {
    if (soundEnabled) {
      audioRef.current.play().catch(() => {});
    }

    const modeLabels = { WORK: 'Work session', SHORT_BREAK: 'Short break', LONG_BREAK: 'Long break' };
    notify(modeLabels[mode] + ' completed!', mode === 'WORK' ? 'Time for a break!' : 'Time to focus!');

    if (mode === 'WORK') {
      updateStats();
      const nextCount = completedSessions + 1;
      setCompletedSessions(nextCount);
      setMode(nextCount % 4 === 0 ? 'LONG_BREAK' : 'SHORT_BREAK');
    } else {
      setMode('WORK');
    }
  }, [mode, soundEnabled, completedSessions, notify, updateStats]);

  const handleSessionEndRef = useRef(handleSessionEnd);
  handleSessionEndRef.current = handleSessionEnd;

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSessionEndRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  useEffect(() => {
    setTimeLeft(config[mode] * 60);
    setIsRunning(false);
  }, [mode, config]);

  const toggleRunning = useCallback(() => {
    setIsRunning((r) => !r);
  }, []);

  useKeybindings({
    ' ': toggleRunning,
    r: resetTimer,
    '1': () => setMode('WORK'),
    '2': () => setMode('SHORT_BREAK'),
    '3': () => setMode('LONG_BREAK'),
  });

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const displayStats = {
    today: stats.dailyCount || 0,
    totalWork: stats.totalWork || 0,
    allTime: stats.allTime || 0,
    streak: stats.streak || 0,
  };

  return (
    <div className={`app-container ${mode.toLowerCase()}`}>
      <div className="card">
        <div className="mode-tabs">
          <button className={mode === 'WORK' ? 'active' : ''} onClick={() => setMode('WORK')}>Work</button>
          <button className={mode === 'SHORT_BREAK' ? 'active' : ''} onClick={() => setMode('SHORT_BREAK')}>Short Break</button>
          <button className={mode === 'LONG_BREAK' ? 'active' : ''} onClick={() => setMode('LONG_BREAK')}>Long Break</button>
        </div>

        <div className="timer-wrapper">
          <ProgressRing timeLeft={timeLeft} totalTime={totalTime} />
          <h1 className="timer-display" aria-live="polite">{formatTime(timeLeft)}</h1>
        </div>

        <div className="controls">
          <button className="btn-main" onClick={toggleRunning}>
            {isRunning ? 'PAUSE' : 'START'}
          </button>
          {progress < 1 && (
            <button className="btn-reset" onClick={resetTimer}>RESET</button>
          )}
        </div>

        <div className="toolbar">
          <Settings config={config} onConfigChange={setConfig} />
          <SoundControl
            soundEnabled={soundEnabled}
            volume={volume}
            onToggle={() => setSoundEnabled((s) => !s)}
            onVolumeChange={setVolume}
          />
          <Stats stats={displayStats} />
          <TaskList
            tasks={tasks}
            onAdd={(text) => setTasks((prev) => [...prev, { text, done: false }])}
            onToggle={(i) => setTasks((prev) => prev.map((t, j) => j === i ? { ...t, done: !t.done } : t))}
            onDelete={(i) => setTasks((prev) => prev.filter((_, j) => j !== i))}
          />
        </div>

        <p className="session-counter">Completed Sessions: <b>{completedSessions}</b></p>
      </div>
    </div>
  );
}

export default App;
