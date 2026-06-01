// ─── Utilities ────────────────────────────────────────────────────────────────
// Pure functions only. No React, no DB imports.

import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

export function now(): string {
  return new Date().toISOString();
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function daysUntil(iso: string): number {
  const target = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function isOverdue(iso?: string): boolean {
  if (!iso) return false;
  return daysUntil(iso) < 0;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export const CATEGORY_LABELS: Record<string, string> = {
  ACADEMIC: 'Academic',
  CAREER: 'Career',
  SKILL: 'Skill',
  HEALTH: 'Health',
  FINANCIAL: 'Financial',
  PERSONAL: 'Personal',
};

export const CATEGORY_COLORS: Record<string, string> = {
  ACADEMIC: '#6366f1',
  CAREER: '#f59e0b',
  SKILL: '#c8f135',
  HEALTH: '#10b981',
  FINANCIAL: '#3b82f6',
  PERSONAL: '#ec4899',
};
