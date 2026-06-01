// ─── Add Task Form ────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Button, Input } from '../../../shared/components';
import type { CreateTaskInput } from '../domain/tasksService';

interface Props {
  goalId: string;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
  onCancel: () => void;
}

export function AddTaskForm({ goalId, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError('Task title is required'); return; }
    setSaving(true);
    try {
      await onSubmit({
        goalId,
        title,
        dueDate: dueDate || undefined,
        estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : undefined,
      });
      setTitle('');
      setDueDate('');
      setEstimatedMinutes('');
      onCancel();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-ink-700 border border-ink-600 rounded-xl p-4 animate-slide-up">
      <div className="flex flex-col gap-3">
        <Input
          id="task-title"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => { setTitle(e.target.value); setError(''); }}
          error={error}
          autoFocus
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            id="task-due"
            label="Due date"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
          <Input
            id="task-est"
            label="Est. minutes"
            type="number"
            placeholder="30"
            min="1"
            value={estimatedMinutes}
            onChange={e => setEstimatedMinutes(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving} size="sm" className="flex-1">
            {saving ? 'Adding…' : 'Add Task'}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </form>
  );
}
