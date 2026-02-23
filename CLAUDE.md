# tears collector — CLAUDE.md

Personal emotional journal. Every cry becomes a teardrop on a canvas.
You will receive screenshots of the working prototype. Use them as the visual
source of truth. This file tells you everything else you need to know.

---

## WHAT THIS APP IS

- User logs a moment they cried → picks mood → writes a short note → picks reason tags
- Each entry becomes a teardrop SVG on a full-screen canvas
- The bottle is the central metaphor: tears are collected inside it
- On first open: sealed bottle with tears inside. Tap → cork pops off → tears burst onto canvas
- Three views: scattered (default), by mood (grouped), by date (bar chart of stacked drops)
- Mini bottle sits at bottom center — tap to open add form

---

## STACK

```
Next.js 14        App Router, no pages dir
TypeScript        strict mode, no any
Tailwind CSS      layout + spacing only — no Tailwind for animation
Framer Motion     ALL animation — no CSS keyframes except float
Zustand           global state + localStorage persistence
date-fns          date formatting in date view
```

---

## PROJECT STRUCTURE

```
/app
  layout.tsx          fonts, metadata, SVG filter defs (rendered once here)
  page.tsx            root: shows IntroBottle until introduced, then Canvas

/components
  /bottle
    IntroBottle.tsx   sealed bottle, tears inside, tap to open
    MiniBottle.tsx    squat jar fixed at bottom center, tap to add
    BottleCap.tsx     cork — Framer Motion exit animation when opened

  /canvas
    TearCanvas.tsx    positions all tears, owns sort state rendering
    TearDrop.tsx      single tear: SVG layers + float animation + hover
    TearTooltip.tsx   follows cursor on hover, shows date/mood/note/reasons

  /form
    AddPanel.tsx      slide-up panel from mini bottle
    MoodPicker.tsx    sad / happy / yawning — large tap targets
    ReasonTags.tsx    multi-select pills

  /ui
    SortBar.tsx       scattered / by mood / by date — fixed top center
    Legend.tsx        color key, fixed bottom left
    DateAxis.tsx      MM-DD labels below baseline in date view

/lib
  types.ts            TypeScript types (see below)
  seededRandom.ts     deterministic random — NEVER use Math.random() for position
  tearShape.ts        SVG path + watercolor layer constants + size calculation
  positions.ts        scatterPos, moodPos, datePos
  store.ts            Zustand store with persist middleware
  seeds.ts            15 demo entries loaded on first run

/styles
  globals.css         CSS variables, paper grain overlay
```

---

## TYPES

```typescript
// lib/types.ts

export type Mood = 'sad' | 'happy' | 'yawn';

export type TearEntry = {
  id: number;
  mood: Mood;
  note: string;
  reasons: string[];
  date: string;       // 'YYYY-MM-DD'
  createdAt: number;  // Date.now()
};

export type SortMode = 'scatter' | 'mood' | 'date';

export type Position = { x: number; y: number };
```

---

## SEEDED RANDOM — CRITICAL

```typescript
// lib/seededRandom.ts
// Every tear must land at the SAME position on every render.
// Never use Math.random() anywhere tears are positioned.

export function seededRandom(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

export function sr2(a: number, b: number): number {
  return seededRandom(a * 997 + b * 31);
}
```

---

## THE TEAR SHAPE — CRITICAL

The tear is a real SVG path traced from a hand-drawn illustration.
It is NOT CSS border-radius. Do not simplify or replace it.
Pointed at top, rounded at bottom — like a real teardrop.

```typescript
// lib/tearShape.ts

export const TEAR_BASE_PATH =
  `M20 1 C19 2, 14 8, 10 14 C5 22, 1 31, 1 39
   C1 48, 9.5 54, 20 54 C30.5 54, 39 48, 39 39
   C39 31, 35 22, 30 14 C26 8, 21 2, 20 1 Z`;

// viewBox: 0 0 40 55

// Three inner watercolor pool paths (darker tone, gives depth)
export const INNER_PATHS = [
  `M16 14 C11 20, 9 30, 12 40 C15 46, 20 50, 25 46 C28 36, 26 22, 20 14 Z`,
  `M22 10 C26 16, 30 26, 28 38 C26 44, 22 50, 18 46 C14 38, 16 22, 22 10 Z`,
  `M14 20 C10 28, 10 36, 14 44 C18 50, 24 50, 26 42 C24 32, 20 22, 14 20 Z`,
];

// White highlight ellipses (top-left of tear)
export const HIGHLIGHTS = [
  { cx: 14, cy: 16, rx: 5, ry: 8,  rotate: -20 },
  { cx: 12, cy: 18, rx: 4, ry: 7,  rotate: -15 },
  { cx: 16, cy: 14, rx: 5, ry: 7,  rotate: -25 },
];

// Base scale applied to 40x55 viewBox
export const BASE_SCALE: Record<Mood, number> = {
  sad:   1.05,
  happy: 0.90,
  yawn:  0.82,
};

// Final size varies per tear (seeded from id)
export function getTearScale(id: number, mood: Mood): number {
  return BASE_SCALE[mood] + seededRandom(id * 7) * 0.45;
}

export function getTearSize(id: number, mood: Mood) {
  const sc = getTearScale(id, mood);
  return { w: Math.round(40 * sc), h: Math.round(55 * sc) };
}

// Which inner path, highlight, and displacement filter to use
export function getTearVariants(id: number) {
  return {
    innerIndex:     id % 3,   // picks from INNER_PATHS
    highlightIndex: id % 3,   // picks from HIGHLIGHTS
    filterIndex:    id % 5,   // picks from wc0-wc4
  };
}
```

---

## SVG FILTER DEFS (render ONCE in layout.tsx)

```tsx
// In layout.tsx body, before children:
<svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
  <defs>
    {([1, 7, 13, 19, 5] as const).map((seed, i) => (
      <filter key={i} id={`wc${i}`} x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.038 0.052"
          numOctaves={4}
          seed={seed}
          result="n"
        />
        <feDisplacementMap
          in="SourceGraphic" in2="n"
          scale={1.8}
          xChannelSelector="R" yChannelSelector="G"
        />
      </filter>
    ))}
  </defs>
</svg>
```

Each tear references filter="url(#wc{filterIndex})" — unique watercolor texture per tear.

---

## TEAR SVG LAYER ORDER (bottom to top)

```
1. Base path   — main color, semi-transparent fill (0.60-0.85 opacity), stroke
2. Inner pool  — INNER_PATHS[innerIndex], darker color (deep), opacity 0.28-0.50
3. Mid-tone    — same inner path, scaled 0.7x, mid color, lower opacity
4. Highlight   — white ellipse, HIGHLIGHTS[highlightIndex], opacity 0.38-0.60
```

Fill/inner opacities vary by tear id (seeded). This creates the watercolor effect.

---

## COLOR PALETTE

```
bg:           #f4f0e8   warm off-white paper
ink:          #1c1a17   near-black for all text/borders
muted:        rgba(28,26,23,0.38)
line:         rgba(28,26,23,0.10)

sad:          #7aadca   blue
sad-mid:      #4d87a8
sad-deep:     #2e5f80
sad-stroke:   #3a7096

happy:        #d4a843   amber yellow
happy-mid:    #b8842a
happy-deep:   #8a5f18
happy-stroke: #a07020

yawn:         #a09a93   warm gray
yawn-mid:     #7a746e
yawn-deep:    #5a5450
yawn-stroke:  #6a6460

cork:         #c8b48a
glass-stroke: #8aaabb
```

Colorblind-safe: blue / amber / gray. Never red/green.

---

## TYPOGRAPHY

Two fonts only. No exceptions.

```
Instrument Serif italic
  -> app name, panel headings, note textarea, tear note text in tooltip

DM Mono
  -> every label, button, tag, count, date
  -> always: uppercase, letter-spacing 0.12em, font-size 10px (labels) or 9px (micro)
```

```typescript
// layout.tsx
import { Instrument_Serif, DM_Mono } from 'next/font/google';

const display = Instrument_Serif({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: '400',
  variable: '--font-display',
});

const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-mono',
});
```

---

## ZUSTAND STORE

```typescript
// lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TearStore {
  entries:     TearEntry[];
  sort:        SortMode;
  formOpen:    boolean;
  introduced:  boolean;

  addEntry:      (e: Omit<TearEntry, 'id' | 'createdAt'>) => void;
  setSort:       (s: SortMode) => void;
  setFormOpen:   (open: boolean) => void;
  setIntroduced: () => void;
}

export const useTearStore = create<TearStore>()(
  persist(
    (set) => ({
      entries:    [],
      sort:       'scatter',
      formOpen:   false,
      introduced: false,

      addEntry: (e) => set((s) => ({
        entries: [...s.entries, {
          ...e,
          id: Date.now(),
          createdAt: Date.now(),
        }],
      })),

      setSort:       (sort) => set({ sort }),
      setFormOpen:   (formOpen) => set({ formOpen }),
      setIntroduced: () => set({ introduced: true }),
    }),
    {
      name: 'tc_entries',
      onRehydrateStorage: () => (state) => {
        // seed demo data on first load
        if (state && state.entries.length === 0) {
          const { SEED_ENTRIES } = require('./seeds');
          state.entries = SEED_ENTRIES.map((e: any, i: number) => ({
            ...e, id: i + 1, createdAt: Date.now() - (15 - i) * 86400000,
          }));
        }
      },
    }
  )
);
```

---

## POSITIONING ALGORITHMS

```typescript
// lib/positions.ts

export function scatterPos(entry: TearEntry, vp: { w: number; h: number }): Position {
  return {
    x: 70 + sr2(entry.id, 1) * (vp.w - 140),
    y: 80 + sr2(entry.id, 2) * (vp.h - 185 - 80),
    // 185px bottom clearance for mini bottle
  };
}

export function moodPos(
  entry: TearEntry,
  allEntries: TearEntry[],
  vp: { w: number; h: number }
): Position {
  const groups = { sad: [] as number[], happy: [] as number[], yawn: [] as number[] };
  allEntries.forEach(e => groups[e.mood].push(e.id));

  const centerX = { sad: vp.w * 0.18, happy: vp.w * 0.5, yawn: vp.w * 0.82 };
  const g = groups[entry.mood];
  const i = g.indexOf(entry.id);
  const cols = Math.max(2, Math.ceil(Math.sqrt(g.length)));
  const spacing = 48 + sr2(entry.id, 9) * 22;

  return {
    x: centerX[entry.mood] + (i % cols - (cols - 1) / 2) * spacing + (sr2(entry.id, 3) - 0.5) * 90,
    y: vp.h * 0.22 + Math.floor(i / cols) * spacing + (sr2(entry.id, 5) - 0.5) * 65,
    // large jitter: keeps it chaotic, not grid-like
  };
}

export function datePos(
  entry: TearEntry,
  allEntries: TearEntry[],
  vp: { w: number; h: number },
  tearHeight: number
): Position {
  const dates = [...new Set(allEntries.map(e => e.date))].sort();
  const colW = (vp.w - 140) / dates.length;
  const x = 70 + dates.indexOf(entry.date) * colW + colW / 2;

  const sameDate = allEntries
    .filter(e => e.date === entry.date)
    .sort((a, b) => a.mood.localeCompare(b.mood));

  return {
    x,
    y: vp.h * 0.76 - sameDate.findIndex(e => e.id === entry.id) * (tearHeight + 5),
  };
}
```

---

## ROTATIONS

```typescript
// scatter + mood: chaotic
const rotation = (sr2(entry.id, 77) - 0.5) * 68;  // -34deg to +34deg

// date view: nearly upright
const rotation = (sr2(entry.id, 77) - 0.5) * 10;  // -5deg to +5deg
```

---

## FRAMER MOTION SPECS

### Intro burst
```typescript
initial={{ x: centerX, y: centerY, scale: 0.2, opacity: 0 }}
animate={{ x: pos.x, y: pos.y, scale: 1, opacity: 1 }}
transition={{ duration: 1.0, delay: index * 0.032, ease: [0.25, 0.46, 0.45, 0.94] }}
```

### Sort scatter <-> mood
```typescript
animate={{ x: pos.x, y: pos.y, rotate: rotation }}
transition={{ duration: 0.85, delay: index * 0.020, ease: [0.34, 1.1, 0.64, 1] }}
```

### Sort -> date (drop in)
```typescript
initial={{ y: pos.y - 40, opacity: 0 }}
animate={{ y: pos.y, opacity: 1 }}
transition={{ duration: 0.55, delay: index * 0.022, ease: 'easeOut' }}
```

### Hover
```typescript
whileHover={{ scale: 1.5 }}
transition={{ type: 'spring', stiffness: 400, damping: 20 }}
```

### Float (scatter + mood ONLY — never date view)
```typescript
const floatDur = 3.5 + seededRandom(entry.id * 97) * 3.5;
const floatY   = 4   + seededRandom(entry.id * 103) * 3;
const floatRot = rotation + (seededRandom(entry.id * 107) - 0.5) * 8;

animate={{ rotate: [rotation, floatRot], y: [0, -floatY] }}
transition={{
  duration: floatDur,
  repeat: Infinity,
  repeatType: 'mirror',
  ease: 'easeInOut',
  delay: -(seededRandom(entry.id * 101) * floatDur), // stagger phases
}}
```

### Cork pop
```typescript
exit={{ x: -160, y: -190, rotate: -55, opacity: 0 }}
transition={{ duration: 1.0, ease: 'easeOut' }}
```

### Mini bottle form slide
```typescript
initial={{ y: '100%' }}
animate={{ y: 0 }}
exit={{ y: '100%' }}
transition={{ duration: 0.5, ease: [0.34, 1.1, 0.64, 1] }}
```

### Submit tear flight
```typescript
// Render clone at form pos, animate to canvas pos, then show real tear
animate={{ x: destX - startX, y: destY - startY, scale: 0.35, opacity: 0 }}
transition={{ duration: 0.95, ease: [0.4, 0, 0.8, 0.6] }}
// After 830ms: real tear fades in at destination
```

---

## COMPONENT BEHAVIORS

### TearDrop.tsx
- useMemo for SVG markup — recalculate only on entry.id or mood change
- transform-origin: 50% 30% (rotates around upper body, not tip)
- will-change: transform on wrapper
- Framer Motion layout prop for smooth sort transitions

### TearCanvas.tsx
- Full-screen position:relative div, overflow:hidden
- Recalculate positions on viewport resize (debounced 150ms)
- Empty state: single ghosted tear + italic "add your first tear"

### TearTooltip.tsx
- position:fixed, pointer-events:none
- Follows cursor via onMouseMove on canvas div
- Offset: +16px right, -10px up from cursor
- background rgba(28,26,23,0.86), backdrop-filter blur(6px)
- border 1px solid rgba(255,255,255,0.07)
- NO border-radius, max-width 210px, padding 10px 14px
- Contents: date (10px, 40% opacity) -> mood chip + name -> note -> reasons

### SortBar.tsx
- position:fixed, top-center
- Hidden until introduced === true
- Active: background ink, color bg
- NO border-radius anywhere in the app

### IntroBottle.tsx
- Full-screen overlay, centered
- SVG bottle with tear paths scattered inside (seeded positions)
- "tap to open" — blinks 1.6s cycle
- On click -> setIntroduced() -> burst

### MiniBottle.tsx
- position:fixed, bottom-center
- Closed: translateY(calc(100% - 58px)) — jar top peeks above fold
- Wide squat proportions (120x78px viewBox)
- Cork animates off on open

### AddPanel.tsx
- MoodPicker first (default sad if none selected)
- Textarea: Instrument Serif italic, border-bottom only
- ReasonTags: flex-wrap, toggle, 9px DM Mono uppercase
- On submit: addEntry -> fly animation -> close

---

## DEMO DATA

```typescript
// lib/seeds.ts
export const SEED_ENTRIES = [
  { mood: 'sad',   note: 'watched the news alone',            reasons: ['unknown'],  date: '2026-01-05' },
  { mood: 'happy', note: 'cat sat on my lap for an hour',     reasons: ['joy'],      date: '2026-01-09' },
  { mood: 'sad',   note: 'thought about the old job again',   reasons: ['work'],     date: '2026-01-14' },
  { mood: 'yawn',  note: 'so tired i cried in the shower',    reasons: ['body'],     date: '2026-01-14' },
  { mood: 'happy', note: 'a song made me feel understood',    reasons: ['music'],    date: '2026-01-20' },
  { mood: 'sad',   note: 'a memory came out of nowhere',      reasons: ['memory'],   date: '2026-01-22' },
  { mood: 'happy', note: 'called mom, she laughed a lot',     reasons: ['friends'],  date: '2026-02-01' },
  { mood: 'sad',   note: 'applied to 6 jobs today',           reasons: ['work'],     date: '2026-02-01' },
  { mood: 'yawn',  note: 'fell asleep mid-movie, woke crying', reasons: ['unknown'], date: '2026-02-05' },
  { mood: 'happy', note: 'the 5pm light hit just right',      reasons: ['joy'],      date: '2026-02-07' },
  { mood: 'sad',   note: 'a 2019 song on shuffle',            reasons: ['music'],    date: '2026-02-10' },
  { mood: 'happy', note: 'someone texted to check in',        reasons: ['friends'],  date: '2026-02-10' },
  { mood: 'sad',   note: 'rejection email at 7am',            reasons: ['work'],     date: '2026-02-14' },
  { mood: 'yawn',  note: 'three hour nap, woke up heavy',     reasons: ['body'],     date: '2026-02-18' },
  { mood: 'happy', note: 'made dumplings from memory',        reasons: ['joy'],      date: '2026-02-20' },
] as const;
```

---

## SETUP COMMANDS

```bash
npx create-next-app@latest tears-collector \
  --typescript --tailwind --app --no-src-dir --import-alias "@/*"

cd tears-collector
npm install framer-motion zustand date-fns
```

Build order:
1. lib/types.ts
2. lib/seededRandom.ts
3. lib/tearShape.ts
4. lib/seeds.ts
5. lib/store.ts
6. lib/positions.ts
7. styles/globals.css
8. app/layout.tsx  (fonts + SVG filters)
9. components/canvas/TearDrop.tsx
10. Build outward from there

---

## HARD RULES

1. TEAR_BASE_PATH is sacred. Never change or simplify.
2. Never use Math.random() for tear positions. Always seededRandom(entry.id).
3. Never add border-radius to tears. Shape = SVG path only.
4. Tears in date view do NOT float. Float only in scatter + mood.
5. Filtered tears -> opacity 0.15. Never display:none or visibility:hidden.
6. SVG filters defined ONCE in layout.tsx. Never inline.
7. No UI libraries. No component libraries. Build from scratch.
8. All motion timing from specs above. Do not invent values.
9. DM Mono for ALL labels. Instrument Serif italic for ALL narrative text.
10. Screenshots win for visual decisions. This file wins for logic/architecture.
