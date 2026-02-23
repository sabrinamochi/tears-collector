'use client';

import { TearEntry } from '@/lib/types';
import { format } from 'date-fns';

interface TearTooltipProps {
  entry: TearEntry | null;
  x: number;
  y: number;
}

const MOOD_LABEL = { sad: 'sad', happy: 'happy', yawn: 'yawn' };
const MOOD_COLOR = { sad: '#7aadca', happy: '#d4a843', yawn: '#a09a93' };

export default function TearTooltip({ entry, x, y }: TearTooltipProps) {
  if (!entry) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: x + 16,
        top: y - 10,
        pointerEvents: 'none',
        background: 'rgba(28,26,23,0.86)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(255,255,255,0.07)',
        maxWidth: 210,
        padding: '10px 14px',
        zIndex: 1000,
      }}
    >
      {/* Date */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'rgba(244,240,232,0.40)',
          marginBottom: 6,
        }}
      >
        {format(new Date(entry.date + 'T00:00:00'), 'MMM d, yyyy')}
      </div>

      {/* Mood chip + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            background: MOOD_COLOR[entry.mood],
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#f4f0e8',
          }}
        >
          {MOOD_LABEL[entry.mood]}
        </span>
      </div>

      {/* Note */}
      {entry.note && (
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 13,
            color: 'rgba(244,240,232,0.88)',
            marginBottom: 6,
            lineHeight: 1.4,
          }}
        >
          {entry.note}
        </div>
      )}

      {/* Reasons */}
      {entry.reasons.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {entry.reasons.map(r => (
            <span
              key={r}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'rgba(244,240,232,0.55)',
                border: '1px solid rgba(244,240,232,0.15)',
                padding: '2px 5px',
              }}
            >
              {r}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
