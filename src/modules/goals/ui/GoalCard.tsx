// ─── Goal Card ────────────────────────────────────────────────────────────────
import { Badge, ProgressBar } from '../../../shared/components';
import { CATEGORY_COLORS, CATEGORY_LABELS, daysUntil, formatDate } from '../../../core/utils';
import type { Goal, GoalProgress } from '../../../core/models';
import { CheckCircle2, Clock, Trash2 } from 'lucide-react';

interface Props {
  goal: Goal;
  progress?: GoalProgress;
  selected?: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onStatusChange: (status: Goal['status'], e: React.MouseEvent) => void;
}

const STATUS_LABELS: Record<Goal['status'], string> = {
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  failed: 'Failed',
};

export function GoalCard({ goal, progress, selected, onClick, onDelete, onStatusChange }: Props) {
  const days = daysUntil(goal.targetDate);
  const pct = progress?.percentage ?? 0;
  const color = CATEGORY_COLORS[goal.category];
  const isCompleted = goal.status === 'completed';

  return (
    <div
      onClick={onClick}
      className={`
        relative group rounded-xl border p-4 cursor-pointer transition-all duration-200 goal-card-hover
        ${selected
          ? 'border-lime-400/50 bg-ink-700 shadow-lg shadow-lime-400/5'
          : 'border-ink-600 bg-ink-800 hover:border-ink-500'
        }
      `}
    >
      {/* Priority indicator */}
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
        style={{ backgroundColor: color, opacity: 0.6 }}
      />

      <div className="pl-2">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-sm leading-snug truncate ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
              {goal.title}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge color={color}>{CATEGORY_LABELS[goal.category]}</Badge>
              {goal.status !== 'active' && (
                <Badge color={goal.status === 'completed' ? '#10b981' : goal.status === 'paused' ? '#f59e0b' : '#ef4444'}>
                  {STATUS_LABELS[goal.status]}
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
            <button
              onClick={e => onStatusChange(isCompleted ? 'active' : 'completed', e)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-lime-400 hover:bg-lime-400/10 transition-colors"
              title={isCompleted ? 'Reopen' : 'Mark complete'}
            >
              <CheckCircle2 size={15} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Delete goal"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Progress */}
        {progress && progress.total > 0 && (
          <div className="mb-2">
            <ProgressBar value={pct} color={pct === 100 ? '#10b981' : color} />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-600">{progress.completed}/{progress.total} tasks</span>
              <span className="text-xs font-mono text-slate-500">{pct}%</span>
            </div>
          </div>
        )}

        {/* Deadline */}
        <div className={`flex items-center gap-1.5 text-xs ${
          days < 0 ? 'text-red-400' : days <= 14 ? 'text-amber-400' : 'text-slate-500'
        }`}>
          <Clock size={11} />
          <span>
            {days < 0
              ? `${Math.abs(days)}d overdue`
              : days === 0
              ? 'Due today'
              : days === 1
              ? 'Due tomorrow'
              : `${formatDate(goal.targetDate)}`}
          </span>
        </div>
      </div>
    </div>
  );
}
