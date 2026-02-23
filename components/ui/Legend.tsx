'use client';

import { useTearStore } from '@/lib/store';

const MOODS = [
  { id: 'sad',   label: 'sad',   color: '#7aadca' },
  { id: 'happy', label: 'happy', color: '#d4a843' },
  { id: 'yawn',  label: 'yawn',  color: '#a09a93' },
];

export default function Legend() {
  const { introduced } = useTearStore();
  if (!introduced) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      {MOODS.map(m => (
        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              background: m.color,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--muted)',
            }}
          >
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
}
