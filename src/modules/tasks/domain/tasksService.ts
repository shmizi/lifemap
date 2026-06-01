// ─── Tasks Service ────────────────────────────────────────────────────────────

import { tasksRepository } from '../data/tasksRepository';
import { generateId, now } from '../../../core/utils';
import type { Task } from '../../../core/models';

export interface CreateTaskInput {
  goalId: string;
  title: string;
  dueDate?: string;
  estimatedMinutes?: number;
  notes?: string;
  tags?: string[];
  impactScore?: number;
}

export const tasksService = {
  async getByGoalId(goalId: string): Promise<Task[]> {
    const tasks = await tasksRepository.getByGoalId(goalId);
    // Sort: todo/in_progress first, then done, then by dueDate
    return tasks.sort((a, b) => {
      const statusOrder: Record<Task['status'], number> = {
        in_progress: 0,
        todo: 1,
        deferred: 2,
        done: 3,
        missed: 4,
      };
      const sDiff = statusOrder[a.status] - statusOrder[b.status];
      if (sDiff !== 0) return sDiff;
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });
  },

  async create(input: CreateTaskInput): Promise<Task> {
    const task: Task = {
      id: generateId(),
      goalId: input.goalId,
      title: input.title.trim(),
      dueDate: input.dueDate,
      status: 'todo',
      impactScore: input.impactScore ?? 0.5,
      estimatedMinutes: input.estimatedMinutes,
      notes: input.notes?.trim(),
      tags: input.tags ?? [],
      createdAt: now(),
      updatedAt: now(),
    };
    return tasksRepository.create(task);
  },

  async complete(id: string): Promise<Task> {
    const task = await tasksRepository.getById(id);
    if (!task) throw new Error(`Task ${id} not found`);
    const updated: Task = {
      ...task,
      status: 'done',
      completedAt: now(),
      updatedAt: now(),
    };
    return tasksRepository.update(updated);
  },

  async reopen(id: string): Promise<Task> {
    const task = await tasksRepository.getById(id);
    if (!task) throw new Error(`Task ${id} not found`);
    const updated: Task = {
      ...task,
      status: 'todo',
      completedAt: undefined,
      updatedAt: now(),
    };
    return tasksRepository.update(updated);
  },

  async update(id: string, partial: Partial<Omit<Task, 'id' | 'goalId' | 'createdAt'>>): Promise<Task> {
    const task = await tasksRepository.getById(id);
    if (!task) throw new Error(`Task ${id} not found`);
    const updated: Task = { ...task, ...partial, id, goalId: task.goalId, updatedAt: now() };
    return tasksRepository.update(updated);
  },

  async delete(id: string): Promise<void> {
    return tasksRepository.delete(id);
  },
};
