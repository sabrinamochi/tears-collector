'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Transition, type TargetAndTransition } from 'framer-motion';
import { useTearStore } from '@/lib/store';
import { TearEntry } from '@/lib/types';
import { getTearSize } from '@/lib/tearShape';
import { scatterPos, moodPos, datePos } from '@/lib/positions';
import { supabase } from '@/lib/supabase';
import TearDrop from './TearDrop';
import TearTooltip from './TearTooltip';
import DateAxis from '@/components/ui/DateAxis';

interface Vp { w: number; h: number }

// Module-level flag: burst plays once per page lifecycle, not per mount
let burstDone = false;

function dbRowToEntry(row: Record<string, unknown>): TearEntry {
  return {
    id:        Number(row.id),
    mood:      row.mood as TearEntry['mood'],
    note:      (row.note as string) ?? '',
    intensity: (row.intensity as TearEntry['intensity']) ?? 'flow',
    nickname:  (row.nickname as string) || undefined,
    date:      row.date as string,
    createdAt: new Date(row.created_at as string).getTime(),
  };
}

export default function TearCanvas() {
  const { entries, sort, lastCollectedId, clearLastCollected, setEntries, setLastCollectedId } = useTearStore();
  const [vp, setVp] = useState<Vp>({ w: 0, h: 0 });
  const [hoveredEntry, setHoveredEntry] = useState<TearEntry | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [hasBurst, setHasBurst] = useState(burstDone);
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seenIds = useRef<Set<number>>(new Set());

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
    const mq = window.matchMedia('(hover: none)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleTearTap = useCallback((entry: TearEntry, x: number, y: number) => {
    if (!isMobile) return;
    if (hoveredEntry?.id === entry.id) {
      setHoveredEntry(null);
    } else {
      setHoveredEntry(entry);
      setCursor({ x, y });
    }
  }, [isMobile, hoveredEntry]);

  useEffect(() => {
    if (burstDone) return;
    // Let burst animation complete before enabling normal sort transitions
    // Max burst duration: 14 * 0.032s delay + 1.0s animation ≈ 1.45s
    const t = setTimeout(() => {
      setHasBurst(true);
      burstDone = true;
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!lastCollectedId) return;
    const t = setTimeout(clearLastCollected, 2000);
    return () => clearTimeout(t);
  }, [lastCollectedId, clearLastCollected]);

  // Fetch all entries + realtime subscription
  useEffect(() => {
    async function loadEntries() {
      const { data, error } = await supabase
        .from('tear_entries')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) { console.error('fetch entries', error); return; }

      const mapped = (data ?? []).map(dbRowToEntry);
      mapped.forEach((e: TearEntry) => seenIds.current.add(e.id));
      setEntries(mapped);
    }

    loadEntries();

    const channel = supabase
      .channel('tear_entries_all')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tear_entries' },
        (payload: { new: Record<string, unknown> }) => {
          const newEntry = dbRowToEntry(payload.new);
          if (!seenIds.current.has(newEntry.id)) {
            seenIds.current.add(newEntry.id);
            setEntries([...useTearStore.getState().entries, newEntry]);
            setLastCollectedId(newEntry.id);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPos = useCallback((entry: TearEntry) => {
    if (!vp.w) return { x: 0, y: 0 };
    const { h } = getTearSize(entry.id, entry.mood, entry.intensity);
    if (sort === 'scatter') return scatterPos(entry, entries, vp);
    if (sort === 'mood')    return moodPos(entry, entries, vp);
    return datePos(entry, entries, vp, h);
  }, [sort, entries, vp]);

  const centerX = vp.w / 2;
  const centerY = vp.h / 2;

  if (!vp.w) return null;

  return (
    <div
      style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}
      onMouseMove={e => setCursor({ x: e.clientX, y: e.clientY })}
      onClick={() => { if (isMobile) setHoveredEntry(null); }}
    >
      <AnimatePresence>
        {entries.map((entry, index) => {
          const pos = getPos(entry);
          const { w, h } = getTearSize(entry.id, entry.mood, entry.intensity);

          let animateProps: TargetAndTransition = {
            x: pos.x - w / 2,
            y: pos.y - h / 2,
            opacity: 1,
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

          const rainStartY = -(pos.y + h / 2);
          const rainEndY   = vp.h - pos.y + h / 2;

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
                isScatter={sort === 'scatter'}
                isActive={isMobile && hoveredEntry?.id === entry.id}
                rainStartY={rainStartY}
                rainEndY={rainEndY}
                onHover={isMobile ? () => {} : setHoveredEntry}
                onTap={handleTearTap}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {sort === 'date' && <DateAxis entries={entries} vp={vp} />}

      <TearTooltip entry={hoveredEntry} x={cursor.x} y={cursor.y} vw={vp.w} isDate={sort === 'date'} />
    </div>
  );
}
