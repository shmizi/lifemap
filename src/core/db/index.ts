// ─── Database Abstraction ─────────────────────────────────────────────────────
// All DB access goes through this module. If you ever swap IndexedDB for
// something else (wa-sqlite, Supabase, etc.), only this file changes.

import { openDB, type IDBPDatabase } from 'idb';
import type { Goal, Task } from '../models';

const DB_NAME = 'lifemap-db';
const DB_VERSION = 1;

export type LifeMapDB = IDBPDatabase<{
  goals: {
    key: string;
    value: Goal;
    indexes: { 'by-status': string; 'by-category': string };
  };
  tasks: {
    key: string;
    value: Task;
    indexes: { 'by-goalId': string; 'by-status': string };
  };
}>;

let _db: LifeMapDB | null = null;

export async function getDB(): Promise<LifeMapDB> {
  if (_db) return _db;

  _db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Goals store
      if (!db.objectStoreNames.contains('goals')) {
        const goalStore = db.createObjectStore('goals', { keyPath: 'id' });
        goalStore.createIndex('by-status', 'status');
        goalStore.createIndex('by-category', 'category');
      }

      // Tasks store
      if (!db.objectStoreNames.contains('tasks')) {
        const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
        taskStore.createIndex('by-goalId', 'goalId');
        taskStore.createIndex('by-status', 'status');
      }
    },
  });

  return _db;
}
