'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTearStore } from '@/lib/store';
import { seededRandom } from '@/lib/seededRandom';
import BottleCap from './BottleCap';
import { TEAR_BASE_PATH } from '@/lib/tearShape';

const SEED_TEAR_POSITIONS = Array.from({ length: 40 }, (_, i) => ({
  x:    16 + seededRandom((i + 1) * 13) * 65,
  y:    90 + seededRandom((i + 12) * 30) * 120,
  rot:  (seededRandom((i + 1) * 23) - 0.3) * 28,
  scale: 0.10 + seededRandom((i + 1) * 31) * 0.05,
  mood: ['sad', 'touched', 'unsure'][i % 3] as 'sad' | 'touched' | 'unsure',
}));

const MOOD_FILL = { sad: '#4b75b0', touched: '#C8A36A', unsure: '#7A7D80' };

export default function IntroBottle() {
  const { setIntroduced } = useTearStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => setIntroduced(), 1000);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
          zIndex: 500,
          cursor: isOpen ? 'default' : 'pointer',
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
        onClick={isOpen ? undefined : handleOpen}
      >
        {/* App name */}
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 24,
            color: 'var(--ink)',
            marginBottom: 32,
            letterSpacing: '0.02em',
          }}
        >
          tears collector
        </div>

        {/* Bottle SVG */}
        <svg
          viewBox="0 0 100 220"
          width={160}
          height={352}
          style={{ overflow: 'visible' }}
        >
          {/* Bottle body */}
          <path
            d="M28 80 L20 80 L15 95 L15 190 Q15 210 50 210 Q85 210 85 190 L85 95 L80 80 L72 80"
            fill="none"
            stroke="var(--glass-stroke)"
            strokeWidth={2}
            opacity={0.7}
          />
          {/* Bottle neck */}
          <rect x={28} y={55} width={44} height={28} rx={4} fill="none" stroke="var(--glass-stroke)" strokeWidth={2} opacity={0.7} />
          {/* Glass shine */}
          <line x1={22} y1={100} x2={22} y2={185} stroke="white" strokeWidth={1.5} strokeOpacity={0.25} />

          <clipPath id="bottle-clip">
            <path d="M18 70 L18 190 Q18 207 50 207 Q82 207 82 190 L82 97 Z" />
          </clipPath>

          {/* Static clipped tears — fade out when bottle opens */}
          <motion.g
            clipPath="url(#bottle-clip)"
            initial={{ opacity: 1 }}
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {SEED_TEAR_POSITIONS.map((t, i) => (
              <g
                key={i}
                transform={`translate(${t.x}, ${t.y}) rotate(${t.rot}) scale(${t.scale}) translate(-20, -27.5)`}
              >
                <path
                  d={TEAR_BASE_PATH}
                  fill={MOOD_FILL[t.mood]}
                  fillOpacity={0.65}
                  stroke={MOOD_FILL[t.mood]}
                  strokeWidth={0.5}
                  strokeOpacity={0.4}
                />
              </g>
            ))}
          </motion.g>

          {/* Flying tears (unclipped) — burst out when bottle opens */}
          {SEED_TEAR_POSITIONS.map((t, i) => (
            <motion.g
              key={`fly-${i}`}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={isOpen ? {
                y: -(70 + seededRandom((i + 1) * 43) * 100),
                x: (seededRandom((i + 1) * 41) - 0.5) * 55,
                opacity: [0, 0.9, 0],
              } : { y: 0, x: 0, opacity: 0 }}
              transition={{
                duration: 0.65,
                delay: i * 0.05,
                ease: 'easeOut',
                opacity: { duration: 0.65, delay: i * 0.05, times: [0, 0.12, 1] },
              }}
            >
              <g transform={`translate(${t.x}, ${t.y}) rotate(${t.rot}) scale(${t.scale}) translate(-20, -27.5)`}>
                <path
                  d={TEAR_BASE_PATH}
                  fill={MOOD_FILL[t.mood]}
                  fillOpacity={0.65}
                  stroke={MOOD_FILL[t.mood]}
                  strokeWidth={0.5}
                  strokeOpacity={0.4}
                />
              </g>
            </motion.g>
          ))}

          {/* Cork */}
          <BottleCap isOpen={isOpen} x={50} y={57} />
        </svg>

        {/* Tap prompt */}
        <motion.div
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            fontWeight: 300,
            letterSpacing: '0.06em',
            color: 'var(--ink-35)',
            marginTop: 28,
          }}
          animate={isOpen ? { opacity: 0 } : { opacity: [0.5, 1] }}
          transition={
            isOpen
              ? { duration: 0.2 }
              : { duration: 1.6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
          }
        >
          tap to open
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
