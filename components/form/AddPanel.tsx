'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTearStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Mood, Intensity } from '@/lib/types';
import { TEAR_BASE_PATH } from '@/lib/tearShape';
import MoodPicker from './MoodPicker';
import IntensityPicker from './ReasonTags';

const MOOD_FILL = { sad: '#4A5B73', touched: '#C8A36A', unsure: '#7A7D80' };

const ACCESS_CODE = process.env.NEXT_PUBLIC_ACCESS_CODE ?? '';
const STORAGE_KEY = 'tc_verified';

const ui: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontWeight: 300,
};

export default function AddPanel() {
  const { formOpen, setFormOpen, setLastCollectedId } = useTearStore();

  // Code gate — persisted across sessions via localStorage
  const [verified, setVerified] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === '1'
  );
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);

  // Form state
  const [mood, setMood] = useState<Mood>('sad');
  const [note, setNote] = useState('');
  const [nickname, setNickname] = useState('');
  const [intensity, setIntensity] = useState<Intensity>('flow');
  const [submitting, setSubmitting] = useState(false);
  const [flyingTear, setFlyingTear] = useState<{ mood: Mood; startTop: number; yMove: number } | null>(null);
  const collectButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setFormOpen(false);
    setMood('sad');
    setNote('');
    setNickname('');
    setIntensity('flow');
    setCodeInput('');
    setCodeError(false);
  };

  const handleCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (codeInput.trim().toLowerCase() === ACCESS_CODE.toLowerCase()) {
      localStorage.setItem(STORAGE_KEY, '1');
      setVerified(true);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const today = new Date().toISOString().split('T')[0];
    const currentMood = mood;

    const buttonRect = collectButtonRef.current?.getBoundingClientRect();
    const startTop = buttonRect ? buttonRect.top + buttonRect.height / 2 : (typeof window !== 'undefined' ? window.innerHeight - 180 : 500);
    const bottleMouthTop = typeof window !== 'undefined' ? window.innerHeight - 58 : 600;
    const yMove = bottleMouthTop - startTop;

    const { data, error } = await supabase
      .from('tear_entries')
      .insert({ mood, note: note.trim(), intensity, nickname: nickname.trim() || null, date: today })
      .select()
      .single();

    if (!error && data) {
      setLastCollectedId(Number(data.id));
      setFlyingTear({ mood: currentMood, startTop, yMove });
      setTimeout(() => {
        setFlyingTear(null);
        setSubmitting(false);
        handleClose();
      }, 3100);
    } else {
      if (error) console.error('insert tear', error);
      setSubmitting(false);
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {formOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            style={{ position: 'fixed', inset: 0, zIndex: 300 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            style={{
              position: 'fixed',
              bottom: 82,
              left: '50%',
              width: 350,
              background: 'var(--bg)',
              border: '1px solid var(--ink-14)',
              zIndex: 400,
              padding: '20px 20px 22px',
            }}
            initial={{ x: '-50%', y: '110%' }}
            animate={{ x: '-50%', y: 0 }}
            exit={{ x: '-50%', y: '110%' }}
            transition={{ duration: 0.5, ease: [0.34, 1.1, 0.64, 1] }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 18, color: 'var(--ink)', opacity: 0.65 }}>
                {verified ? 'what made you cry?' : "Enter a code: what's my dog's name?"}
              </span>
              <button
                type="button"
                onClick={handleClose}
                style={{ ...ui, fontSize: 12, letterSpacing: '0.06em', color: 'var(--ink-35)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
              >
                close
              </button>
            </div>

            {/* Code gate */}
            {!verified ? (
              <form onSubmit={handleCodeSubmit}>
                <input
                  type="text"
                  value={codeInput}
                  onChange={e => { setCodeInput(e.target.value); setCodeError(false); }}
                  placeholder="..."
                  autoFocus
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: 16,
                    color: 'var(--ink)',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `1px solid ${codeError ? 'var(--sad)' : 'var(--ink-14)'}`,
                    outline: 'none',
                    padding: '4px 0 8px',
                    boxSizing: 'border-box',
                  }}
                />
                {codeError && (
                  <div style={{ ...ui, fontSize: 12, letterSpacing: '0.06em', color: 'var(--ink-35)', marginTop: 8 }}>
                    wrong answer
                  </div>
                )}
                <button
                  type="submit"
                  style={{ ...ui, marginTop: 20, display: 'block', width: '100%', fontSize: 12, letterSpacing: '0.06em', color: 'var(--bg)', background: 'var(--ink)', border: 'none', padding: '12px', cursor: 'pointer' }}
                >
                  confirm
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <MoodPicker value={mood} onChange={setMood} />

                <div style={{ margin: '20px 0' }}>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="what happened..."
                    rows={2}
                    maxLength={120}
                    style={{ width: '100%', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: 'var(--ink)', background: 'transparent', border: 'none', borderBottom: '1px solid var(--ink-14)', outline: 'none', resize: 'none', padding: '4px 0 8px', lineHeight: 1.6 }}
                  />
                </div>

                <IntensityPicker value={intensity} onChange={setIntensity} />

                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="nickname (optional)"
                  maxLength={30}
                  style={{
                    marginTop: 16,
                    width: '100%',
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 300,
                    fontSize: 12,
                    letterSpacing: '0.08em',
                    color: 'var(--ink)',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--ink-14)',
                    outline: 'none',
                    padding: '4px 0 8px',
                    boxSizing: 'border-box',
                  }}
                />

                <button
                  ref={collectButtonRef}
                  type="submit"
                  disabled={submitting}
                  style={{ ...ui, marginTop: 20, display: 'block', width: '100%', fontSize: 14, letterSpacing: '0.06em', color: 'var(--bg)', background: 'var(--ink)', border: 'none', padding: '12px', cursor: 'pointer', opacity: submitting ? 0.5 : 1 }}
                >
                  collect
                </button>
              </form>
            )}
          </motion.div>

          {/* Tear dropping into bottle */}
          <AnimatePresence>
            {flyingTear && (
              <motion.div
                key="flying-tear"
                style={{
                  position: 'fixed',
                  top: flyingTear.startTop,
                  left: '50%',
                  marginLeft: -14,
                  zIndex: 500,
                  pointerEvents: 'none',
                }}
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={{
                  y: flyingTear.yMove,
                  opacity: [1, 1, 1, 0],
                  scale: [1, 0.95, 0.8, 0.5],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  opacity: { times: [0, 0.6, 0.85, 1] },
                  scale: { times: [0, 0.6, 0.85, 1] },
                }}
              >
                <svg viewBox="0 0 40 55" width={28} height={38}>
                  <path
                    d={TEAR_BASE_PATH}
                    fill={MOOD_FILL[flyingTear.mood]}
                    fillOpacity={0.78}
                    stroke="none"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
