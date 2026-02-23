'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTearStore } from '@/lib/store';
import { seededRandom } from '@/lib/seededRandom';
import BottleCap from './BottleCap';
import { TEAR_BASE_PATH } from '@/lib/tearShape';

const SEED_TEAR_POSITIONS = Array.from({ length: 9 }, (_, i) => ({
  x:    18 + seededRandom((i + 1) * 13) * 64,
  y:    90 + seededRandom((i + 1) * 17) * 90,
  rot:  (seededRandom((i + 1) * 23) - 0.5) * 60,
  scale: 0.45 + seededRandom((i + 1) * 31) * 0.35,
  mood: ['sad', 'happy', 'yawn'][i % 3] as 'sad' | 'happy' | 'yawn',
}));

const MOOD_FILL = { sad: '#7aadca', happy: '#d4a843', yawn: '#a09a93' };

export default function IntroBottle() {
  const { setIntroduced } = useTearStore();

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
          cursor: 'pointer',
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => setIntroduced()}
      >
        {/* App name */}
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 22,
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
          {/* Bottle fill (light tint) */}
          <path
            d="M18 97 L18 190 Q18 207 50 207 Q82 207 82 190 L82 97 Z"
            fill="var(--sad)"
            fillOpacity={0.06}
          />
          {/* Glass shine */}
          <line x1={22} y1={100} x2={22} y2={185} stroke="white" strokeWidth={1.5} strokeOpacity={0.25} />

          {/* Tears inside bottle — clipped */}
          <clipPath id="bottle-clip">
            <path d="M18 97 L18 190 Q18 207 50 207 Q82 207 82 190 L82 97 Z" />
          </clipPath>
          <g clipPath="url(#bottle-clip)">
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
          </g>

          {/* Cork */}
          <BottleCap isOpen={false} x={50} y={57} />
        </svg>

        {/* Tap prompt */}
        <motion.div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--muted)',
            marginTop: 28,
          }}
          animate={{ opacity: [0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        >
          tap to open
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
