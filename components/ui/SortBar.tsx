'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTearStore } from '@/lib/store';
import { SortMode } from '@/lib/types';

const MODES: { id: SortMode; label: string }[] = [
  { id: 'scatter', label: 'Scattered' },
  { id: 'mood',    label: 'By mood' },
  { id: 'date',    label: 'By date' },
];

export default function SortBar() {
  const { sort, setSort, introduced } = useTearStore();
  const pathname = usePathname();
  const onAbout = pathname === '/about';

  if (!introduced && !onAbout) return null;

  return (
    <div style={{
      position: 'fixed', top: 22, left: '50%', transform: 'translateX(-50%)',
      zIndex: 100, display: 'flex', alignItems: 'center', gap: 20, background: 'var(--bg)',
    }}>
      {/* On canvas: show sort pill group; on about: show back link */}
      {!onAbout ? (
        <div style={{
          display: 'flex', alignItems: 'center',
          border: '1px solid var(--ink-35)', padding: '3px 4px',
        }}>
          {MODES.map((m, i) => {
            const active = sort === m.id;
            return (
              <Fragment key={m.id}>
        
                <button
                  type="button"
                  onClick={() => setSort(m.id)}
                  style={{
                    fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 300,
                    letterSpacing: '0.10em', textTransform: 'uppercase',
                    padding: '5px 12px', cursor: 'pointer', border: 'none', outline: 'none',
                    background: active ? 'var(--ink)' : 'transparent',
                    color: active ? 'var(--bg)' : 'var(--ink-60)',
                    transition: 'background 0.15s, color 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {m.label}
                </button>
              </Fragment>
            );
          })}
        </div>
      ) : (
        <Link href="/" style={{
          fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 300,
          letterSpacing: '0.10em', textTransform: 'uppercase',
          color: 'var(--ink-60)', textDecoration: 'none',
          padding: '5px 12px', border: '1px solid var(--ink-35)',
          whiteSpace: 'nowrap',
        }}>
          ← canvas
        </Link>
      )}

      {/* About — separate nav link */}
      <Link href="/about" style={{
        fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400,
        fontSize: 16, color: onAbout ? 'var(--ink)' : 'var(--ink-60)',
        textDecoration: 'none', transition: 'color 0.15s', paddingRight: 20
      }}>
        about
      </Link>
    </div>
  );
}
