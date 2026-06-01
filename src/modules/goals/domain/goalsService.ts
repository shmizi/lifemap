// ─── Goals Service ────────────────────────────────────────────────────────────
// Business logic for goals. Calls the repository. Never imports React.

import { goalsRepository } from '../data/goalsRepository';
import { tasksRepository } from '../../tasks/data/tasksRepository';
import { generateId, now } from '../../../core/utils';
import type { Goal, GoalCategory, GoalProgress } from '../../../core/models';

export interface CreateGoalInput {
  title: string;
  category: GoalCategory;
  targetDate: string;
  priority: 1 | 2 | 3 | 4 | 5;
  description?: string;
}

export const goalsService = {
  async getAll(): Promise<Goal[]> {
    const goals = await goalsRepository.getAll();
    // Sort: active first, then by priority desc, then by targetDate asc
    return goals.sort((a, b) => {
      if (a.status !== b.status) {
        const order = ['active', 'paused', 'completed', 'failed'];
        return order.indexOf(a.status) - order.indexOf(b.status);
      }
      if (b.priority !== a.priority) return b.priority - a.priority;
      return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
    });
  },

  async getById(id: string): Promise<Goal | undefined> {
    return goalsRepository.getById(id);
  },

  async create(input: CreateGoalInput): Promise<Goal> {
    const goal: Goal = {
      id: generateId(),
      title: input.title.trim(),
      category: input.category,
      targetDate: input.targetDate,
      priority: input.priority,
      status: 'active',
      description: input.description?.trim(),
      createdAt: now(),
      updatedAt: now(),
    };
    return goalsRepository.create(goal);
  },

  async update(id: string, partial: Partial<Omit<Goal, 'id' | 'createdAt'>>): Promise<Goal> {
    const existing = await goalsRepository.getById(id);
    if (!existing) throw new Error(`Goal ${id} not found`);
    const updated: Goal = { ...existing, ...partial, id, updatedAt: now() };
    return goalsRepository.update(updated);
  },

  async updateStatus(id: string, status: Goal['status']): Promise<Goal> {
    return goalsService.update(id, { status });
  },

  async delete(id: string): Promise<void> {
    // Also delete all tasks belonging to this goal
    const tasks = await tasksRepository.getByGoalId(id);
    await Promise.all(tasks.map(t => tasksRepository.delete(t.id)));
    await goalsRepository.delete(id);
  },

  async getProgress(goalId: string): Promise<GoalProgress> {
    const tasks = await tasksRepository.getByGoalId(goalId);
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    return {
      goalId,
      total,
      completed,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  },
};
