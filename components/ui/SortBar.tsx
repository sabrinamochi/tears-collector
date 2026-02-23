'use client';

import { useTearStore } from '@/lib/store';
import { SortMode } from '@/lib/types';

const MODES: { id: SortMode; label: string }[] = [
  { id: 'scatter', label: 'scattered' },
  { id: 'mood',    label: 'by mood' },
  { id: 'date',    label: 'by date' },
];

export default function SortBar() {
  const { sort, setSort, introduced } = useTearStore();

  if (!introduced) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        border: '1px solid var(--line)',
      }}
    >
      {MODES.map(m => (
        <button
          key={m.id}
          type="button"
          onClick={() => setSort(m.id)}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            padding: '7px 14px',
            background: sort === m.id ? 'var(--ink)' : 'transparent',
            color: sort === m.id ? 'var(--bg)' : 'var(--ink)',
            border: 'none',
            borderRight: m.id !== 'date' ? '1px solid var(--line)' : 'none',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background 0.15s, color 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
