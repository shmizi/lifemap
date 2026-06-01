// ─── Shared UI Components ────────────────────────────────────────────────────
// Reusable, stateless building blocks. No domain logic.

import React from 'react';

// ── Button ────────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 font-body font-medium rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-lime-400 text-ink-900 hover:bg-lime-500 active:scale-95',
    ghost: 'bg-ink-700 text-slate-300 hover:bg-ink-600 hover:text-white border border-ink-600',
    danger: 'bg-red-900/40 text-red-400 hover:bg-red-800/60 border border-red-800/60',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-xs font-medium text-slate-400 uppercase tracking-widest">{label}</label>}
      <input
        id={id}
        className={`bg-ink-700 border border-ink-600 text-white rounded-lg px-3 py-2 text-sm placeholder:text-slate-600 focus:outline-none focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 transition-colors ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className = '', id, children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-xs font-medium text-slate-400 uppercase tracking-widest">{label}</label>}
      <select
        id={id}
        className={`bg-ink-700 border border-ink-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = '', id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-xs font-medium text-slate-400 uppercase tracking-widest">{label}</label>}
      <textarea
        id={id}
        className={`bg-ink-700 border border-ink-600 text-white rounded-lg px-3 py-2 text-sm placeholder:text-slate-600 focus:outline-none focus:border-lime-400/60 focus:ring-1 focus:ring-lime-400/20 transition-colors resize-none ${className}`}
        {...props}
      />
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-ink-800 border border-ink-600 rounded-2xl w-full max-w-md p-6 animate-slide-up shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl text-white tracking-wide">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
interface BadgeProps {
  color?: string;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ color = '#6b7280', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${className}`}
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {children}
    </span>
  );
}

// ── ProgressBar ───────────────────────────────────────────────────────────────
interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  className?: string;
}

export function ProgressBar({ value, color = '#c8f135', className = '' }: ProgressBarProps) {
  return (
    <div className={`h-1.5 bg-ink-600 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="text-slate-700 mb-2">{icon}</div>
      <p className="text-slate-400 font-medium">{title}</p>
      {subtitle && <p className="text-slate-600 text-sm max-w-xs">{subtitle}</p>}
    </div>
  );
}
