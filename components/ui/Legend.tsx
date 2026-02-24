'use client';

import { useTearStore } from '@/lib/store';

const MOODS = [
  { id: 'sad',     label: 'sad',     color: '#7399d0' },
  { id: 'touched', label: 'touched', color: '#C8A36A' },
  { id: 'unsure',  label: 'unsure',  color: '#7A7D80' },
];

export default function Legend() {
  const { introduced } = useTearStore();
  if (!introduced) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 95,
        left: 28,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {MOODS.map(m => (
        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              background: m.color,
              borderRadius: '50%',
              opacity: 0.82,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              fontWeight: 300,
              letterSpacing: '0.03em',
              color: 'var(--ink-35)',
            }}
          >
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
}
