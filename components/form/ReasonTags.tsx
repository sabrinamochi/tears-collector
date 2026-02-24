'use client';

import { Intensity } from '@/lib/types';

const LEVELS: { id: Intensity; label: string; desc: string }[] = [
  { id: 'mist', label: 'mist', desc: 'barely there' },
  { id: 'flow', label: 'flow', desc: 'quiet weeping' },
  { id: 'pour', label: 'pour', desc: 'full cry' },
];

interface IntensityPickerProps {
  value: Intensity;
  onChange: (i: Intensity) => void;
}

export default function IntensityPicker({ value, onChange }: IntensityPickerProps) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {LEVELS.map(l => {
        const active = value === l.id;
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => onChange(l.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '8px 6px',
              background: active ? 'var(--ink)' : 'transparent',
              border: `1px solid ${active ? 'rgba(39,37,31,0.22)' : 'var(--ink-14)'}`,
              cursor: 'pointer',
              outline: 'none',
              transition: 'background 0.12s, border-color 0.12s',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 14,
                fontWeight: 300,
                letterSpacing: '0.06em',
                color: active ? 'var(--bg)' : 'var(--ink-60)',
              }}
            >
              {l.label}
            </span>
            {/* <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 12,
                fontWeight: 300,
                letterSpacing: '0.04em',
                color: active ? 'rgba(246,245,242,0.55)' : 'var(--ink-35)',
              }}
            >
              {l.desc}
            </span> */}
          </button>
        );
      })}
    </div>
  );
}
