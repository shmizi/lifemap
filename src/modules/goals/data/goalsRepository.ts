// ─── Goals Repository ─────────────────────────────────────────────────────────
// DB queries ONLY. No business logic here.

import { getDB } from '../../../core/db';
import type { Goal } from '../../../core/models';

export const goalsRepository = {
  async getAll(): Promise<Goal[]> {
    const db = await getDB();
    return db.getAll('goals');
  },

  async getById(id: string): Promise<Goal | undefined> {
    const db = await getDB();
    return db.get('goals', id);
  },

  async getByStatus(status: Goal['status']): Promise<Goal[]> {
    const db = await getDB();
    return db.getAllFromIndex('goals', 'by-status', status);
  },

  async create(goal: Goal): Promise<Goal> {
    const db = await getDB();
    await db.put('goals', goal);
    return goal;
  },

  async update(goal: Goal): Promise<Goal> {
    const db = await getDB();
    await db.put('goals', goal);
    return goal;
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('goals', id);
  },
};
