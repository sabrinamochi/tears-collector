'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { TearEntry, Mood } from '@/lib/types';

type SortDir = 'desc' | 'asc';

const MOOD_COLOR: Record<Mood, string> = {
  sad:     'var(--sad)',
  touched: 'var(--touched)',
  unsure:  'var(--unsure)',
};

function dbRowToEntry(row: Record<string, unknown>): TearEntry {
  return {
    id:        Number(row.id),
    mood:      row.mood as Mood,
    note:      (row.note as string) ?? '',
    intensity: (row.intensity as TearEntry['intensity']) ?? 'flow',
    date:      row.date as string,
    createdAt: new Date(row.created_at as string).getTime(),
  };
}

export default function DataPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<TearEntry[]>([]);
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('tear_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setEntries((data ?? []).map(dbRowToEntry));
      setLoading(false);
    }
    load();
  }, []);

  const sorted = [...entries].sort((a, b) =>
    sortDir === 'desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
  );

  const sadCount     = entries.filter(e => e.mood === 'sad').length;
  const touchedCount = entries.filter(e => e.mood === 'touched').length;
  const unsureCount  = entries.filter(e => e.mood === 'unsure').length;

  const monoLabel: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--ink-35)',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '28px 24px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, gap: 16 }}>
        <button
          onClick={() => router.push('/')}
          style={{ ...monoLabel, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          ← back
        </button>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, color: 'var(--ink)' }}>
          tears — data
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div style={{ ...monoLabel, marginBottom: 24 }}>
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          {' · '}
          <span style={{ color: 'var(--sad-stroke)' }}>{sadCount} sad</span>
          {' · '}
          <span style={{ color: 'var(--touched-stroke)' }}>{touchedCount} touched</span>
          {' · '}
          <span style={{ color: 'var(--unsure-deep)' }}>{unsureCount} unsure</span>
        </div>
      )}

      {loading ? (
        <div style={{ ...monoLabel, marginTop: 40, textAlign: 'center' }}>loading...</div>
      ) : entries.length === 0 ? (
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink-35)', marginTop: 40, textAlign: 'center' }}>
          no entries yet
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <th
                  onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
                  style={{ ...monoLabel, textAlign: 'left', padding: '0 12px 10px 0', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}
                >
                  date {sortDir === 'desc' ? '↓' : '↑'}
                </th>
                <th style={{ ...monoLabel, textAlign: 'left', padding: '0 12px 10px 0' }}>mood</th>
                <th style={{ ...monoLabel, textAlign: 'left', padding: '0 12px 10px 0' }}>note</th>
                <th style={{ ...monoLabel, textAlign: 'left', padding: '0 0 10px 0' }}>intensity</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(entry => (
                <tr key={entry.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ ...monoLabel, color: 'var(--ink)', padding: '10px 12px 10px 0', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                    {entry.date}
                  </td>
                  <td style={{ padding: '10px 12px 10px 0', verticalAlign: 'top' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 9, fontWeight: 300, letterSpacing: '0.06em', color: 'var(--bg)', background: MOOD_COLOR[entry.mood], padding: '2px 6px', display: 'inline-block' }}>
                      {entry.mood}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink)', padding: '10px 12px 10px 0', verticalAlign: 'top', maxWidth: 280 }}>
                    {entry.note.length > 80 ? entry.note.slice(0, 80) + '…' : entry.note}
                  </td>
                  <td style={{ ...monoLabel, padding: '10px 0 10px 0', verticalAlign: 'top' }}>
                    {entry.intensity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
