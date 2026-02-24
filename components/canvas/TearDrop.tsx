'use client';

import { useMemo, useEffect, useLayoutEffect, useCallback } from 'react';
import { motion, useAnimation, useMotionValue, type Transition, type TargetAndTransition } from 'framer-motion';
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
  sad:     { base: '#7399d0', mid: '#4b75b0', deep: '#2e3d52', stroke: 'none' },
  touched: { base: '#C8A36A', mid: '#9e7a3e', deep: '#9e7a3e', stroke: 'none' },
  unsure:  { base: '#7A7D80', mid: '#5a5e62', deep: '#5a5e62', stroke: 'none' },
};



interface TearDropProps {
  entry: TearEntry;
  isDate: boolean;
  isScatter: boolean;
  isActive: boolean;
  rainStartY: number;
  rainEndY: number;
  onHover: (entry: TearEntry | null) => void;
  onTap?: (entry: TearEntry, x: number, y: number) => void;
}

export default function TearDrop({ entry, isDate, isScatter, isActive, rainStartY, rainEndY, onHover, onTap }: TearDropProps) {
  const { w, h } = getTearSize(entry.id, entry.mood, entry.intensity);
  const { innerIndex, highlightIndex, filterIndex } = getTearVariants(entry.id);
  const colors = MOOD_COLORS[entry.mood];

  const baseOpacity  = 0.88 + seededRandom(entry.id * 13) * 0.20;
  const innerOpacity = 0.48 + seededRandom(entry.id * 17) * 0.22;
  const midOpacity   = 0.35 + seededRandom(entry.id * 23) * 0.15;
  const hlOpacity    = 0.2 + seededRandom(entry.id * 29) * 0.07;

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
          stroke="none"
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

  // Mood float (unchanged values)
  const floatDur   = 3.5 + seededRandom(entry.id * 97)  * 3.5;
  const floatY     = 4   + seededRandom(entry.id * 103) * 3;
  const floatRot   = rotation + (seededRandom(entry.id * 107) - 0.5) * 8;
  const floatDelay = -(seededRandom(entry.id * 101) * floatDur);

  // Rain values — 2.5× slower (6.25–12.5 s)
  const rainDur   = 18.25 + seededRandom(entry.id * 109) * 30.25;
  const rainSwayA = (seededRandom(entry.id * 113) - 0.5) * 8;
  const rainSwayB = (seededRandom(entry.id * 117) - 0.5) * 8;
  const rainDelay = -(seededRandom(entry.id * 119) * rainDur);

  const innerY = useMotionValue(0);
  const innerX = useMotionValue(0);

  const rainControls = useAnimation();

  const rainAnimDef = {
    y: [rainStartY, rainEndY],
    x: [rainSwayA, rainSwayB],
    rotate: rotation,
    transition: {
      y: {
        duration: rainDur,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: [0.4, 0, 0.6, 1] as [number, number, number, number],
        delay: rainDelay,
      },
      x: {
        duration: rainDur * 0.7,
        repeat: Infinity,
        repeatType: 'mirror' as const,
        ease: 'easeInOut' as const,
        delay: rainDelay,
      },
      rotate: { duration: 0 },
    },
  };

  const startRain = useCallback(() => {
    rainControls.start(rainAnimDef);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rainControls, rainStartY, rainEndY]);

  // Synchronously zero out inner position before any non-scatter frame renders
  useLayoutEffect(() => {
    if (!isScatter) {
      innerY.set(0);
      innerX.set(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScatter]);

  // Start/stop rain when scatter mode changes
  useEffect(() => {
    if (isScatter) startRain();
    else rainControls.stop();
    return () => { rainControls.stop(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScatter, rainStartY, rainEndY]);

  // Mobile tap: isActive=true means this tear is selected → pause
  useEffect(() => {
    if (!isScatter) return;
    if (isActive) rainControls.stop();
    else startRain();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  let tearAnimate: TargetAndTransition;
  let tearTransition: Transition;

  if (!isScatter) {
    if (!isDate) {
      tearAnimate = { rotate: [rotation, floatRot], y: [0, -floatY] };
      tearTransition = {
        duration: floatDur, repeat: Infinity, repeatType: 'mirror' as const,
        ease: 'easeInOut' as const, delay: floatDelay,
      };
    } else {
      // y: 0 clears any residual y offset left by the rain animation
      tearAnimate = { rotate: rotation, y: 0 };
      tearTransition = {};
    }
  } else {
    // scatter: controlled by rainControls, these are unused
    tearAnimate = {};
    tearTransition = {};
  }

  return (
    <motion.div
      style={{
        y: innerY,
        x: innerX,
        transformOrigin: '50% 30%',
        willChange: 'transform',
        cursor: 'pointer',
        display: 'inline-block',
      }}
      animate={isScatter ? rainControls : tearAnimate}
      transition={isScatter ? undefined : tearTransition}
      whileHover={{ scale: 1.5 }}
      onHoverStart={() => {
        if (isScatter) rainControls.stop();
        onHover(entry);
      }}
      onHoverEnd={() => {
        if (isScatter) startRain();
        onHover(null);
      }}
      onClick={(e) => { e.stopPropagation(); onTap?.(entry, e.clientX, e.clientY); }}
    >
      {svgMarkup}
    </motion.div>
  );
}
