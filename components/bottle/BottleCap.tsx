'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';

interface BottleCapProps {
  isOpen: boolean;
  x?: number;
  y?: number;
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
    let cancelled = false;
    const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

    async function run() {
      if (isOpen) {
        // Stop any wiggle mid-flight and fly away
        controls.stop();
        await controls.start({
          opacity: 0,
          x: -160,
          y: -190,
          rotate: -55,
          transition: { duration: 0.9, ease: 'easeOut' },
        });
        return;
      }

      // Reset to resting pose when closed
      await controls.set({ opacity: 1, x: 0, y: 0, rotate: 0 });

      // Wiggle loop while closed
      while (!cancelled) {
        const delaySec =
          wiggleMinDelaySec +
          Math.random() * Math.max(0, wiggleMaxDelaySec - wiggleMinDelaySec);

        await sleep(delaySec * 1000);
        if (cancelled) break;

        // More pronounced wiggle (tweak numbers as you like)
        await controls.start({
          rotate: [0, -9, 7, -5, 3, 0],
          y: [0, -1.2, 0.6, -0.4, 0],
          transition: { duration: 0.8, ease: 'easeInOut' },
        });

        // Settle
        await controls.start({
          rotate: 0,
          y: 0,
          transition: { duration: 0.2, ease: 'easeOut' },
        });
      }
    }

    run();

    return () => {
      cancelled = true;
      controls.stop();
    };
  }, [isOpen, controls, wiggleMinDelaySec, wiggleMaxDelaySec]);

  return (
    <motion.g
      style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
      initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
      animate={controls}
    >
      {/* Cork body */}
      <rect x={x - 8} y={y - 18} width={16} height={18} rx={2} fill="#c8b48a" />
      {/* Cork top cap */}
      <rect x={x - 10} y={y - 22} width={20} height={6} rx={1} fill="#b8a47a" />
      {/* Cork grain lines */}
      <line x1={x - 5} y1={y - 16} x2={x - 5} y2={y - 4} stroke="#a8946a" strokeWidth={0.8} strokeOpacity={0.4} />
      <line x1={x} y1={y - 17} x2={x} y2={y - 3} stroke="#a8946a" strokeWidth={0.8} strokeOpacity={0.4} />
      <line x1={x + 5} y1={y - 16} x2={x + 5} y2={y - 4} stroke="#a8946a" strokeWidth={0.8} strokeOpacity={0.4} />
    </motion.g>
  );
}