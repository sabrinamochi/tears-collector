'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface BottleCapProps {
  isOpen: boolean;
  x?: number;
  y?: number;
}

export default function BottleCap({ isOpen, x = 0, y = 0 }: BottleCapProps) {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.g
          key="cork"
          exit={{ x: -160, y: -190, rotate: -55, opacity: 0 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
        >
          {/* Cork body */}
          <rect
            x={x - 8}
            y={y - 18}
            width={16}
            height={18}
            rx={2}
            fill="#c8b48a"
          />
          {/* Cork top cap */}
          <rect
            x={x - 10}
            y={y - 22}
            width={20}
            height={6}
            rx={1}
            fill="#b8a47a"
          />
          {/* Cork grain lines */}
          <line x1={x - 5} y1={y - 16} x2={x - 5} y2={y - 4} stroke="#a8946a" strokeWidth={0.8} strokeOpacity={0.4} />
          <line x1={x}     y1={y - 17} x2={x}     y2={y - 3} stroke="#a8946a" strokeWidth={0.8} strokeOpacity={0.4} />
          <line x1={x + 5} y1={y - 16} x2={x + 5} y2={y - 4} stroke="#a8946a" strokeWidth={0.8} strokeOpacity={0.4} />
        </motion.g>
      )}
    </AnimatePresence>
  );
}
