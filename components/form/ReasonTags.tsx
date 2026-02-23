'use client';

const REASONS = ['work', 'friends', 'body', 'music', 'memory', 'joy', 'unknown'];

interface ReasonTagsProps {
  selected: string[];
  onChange: (r: string[]) => void;
}

export default function ReasonTags({ selected, onChange }: ReasonTagsProps) {
  const toggle = (r: string) => {
    if (selected.includes(r)) {
      onChange(selected.filter(s => s !== r));
    } else {
      onChange([...selected, r]);
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {REASONS.map(r => {
        const active = selected.includes(r);
        return (
          <button
            key={r}
            type="button"
            onClick={() => toggle(r)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              padding: '4px 8px',
              background: active ? 'var(--ink)' : 'transparent',
              color: active ? 'var(--bg)' : 'var(--ink)',
              border: `1px solid ${active ? 'var(--ink)' : 'var(--line)'}`,
              cursor: 'pointer',
              outline: 'none',
              transition: 'background 0.12s, color 0.12s',
            }}
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}
