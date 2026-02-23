'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Transition, type TargetAndTransition } from 'framer-motion';
import { useTearStore } from '@/lib/store';
import { TearEntry } from '@/lib/types';
import { getTearSize } from '@/lib/tearShape';
import { scatterPos, moodPos, datePos } from '@/lib/positions';
import TearDrop from './TearDrop';
import TearTooltip from './TearTooltip';
import DateAxis from '@/components/ui/DateAxis';

interface Vp { w: number; h: number }

export default function TearCanvas() {
  const { entries, sort, introduced } = useTearStore();
  const [vp, setVp] = useState<Vp>({ w: 0, h: 0 });
  const [hoveredEntry, setHoveredEntry] = useState<TearEntry | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hasBurst, setHasBurst] = useState(false);
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateVp = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    updateVp();
    const handler = () => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(updateVp, 150);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (introduced) setHasBurst(true);
  }, [introduced]);

  const getPos = useCallback((entry: TearEntry) => {
    if (!vp.w) return { x: 0, y: 0 };
    const { h } = getTearSize(entry.id, entry.mood);
    if (sort === 'scatter') return scatterPos(entry, entries, vp);
    if (sort === 'mood')    return moodPos(entry, entries, vp);
    return datePos(entry, entries, vp, h);
  }, [sort, entries, vp]);

  const centerX = vp.w / 2;
  const centerY = vp.h / 2;

  if (!vp.w) return null;

  if (entries.length === 0) {
    return (
      <div
        style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}
        onMouseMove={e => setCursor({ x: e.clientX, y: e.clientY })}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: 0.35,
          }}
        >
          <svg viewBox="0 0 40 55" width={40} height={55} style={{ margin: '0 auto 12px' }}>
            <path
              d="M20 1 C19 2, 14 8, 10 14 C5 22, 1 31, 1 39 C1 48, 9.5 54, 20 54 C30.5 54, 39 48, 39 39 C39 31, 35 22, 30 14 C26 8, 21 2, 20 1 Z"
              fill="var(--ink)"
              fillOpacity={0.2}
              stroke="var(--ink)"
              strokeWidth={0.8}
              strokeOpacity={0.3}
            />
          </svg>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 15,
              color: 'var(--ink)',
            }}
          >
            add your first tear
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}
      onMouseMove={e => setCursor({ x: e.clientX, y: e.clientY })}
    >
      <AnimatePresence>
        {entries.map((entry, index) => {
          const pos = getPos(entry);
          const { w, h } = getTearSize(entry.id, entry.mood);

          let animateProps: TargetAndTransition = {
            x: pos.x - w / 2,
            y: pos.y - h / 2,
          };

          let transitionProps: Transition;

          if (!hasBurst) {
            animateProps = {
              x: pos.x - w / 2,
              y: pos.y - h / 2,
              scale: 1,
              opacity: 1,
            };
            transitionProps = {
              duration: 1.0,
              delay: index * 0.032,
              ease: [0.25, 0.46, 0.45, 0.94],
            };
          } else if (sort === 'date') {
            transitionProps = {
              duration: 0.55,
              delay: index * 0.022,
              ease: 'easeOut',
            };
          } else {
            transitionProps = {
              duration: 0.85,
              delay: index * 0.020,
              ease: [0.34, 1.1, 0.64, 1],
            };
          }

          const initialProps = !hasBurst
            ? { x: centerX - w / 2, y: centerY - h / 2, scale: 0.2, opacity: 0 }
            : sort === 'date'
              ? { y: (pos.y - h / 2) - 40, opacity: 0 }
              : undefined;

          return (
            <motion.div
              key={entry.id}
              style={{ position: 'absolute' }}
              initial={initialProps}
              animate={animateProps}
              transition={transitionProps}
              layout={sort !== 'date'}
            >
              <TearDrop
                entry={entry}
                isDate={sort === 'date'}
                onHover={setHoveredEntry}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {sort === 'date' && <DateAxis entries={entries} vp={vp} />}

      <TearTooltip entry={hoveredEntry} x={cursor.x} y={cursor.y} />
    </div>
  );
}
