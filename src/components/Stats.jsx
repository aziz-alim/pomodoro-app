import { useState } from 'react';

export default function Stats({ stats }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="stats">
      <button className="btn-icon" onClick={() => setOpen(!open)} aria-label="Statistics">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      </button>

      {open && (
        <div className="stats-panel">
          <p>Today: <b>{stats.today}</b> pomodoros</p>
          <p>Total work: <b>{stats.totalWork}</b> min</p>
          <p>All time: <b>{stats.allTime}</b> pomodoros</p>
          <p>Streak: <b>{stats.streak}</b> days</p>
        </div>
      )}
    </div>
  );
}
