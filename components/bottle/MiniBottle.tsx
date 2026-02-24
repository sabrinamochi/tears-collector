'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { useTearStore } from '@/lib/store';

export default function MiniBottle() {
  const { formOpen, setFormOpen, lastCollectedId } = useTearStore();
  const [gulping, setGulping] = useState(false);

  // 👇 controls for cork wiggle
  const corkControls = useAnimationControls();

  useEffect(() => {
    if (lastCollectedId === null) return;
    const t = setTimeout(() => setGulping(true), 550);
    return () => clearTimeout(t);
  }, [lastCollectedId]);

  // 👇 occasional cork wiggle loop
  useEffect(() => {
    if (formOpen) return; // stop when open

    let cancelled = false;

    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

    async function loop() {
      await corkControls.set({ rotate: 0, y: 0 });

      while (!cancelled) {
        // random pause between wiggles
        const delay = 2.5 + Math.random() * 4;
        await sleep(delay * 1000);
        if (cancelled) break;

        // subtle wiggle burst
        await corkControls.start({
          rotate: [0, -4, 3, -2, 1, 0],
          y: [0, -0.4, 0.2, -0.1, 0],
          transition: {
            duration: 0.75,
            ease: 'easeInOut'
          }
        });

        // settle back
        await corkControls.start({
          rotate: 0,
          y: 0,
          transition: { duration: 0.2 }
        });
      }
    }

    loop();

    return () => {
      cancelled = true;
      corkControls.stop();
    };
  }, [formOpen, corkControls]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        cursor: 'pointer',
      }}
      onClick={() => { if (!formOpen) setFormOpen(true); }}
    >
      <motion.div
        style={{ transformOrigin: 'bottom center' }}
        animate={{
          y: 'calc(100% - 58px)',
          scaleY: gulping ? [1, 0.91, 1.04, 1] : 1,
          scaleX: gulping ? [1, 1.06, 0.97, 1] : 1,
        }}
        initial={{ y: 'calc(100% - 58px)' }}
        transition={gulping ? { duration: 0.38, ease: 'easeInOut' } : undefined}
        onAnimationComplete={() => { if (gulping) setGulping(false); }}
      >
        <svg viewBox="0 0 120 78" width={120} height={78} overflow="visible">

          {/* Jar body */}
          <path
            d="M10 30 L10 68 Q10 76 60 76 Q110 76 110 68 L110 30 Z"
            fill="none"
            stroke="var(--glass-stroke)"
            strokeWidth={2}
            opacity={0.8}
          />

          {/* Jar neck */}
          <rect
            x={35}
            y={14}
            width={50}
            height={18}
            rx={3}
            fill="none"
            stroke="var(--glass-stroke)"
            strokeWidth={2}
            opacity={0.8}
          />

          {/* Jar tint */}
          <path
            d="M12 32 L12 68 Q12 74 60 74 Q108 74 108 68 L108 32 Z"
            fill="var(--sad)"
            fillOpacity={0.05}
          />

          {/* Glass shine */}
          <line
            x1={17}
            y1={35}
            x2={17}
            y2={68}
            stroke="white"
            strokeWidth={1.5}
            strokeOpacity={0.3}
          />

          {/* Ripple on gulp */}
          <AnimatePresence>
            {gulping && (
              <motion.circle
                key="ripple"
                cx={60}
                cy={50}
                fill="none"
                stroke="var(--glass-stroke)"
                strokeWidth={1}
                initial={{ r: 2, opacity: 0.6 }}
                animate={{ r: 18, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.38, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          {/* Cork */}
          <AnimatePresence>
            {!formOpen && (
              <motion.g
                key="mini-cork"
                style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
                animate={corkControls}
                exit={{
                  x: -80,
                  y: -95,
                  rotate: -55,
                  opacity: 0,
                  transition: { duration: 0.7, ease: 'easeOut' }
                }}
              >
                <rect x={42} y={4} width={36} height={12} rx={2} fill="#c8b48a" />
                <rect x={39} y={2} width={42} height={6} rx={1} fill="#b8a47a" />
                <line x1={53} y1={6} x2={53} y2={14} stroke="#a8946a" strokeWidth={0.8} strokeOpacity={0.4} />
                <line x1={60} y1={5} x2={60} y2={15} stroke="#a8946a" strokeWidth={0.8} strokeOpacity={0.4} />
                <line x1={67} y1={6} x2={67} y2={14} stroke="#a8946a" strokeWidth={0.8} strokeOpacity={0.4} />
              </motion.g>
            )}
          </AnimatePresence>

        </svg>
      </motion.div>
    </div>
  );
}