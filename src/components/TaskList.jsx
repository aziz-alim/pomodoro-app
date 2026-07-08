import { useState } from 'react';

export default function TaskList({ tasks, onAdd, onToggle, onDelete }) {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div className="task-list">
      <button className="btn-icon" onClick={() => setOpen(!open)} aria-label="Tasks">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      </button>

      {open && (
        <div className="task-panel">
          <form onSubmit={handleSubmit} className="task-form">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a task..."
              maxLength={100}
            />
            <button type="submit">+</button>
          </form>
          <ul className="task-items">
            {tasks.map((task, i) => (
              <li key={i} className={task.done ? 'done' : ''}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => onToggle(i)}
                  />
                  <span>{task.text}</span>
                </label>
                <button className="btn-delete" onClick={() => onDelete(i)} aria-label="Delete">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </li>
            ))}
            {tasks.length === 0 && <li className="empty">No tasks yet</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
