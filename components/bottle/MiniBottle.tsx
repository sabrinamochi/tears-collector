'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTearStore } from '@/lib/store';

export default function MiniBottle() {
  const { formOpen, setFormOpen } = useTearStore();

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
        animate={{ y: 'calc(100% - 58px)' }}
        initial={{ y: 'calc(100% - 58px)' }}
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
          <rect x={35} y={14} width={50} height={18} rx={3} fill="none" stroke="var(--glass-stroke)" strokeWidth={2} opacity={0.8} />
          {/* Jar fill tint */}
          <path
            d="M12 32 L12 68 Q12 74 60 74 Q108 74 108 68 L108 32 Z"
            fill="var(--sad)"
            fillOpacity={0.05}
          />
          {/* Glass shine */}
          <line x1={17} y1={35} x2={17} y2={68} stroke="white" strokeWidth={1.5} strokeOpacity={0.3} />

          {/* Cork */}
          <AnimatePresence>
            {!formOpen && (
              <motion.g
                key="mini-cork"
                exit={{ x: -80, y: -95, rotate: -55, opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <rect x={42} y={4} width={36} height={12} rx={2} fill="#c8b48a" />
                <rect x={39} y={2} width={42} height={6} rx={1} fill="#b8a47a" />
                <line x1={53} y1={6}  x2={53} y2={14} stroke="#a8946a" strokeWidth={0.8} strokeOpacity={0.4} />
                <line x1={60} y1={5}  x2={60} y2={15} stroke="#a8946a" strokeWidth={0.8} strokeOpacity={0.4} />
                <line x1={67} y1={6}  x2={67} y2={14} stroke="#a8946a" strokeWidth={0.8} strokeOpacity={0.4} />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </motion.div>
    </div>
  );
}
