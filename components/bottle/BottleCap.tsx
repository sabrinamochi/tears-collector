'use client';

import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';

interface BottleCapProps {
  isOpen: boolean;
  x?: number;
  y?: number;
  /** Optional: min/max seconds between wiggles */
  wiggleMinDelaySec?: number;
  wiggleMaxDelaySec?: number;
}

export default function BottleCap({
  isOpen,
  x = 0,
  y = 0,
  wiggleMinDelaySec = 2,
  wiggleMaxDelaySec = 6,
}: BottleCapProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (isOpen) return;

    let cancelled = false;

    const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

    async function loop() {
      // Ensure we start from a neutral pose
      await controls.set({ rotate: 0, y: 0 });

      while (!cancelled) {
        // Random pause between wiggles
        const delaySec =
          wiggleMinDelaySec +
          Math.random() * Math.max(0, wiggleMaxDelaySec - wiggleMinDelaySec);

        await sleep(delaySec * 1000);
        if (cancelled) break;

        // Wiggle burst (subtle rotation + tiny vertical bounce)
        await controls.start({
          rotate: [0, -5, 4, -3, 2, 0],
          y: [0, -0.5, 0.3, -0.2, 0],
          transition: {
            duration: 0.85,
            ease: 'easeInOut',
          },
        });

        // Return to rest (extra safety)
        await controls.start({
          rotate: 0,
          y: 0,
          transition: { duration: 0.2, ease: 'easeOut' },
        });
      }
    }

    loop();

    return () => {
      cancelled = true;
      // Stop any in-flight animation to avoid state updates after unmount
      controls.stop();
    };
  }, [isOpen, controls, wiggleMinDelaySec, wiggleMaxDelaySec]);

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.g
          key="cork"
          style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
          initial={{ rotate: 0, y: 0 }}
          animate={controls}
          exit={{
            x: -160,
            y: -190,
            rotate: -55,
            opacity: 0,
            transition: { duration: 1.0, ease: 'easeOut' },
          }}
        >
          {/* Cork body */}
          <rect x={x - 8} y={y - 18} width={16} height={18} rx={2} fill="#c8b48a" />

          {/* Cork top cap */}
          <rect x={x - 10} y={y - 22} width={20} height={6} rx={1} fill="#b8a47a" />

          {/* Cork grain lines */}
          <line
            x1={x - 5}
            y1={y - 16}
            x2={x - 5}
            y2={y - 4}
            stroke="#a8946a"
            strokeWidth={0.8}
            strokeOpacity={0.4}
          />
          <line
            x1={x}
            y1={y - 17}
            x2={x}
            y2={y - 3}
            stroke="#a8946a"
            strokeWidth={0.8}
            strokeOpacity={0.4}
          />
          <line
            x1={x + 5}
            y1={y - 16}
            x2={x + 5}
            y2={y - 4}
            stroke="#a8946a"
            strokeWidth={0.8}
            strokeOpacity={0.4}
          />
        </motion.g>
      )}
    </AnimatePresence>
  );
}