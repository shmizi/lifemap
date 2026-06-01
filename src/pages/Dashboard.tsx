// ─── Dashboard Page ───────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { GoalCard } from '../modules/goals/ui/GoalCard';
import { GoalCreationForm } from '../modules/goals/ui/GoalCreationForm';
import { TaskItem } from '../modules/tasks/ui/TaskItem';
import { AddTaskForm } from '../modules/tasks/ui/AddTaskForm';
import { Modal, Button, EmptyState, ProgressBar, Badge } from '../shared/components';
import { CATEGORY_COLORS, CATEGORY_LABELS, formatDate, daysUntil } from '../core/utils';
import { Plus, Target, ListTodo, TrendingUp, Zap } from 'lucide-react';

export function Dashboard() {
  const {
    goals, tasks, progress, selectedGoalId,
    loading, loadGoals, createGoal, deleteGoal, updateGoal,
    selectGoal, createTask, completeTask, reopenTask, deleteTask,
  } = useAppStore();

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => { loadGoals(); }, []);

  const selectedGoal = goals.find(g => g.id === selectedGoalId) ?? null;

  const activeGoals = goals.filter(g => g.status === 'active').length;
  const totalTasks = Object.values(progress).reduce((s, p) => s + p.total, 0);
  const doneTasks = Object.values(progress).reduce((s, p) => s + p.completed, 0);
  const overallPct = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-ink-900 flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-ink-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-ink-900" fill="currentColor" />
          </div>
          <span className="font-display text-2xl text-white tracking-wider">LIFEMAP</span>
          <span className="text-slate-600 text-xs font-mono ml-2">PHASE 1</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-5 text-sm">
            <div className="flex items-center gap-2">
              <Target size={14} className="text-lime-400" />
              <span className="text-slate-400"><span className="text-white font-medium">{activeGoals}</span> active goals</span>
            </div>
            <div className="flex items-center gap-2">
              <ListTodo size={14} className="text-lime-400" />
              <span className="text-slate-400"><span className="text-white font-medium">{doneTasks}/{totalTasks}</span> tasks done</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-lime-400" />
              <span className="text-white font-medium">{overallPct}%</span>
            </div>
          </div>
          <Button onClick={() => setShowGoalModal(true)}>
            <Plus size={16} /> New Goal
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 65px)' }}>

        {/* Goals Sidebar */}
        <aside className="w-80 flex-shrink-0 border-r border-ink-700 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-ink-700/50 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Goals</span>
            <span className="text-xs text-slate-600 font-mono">{goals.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {loading && goals.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-lime-400/30 border-t-lime-400 rounded-full animate-spin" />
              </div>
            ) : goals.length === 0 ? (
              <EmptyState
                icon={<Target size={36} />}
                title="No goals yet"
                subtitle="Create your first goal to get started"
              />
            ) : (
              goals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  progress={progress[goal.id]}
                  selected={selectedGoalId === goal.id}
                  onClick={() => {
                    setShowAddTask(false);
                    selectGoal(goal.id);
                  }}
                  onDelete={async (e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete "${goal.title}" and all its tasks?`)) {
                      await deleteGoal(goal.id);
                    }
                  }}
                  onStatusChange={async (status, e) => {
                    e.stopPropagation();
                    await updateGoal(goal.id, { status });
                  }}
                />
              ))
            )}
          </div>
        </aside>

        {/* Task Panel */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {selectedGoal ? (
            <>
              {/* Goal header */}
              <div
                className="px-6 py-5 border-b border-ink-700 flex-shrink-0"
                style={{ borderLeftColor: CATEGORY_COLORS[selectedGoal.category], borderLeftWidth: 3 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge color={CATEGORY_COLORS[selectedGoal.category]}>
                        {CATEGORY_LABELS[selectedGoal.category]}
                      </Badge>
                      <span className="text-xs text-slate-600 font-mono">P{selectedGoal.priority}</span>
                    </div>
                    <h1 className="font-display text-3xl text-white tracking-wide">{selectedGoal.title}</h1>
                    {selectedGoal.description && (
                      <p className="text-slate-500 text-sm mt-1">{selectedGoal.description}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xs mb-1 ${daysUntil(selectedGoal.targetDate) < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                      Target date
                    </div>
                    <div className="text-white font-medium text-sm">{formatDate(selectedGoal.targetDate)}</div>
                    {(() => {
                      const d = daysUntil(selectedGoal.targetDate);
                      if (d < 0) return <div className="text-xs text-red-400">{Math.abs(d)}d overdue</div>;
                      if (d === 0) return <div className="text-xs text-amber-400">Due today</div>;
                      return <div className="text-xs text-slate-600">{d}d remaining</div>;
                    })()}
                  </div>
                </div>

                {progress[selectedGoal.id] && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500">Progress</span>
                      <span className="text-white font-mono">
                        {progress[selectedGoal.id].completed}/{progress[selectedGoal.id].total} tasks · {progress[selectedGoal.id].percentage}%
                      </span>
                    </div>
                    <ProgressBar
                      value={progress[selectedGoal.id].percentage}
                      color={progress[selectedGoal.id].percentage === 100 ? '#10b981' : CATEGORY_COLORS[selectedGoal.category]}
                    />
                  </div>
                )}
              </div>

              {/* Tasks */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {!showAddTask && (
                  <button
                    onClick={() => setShowAddTask(true)}
                    className="w-full flex items-center gap-2 text-slate-600 hover:text-slate-400 text-sm py-2 px-4 rounded-xl border border-dashed border-ink-600 hover:border-ink-500 transition-colors mb-4"
                  >
                    <Plus size={14} /> Add a task…
                  </button>
                )}

                {showAddTask && (
                  <div className="mb-4">
                    <AddTaskForm
                      goalId={selectedGoal.id}
                      onSubmit={createTask}
                      onCancel={() => setShowAddTask(false)}
                    />
                  </div>
                )}

                {tasks.filter(t => t.status !== 'done').length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-2 flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-600 uppercase tracking-widest">To Do</span>
                      <span className="text-xs text-slate-700 font-mono">{tasks.filter(t => t.status !== 'done').length}</span>
                    </div>
                    <div className="flex flex-col divide-y divide-ink-700/50">
                      {tasks.filter(t => t.status !== 'done').map(task => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onComplete={completeTask}
                          onReopen={reopenTask}
                          onDelete={deleteTask}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {tasks.filter(t => t.status === 'done').length > 0 && (
                  <div className="mt-4">
                    <div className="px-4 py-2 flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-600 uppercase tracking-widest">Completed</span>
                      <span className="text-xs text-slate-700 font-mono">{tasks.filter(t => t.status === 'done').length}</span>
                    </div>
                    <div className="flex flex-col divide-y divide-ink-700/30">
                      {tasks.filter(t => t.status === 'done').map(task => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onComplete={completeTask}
                          onReopen={reopenTask}
                          onDelete={deleteTask}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {tasks.length === 0 && !showAddTask && (
                  <EmptyState
                    icon={<ListTodo size={36} />}
                    title="No tasks yet"
                    subtitle='Click "Add a task" to break this goal into steps'
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-slate-700 mb-4">
                  <Target size={56} strokeWidth={1} className="mx-auto" />
                </div>
                <p className="text-slate-500 font-medium">Select a goal to view its tasks</p>
                <p className="text-slate-700 text-sm mt-1">or create a new goal to get started</p>
                <Button onClick={() => setShowGoalModal(true)} className="mt-4">
                  <Plus size={16} /> New Goal
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create Goal Modal */}
      <Modal open={showGoalModal} onClose={() => setShowGoalModal(false)} title="NEW GOAL">
        <GoalCreationForm
          onSubmit={async (input) => {
            await createGoal(input);
            setShowGoalModal(false);
          }}
          onCancel={() => setShowGoalModal(false)}
        />
      </Modal>
    </div>
  );
}
