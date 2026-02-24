'use client';

import { TearEntry } from '@/lib/types';
import { format } from 'date-fns';

interface DateAxisProps {
  entries: TearEntry[];
  vp: { w: number; h: number };
}

export default function DateAxis({ entries, vp }: DateAxisProps) {
  const dates = [...new Set(entries.map(e => e.date))].sort();
  if (dates.length === 0) return null;

  const colW = (vp.w - 80) / dates.length;
  const baselineY = vp.h * 0.76 + 20;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {dates.map((date, i) => {
        const x = 40 + i * colW + colW / 2;
        return (
          <div
            key={date}
            style={{
              position: 'absolute',
              left: x,
              top: baselineY,
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              fontWeight: 300,
              letterSpacing: '0.06em',
              color: 'var(--ink-35)',
              whiteSpace: 'nowrap',
            }}
          >
            {i === 0 ? format(new Date(date + 'T00:00:00'), 'MM/d') :format(new Date(date + 'T00:00:00'), 'd')}
          </div>
        );
      })}
    </div>
  );
}
