'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTearStore } from '@/lib/store';
import { Mood } from '@/lib/types';
import MoodPicker from './MoodPicker';
import ReasonTags from './ReasonTags';

export default function AddPanel() {
  const { formOpen, setFormOpen, addEntry } = useTearStore();
  const [mood, setMood] = useState<Mood>('sad');
  const [note, setNote] = useState('');
  const [reasons, setReasons] = useState<string[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setFormOpen(false);
    setMood('sad');
    setNote('');
    setReasons([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    addEntry({ mood, note: note.trim(), reasons, date: today });
    handleClose();
  };

  return (
    <AnimatePresence>
      {formOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(28,26,23,0.18)',
              zIndex: 300,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            ref={formRef}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'var(--bg)',
              borderTop: '1px solid var(--line)',
              zIndex: 400,
              padding: '28px 24px 40px',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.5, ease: [0.34, 1.1, 0.64, 1] }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 18,
                  color: 'var(--ink)',
                }}
              >
                add a tear
              </span>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--muted)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                close
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <MoodPicker value={mood} onChange={setMood} />

              <div style={{ margin: '20px 0' }}>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="what happened..."
                  rows={2}
                  maxLength={120}
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 15,
                    color: 'var(--ink)',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--line)',
                    outline: 'none',
                    resize: 'none',
                    padding: '4px 0 8px',
                    lineHeight: 1.5,
                  }}
                />
              </div>

              <ReasonTags selected={reasons} onChange={setReasons} />

              <button
                type="submit"
                style={{
                  marginTop: 20,
                  display: 'block',
                  width: '100%',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--bg)',
                  background: 'var(--ink)',
                  border: 'none',
                  padding: '12px',
                  cursor: 'pointer',
                }}
              >
                collect
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
