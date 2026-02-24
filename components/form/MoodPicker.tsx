'use client';

import { Mood } from '@/lib/types';
import { TEAR_BASE_PATH, INNER_PATHS } from '@/lib/tearShape';

interface MoodPickerProps {
  value: Mood;
  onChange: (m: Mood) => void;
}

const MOODS: { id: Mood; label: string; fill: string; deep: string }[] = [
  { id: 'sad',     label: 'sad',     fill: '#7399d0', deep: '#4b75b0' },
  { id: 'touched', label: 'touched', fill: '#C8A36A', deep: '#9e7a3e' },
  { id: 'unsure',  label: 'unsure',  fill: '#7A7D80', deep: '#5a5e62' },
];

export default function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {MOODS.map(m => {
        const active = value === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 7,
              padding: '11px 6px',
              background: active ? 'var(--ink)' : 'transparent',
              border: `1px solid ${active ? 'rgba(39,37,31,0.22)' : 'var(--ink-14)'}`,
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
          >
            <svg viewBox="0 0 40 55" width={16} height={22}>
              <path
                d={TEAR_BASE_PATH}
                fill={m.fill}
                fillOpacity={active ? 0.80 : 0.60}
                stroke="none"
              />
              <path
                d={INNER_PATHS[0]}
                fill={m.deep}
                fillOpacity={active ? 0.30 : 0.20}
              />
              <ellipse cx={13} cy={17} rx={4} ry={7} transform="rotate(-20,13,17)" fill="white" fillOpacity={active ? 0.20 : 0.14} />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 14,
                fontWeight: 300,
                letterSpacing: '0.08em',
                color: active ? 'var(--bg)' : 'var(--ink-60)',
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
