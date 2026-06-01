// ─── Core Domain Models ───────────────────────────────────────────────────────
// These are the canonical type definitions for the entire app.
// Import from here everywhere — never define types inline.

export type GoalCategory =
  | 'ACADEMIC'
  | 'CAREER'
  | 'SKILL'
  | 'HEALTH'
  | 'FINANCIAL'
  | 'PERSONAL';

export type GoalStatus = 'active' | 'completed' | 'paused' | 'failed';

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'missed' | 'deferred';

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  targetDate: string; // ISO date string
  priority: 1 | 2 | 3 | 4 | 5;
  status: GoalStatus;
  description?: string;
  createdAt: string; // ISO date string
  updatedAt: string;
}

export interface Task {
  id: string;
  goalId: string;
  title: string;
  dueDate?: string;
  completedAt?: string;
  status: TaskStatus;
  impactScore: number; // 0.0–1.0
  estimatedMinutes?: number;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Progress / Stats ─────────────────────────────────────────────────────────

export interface GoalProgress {
  goalId: string;
  total: number;
  completed: number;
  percentage: number; // 0–100
}
