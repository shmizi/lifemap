// ─── Task Item ────────────────────────────────────────────────────────────────
import { formatDateShort, isOverdue } from '../../../core/utils';
import type { Task } from '../../../core/models';
import { Clock, Trash2, RotateCcw } from 'lucide-react';

interface Props {
  task: Task;
  onComplete: (id: string) => void;
  onReopen: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onComplete, onReopen, onDelete }: Props) {
  const isDone = task.status === 'done';
  const overdue = !isDone && isOverdue(task.dueDate);

  return (
    <div className={`group flex items-start gap-3 py-3 px-4 rounded-xl transition-all duration-150 ${
      isDone ? 'opacity-50' : 'hover:bg-ink-700/50'
    }`}>
      {/* Checkbox */}
      <button
        onClick={() => isDone ? onReopen(task.id) : onComplete(task.id)}
        className={`
          mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
          ${isDone
            ? 'bg-lime-400 border-lime-400'
            : 'border-ink-500 hover:border-lime-400/60'
          }
        `}
        title={isDone ? 'Mark as todo' : 'Complete task'}
      >
        {isDone && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="#0a0a0f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4l3 3 5-6" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${isDone ? 'line-through text-slate-600' : 'text-slate-200'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-3 mt-1">
          {task.dueDate && (
            <span className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-400' : 'text-slate-600'}`}>
              <Clock size={10} />
              {overdue ? `Overdue · ${formatDateShort(task.dueDate)}` : formatDateShort(task.dueDate)}
            </span>
          )}
          {task.estimatedMinutes && (
            <span className="text-xs text-slate-700">{task.estimatedMinutes}m</span>
          )}
          {isDone && task.completedAt && (
            <span className="text-xs text-slate-700">Done {formatDateShort(task.completedAt)}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {isDone && (
          <button
            onClick={() => onReopen(task.id)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-ink-600 transition-colors"
            title="Reopen task"
          >
            <RotateCcw size={13} />
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          title="Delete task"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
