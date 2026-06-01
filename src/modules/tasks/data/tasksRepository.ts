// ─── Tasks Repository ─────────────────────────────────────────────────────────

import { getDB } from '../../../core/db';
import type { Task } from '../../../core/models';

export const tasksRepository = {
  async getAll(): Promise<Task[]> {
    const db = await getDB();
    return db.getAll('tasks');
  },

  async getById(id: string): Promise<Task | undefined> {
    const db = await getDB();
    return db.get('tasks', id);
  },

  async getByGoalId(goalId: string): Promise<Task[]> {
    const db = await getDB();
    return db.getAllFromIndex('tasks', 'by-goalId', goalId);
  },

  async create(task: Task): Promise<Task> {
    const db = await getDB();
    await db.put('tasks', task);
    return task;
  },

  async update(task: Task): Promise<Task> {
    const db = await getDB();
    await db.put('tasks', task);
    return task;
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('tasks', id);
  },
};
