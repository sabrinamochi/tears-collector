'use client';

import { Mood } from '@/lib/types';
import { TEAR_BASE_PATH } from '@/lib/tearShape';

interface MoodPickerProps {
  value: Mood;
  onChange: (m: Mood) => void;
}

const MOODS: { id: Mood; label: string; color: string; stroke: string }[] = [
  { id: 'sad',   label: 'sad',   color: '#7aadca', stroke: '#3a7096' },
  { id: 'happy', label: 'happy', color: '#d4a843', stroke: '#a07020' },
  { id: 'yawn',  label: 'yawn',  color: '#a09a93', stroke: '#6a6460' },
];

export default function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
      {MOODS.map(m => {
        const active = value === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '12px 16px',
              background: active ? 'var(--ink)' : 'transparent',
              border: `1px solid ${active ? 'var(--ink)' : 'var(--line)'}`,
              cursor: 'pointer',
              outline: 'none',
              transition: 'background 0.15s, border-color 0.15s',
            }}
          >
            <svg viewBox="0 0 40 55" width={32} height={44}>
              <path
                d={TEAR_BASE_PATH}
                fill={m.color}
                fillOpacity={active ? 0.9 : 0.65}
                stroke={m.stroke}
                strokeWidth={0.8}
              />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: active ? 'var(--bg)' : 'var(--ink)',
              }}
            >
              {m.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
