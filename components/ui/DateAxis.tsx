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

  const colW = (vp.w - 140) / dates.length;
  const baselineY = vp.h * 0.76 + 20;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {dates.map((date, i) => {
        const x = 70 + i * colW + colW / 2;
        return (
          <div
            key={date}
            style={{
              position: 'absolute',
              left: x,
              top: baselineY,
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              textTransform: 'uppercase',
              letterSpacing: '0.10em',
              color: 'var(--muted)',
              whiteSpace: 'nowrap',
            }}
          >
            {format(new Date(date + 'T00:00:00'), 'MM-dd')}
          </div>
        );
      })}
    </div>
  );
}
