// ─── App Store ────────────────────────────────────────────────────────────────
import { create } from 'zustand';
import type { Goal, Task, GoalProgress } from './core/models';
import { goalsService, type CreateGoalInput } from './modules/goals';
import { tasksService, type CreateTaskInput } from './modules/tasks';

interface AppState {
  goals: Goal[];
  tasks: Task[];
  progress: Record<string, GoalProgress>;
  selectedGoalId: string | null;
  loading: boolean;
  error: string | null;

  loadGoals: () => Promise<void>;
  createGoal: (input: CreateGoalInput) => Promise<void>;
  updateGoal: (id: string, partial: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  selectGoal: (goalId: string | null) => Promise<void>;
  loadTasksForGoal: (goalId: string) => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  reopenTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  refreshProgress: (goalIds?: string[]) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  goals: [],
  tasks: [],
  progress: {},
  selectedGoalId: null,
  loading: false,
  error: null,

  loadGoals: async () => {
    set({ loading: true, error: null });
    try {
      const goals = await goalsService.getAll();
      set({ goals, loading: false });
      await get().refreshProgress(goals.map(g => g.id));
    } catch (e) {
      set({ error: String(e), loading: false });
    }
  },

  createGoal: async (input) => {
    await goalsService.create(input);
    await get().loadGoals();
  },

  updateGoal: async (id, partial) => {
    await goalsService.update(id, partial);
    await get().loadGoals();
    if (get().selectedGoalId === id) {
      await get().loadTasksForGoal(id);
    }
  },

  deleteGoal: async (id) => {
    await goalsService.delete(id);
    if (get().selectedGoalId === id) {
      set({ selectedGoalId: null, tasks: [] });
    }
    await get().loadGoals();
  },

  selectGoal: async (goalId) => {
    set({ selectedGoalId: goalId });
    if (goalId) {
      await get().loadTasksForGoal(goalId);
    } else {
      set({ tasks: [] });
    }
  },

  loadTasksForGoal: async (goalId) => {
    const tasks = await tasksService.getByGoalId(goalId);
    set({ tasks });
  },

  createTask: async (input) => {
    await tasksService.create(input);
    await get().loadTasksForGoal(input.goalId);
    await get().refreshProgress([input.goalId]);
  },

  completeTask: async (id) => {
    const task = get().tasks.find(t => t.id === id);
    await tasksService.complete(id);
    if (task) {
      await get().loadTasksForGoal(task.goalId);
      await get().refreshProgress([task.goalId]);
    }
  },

  reopenTask: async (id) => {
    const task = get().tasks.find(t => t.id === id);
    await tasksService.reopen(id);
    if (task) {
      await get().loadTasksForGoal(task.goalId);
      await get().refreshProgress([task.goalId]);
    }
  },

  deleteTask: async (id) => {
    const task = get().tasks.find(t => t.id === id);
    await tasksService.delete(id);
    if (task) {
      await get().loadTasksForGoal(task.goalId);
      await get().refreshProgress([task.goalId]);
    }
  },

  refreshProgress: async (goalIds) => {
    const ids = goalIds ?? get().goals.map(g => g.id);
    const entries = await Promise.all(
      ids.map(id => goalsService.getProgress(id).then(p => [id, p] as [string, GoalProgress]))
    );
    const newProgress = Object.fromEntries(entries);
    set(state => ({ progress: { ...state.progress, ...newProgress } }));
  },
}));
