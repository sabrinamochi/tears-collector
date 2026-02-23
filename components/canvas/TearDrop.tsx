'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TearEntry } from '@/lib/types';
import {
  TEAR_BASE_PATH,
  INNER_PATHS,
  HIGHLIGHTS,
  getTearSize,
  getTearVariants,
} from '@/lib/tearShape';
import { seededRandom, sr2 } from '@/lib/seededRandom';

const MOOD_COLORS = {
  sad:   { base: '#7aadca', mid: '#4d87a8', deep: '#2e5f80', stroke: '#3a7096' },
  happy: { base: '#d4a843', mid: '#b8842a', deep: '#8a5f18', stroke: '#a07020' },
  yawn:  { base: '#a09a93', mid: '#7a746e', deep: '#5a5450', stroke: '#6a6460' },
};

interface TearDropProps {
  entry: TearEntry;
  isDate: boolean;
  onHover: (entry: TearEntry | null) => void;
}

export default function TearDrop({ entry, isDate, onHover }: TearDropProps) {
  const { w, h } = getTearSize(entry.id, entry.mood);
  const { innerIndex, highlightIndex, filterIndex } = getTearVariants(entry.id);
  const colors = MOOD_COLORS[entry.mood];

  const baseOpacity  = 0.60 + seededRandom(entry.id * 13) * 0.25;
  const innerOpacity = 0.28 + seededRandom(entry.id * 17) * 0.22;
  const midOpacity   = 0.15 + seededRandom(entry.id * 23) * 0.15;
  const hlOpacity    = 0.38 + seededRandom(entry.id * 29) * 0.22;

  const rotation = (sr2(entry.id, 77) - 0.5) * (isDate ? 10 : 68);

  const svgMarkup = useMemo(() => {
    const hl = HIGHLIGHTS[highlightIndex];
    return (
      <svg
        viewBox="0 0 40 55"
        width={w}
        height={h}
        filter={`url(#wc${filterIndex})`}
        overflow="visible"
      >
        {/* 1. Base path */}
        <path
          d={TEAR_BASE_PATH}
          fill={colors.base}
          fillOpacity={baseOpacity}
          stroke={colors.stroke}
          strokeWidth={0.8}
        />
        {/* 2. Inner pool */}
        <path
          d={INNER_PATHS[innerIndex]}
          fill={colors.deep}
          fillOpacity={innerOpacity}
        />
        {/* 3. Mid-tone (scaled 0.7x from center) */}
        <path
          d={INNER_PATHS[innerIndex]}
          fill={colors.mid}
          fillOpacity={midOpacity}
          transform="translate(20, 27.5) scale(0.7) translate(-20, -27.5)"
        />
        {/* 4. Highlight */}
        <ellipse
          cx={hl.cx}
          cy={hl.cy}
          rx={hl.rx}
          ry={hl.ry}
          fill="white"
          fillOpacity={hlOpacity}
          transform={`rotate(${hl.rotate}, ${hl.cx}, ${hl.cy})`}
        />
      </svg>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.id, entry.mood]);

  const floatDur = 3.5 + seededRandom(entry.id * 97) * 3.5;
  const floatY   = 4   + seededRandom(entry.id * 103) * 3;
  const floatRot = rotation + (seededRandom(entry.id * 107) - 0.5) * 8;
  const floatDelay = -(seededRandom(entry.id * 101) * floatDur);

  const floatAnimate = !isDate ? {
    rotate: [rotation, floatRot],
    y: [0, -floatY],
  } : { rotate: rotation };

  const floatTransition = !isDate ? {
    duration: floatDur,
    repeat: Infinity,
    repeatType: 'mirror' as const,
    ease: 'easeInOut' as const,
    delay: floatDelay,
  } : {};

  return (
    <motion.div
      layout
      style={{
        transformOrigin: '50% 30%',
        willChange: 'transform',
        cursor: 'pointer',
        display: 'inline-block',
      }}
      animate={floatAnimate}
      transition={floatTransition}
      whileHover={{ scale: 1.5 }}
      onHoverStart={() => onHover(entry)}
      onHoverEnd={() => onHover(null)}
    >
      {svgMarkup}
    </motion.div>
  );
}
