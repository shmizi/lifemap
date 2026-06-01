// ─── Goal Creation Form ───────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Button, Input, Select, Textarea } from '../../../shared/components';
import type { GoalCategory } from '../../../core/models';
import type { CreateGoalInput } from '../domain/goalsService';

interface Props {
  onSubmit: (input: CreateGoalInput) => Promise<void>;
  onCancel: () => void;
}

const CATEGORIES: { value: GoalCategory; label: string }[] = [
  { value: 'ACADEMIC', label: '🎓 Academic' },
  { value: 'CAREER', label: '💼 Career' },
  { value: 'SKILL', label: '⚡ Skill' },
  { value: 'HEALTH', label: '🌿 Health' },
  { value: 'FINANCIAL', label: '💰 Financial' },
  { value: 'PERSONAL', label: '🌟 Personal' },
];

export function GoalCreationForm({ onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GoalCategory>('SKILL');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!targetDate) e.targetDate = 'Target date is required';
    else if (new Date(targetDate) <= new Date()) e.targetDate = 'Target date must be in the future';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit({ title, category, targetDate, priority, description: description || undefined });
    } finally {
      setSaving(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="goal-title"
        label="Goal Title"
        placeholder="e.g. Get into RWTH Masters CS"
        value={title}
        onChange={e => setTitle(e.target.value)}
        error={errors.title}
        autoFocus
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          id="goal-category"
          label="Category"
          value={category}
          onChange={e => setCategory(e.target.value as GoalCategory)}
        >
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </Select>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Priority</label>
          <div className="flex gap-1 mt-0.5">
            {([1, 2, 3, 4, 5] as const).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  priority === p
                    ? 'bg-lime-400 text-ink-900'
                    : 'bg-ink-700 text-slate-500 hover:text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Input
        id="goal-date"
        label="Target Date"
        type="date"
        min={today}
        value={targetDate}
        onChange={e => setTargetDate(e.target.value)}
        error={errors.targetDate}
      />

      <Textarea
        id="goal-desc"
        label="Description (optional)"
        placeholder="What does success look like?"
        rows={3}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <div className="flex gap-2 pt-1">
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? 'Creating…' : 'Create Goal'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
