import { TearEntry, Position } from './types';
import { seededRandom, sr2 } from './seededRandom';

export function scatterPos(
  entry: TearEntry,
  allEntries: TearEntry[],
  vp: { w: number; h: number }
): Position {
  // Center of the canvas, shifted up a bit for the mini bottle
  const cx = vp.w / 2;
  const cy = vp.h / 2 - 30;

  // Max radius — fills the viewport as a solid disk
  const maxRadius = Math.min(vp.w * 0.40, vp.h * 0.38, 340);

  // Fully random angle across the full circle
  const angle = seededRandom(entry.id * 53) * Math.PI * 2;

  // sqrt normalization gives uniform density across the disk area (not ring-like)
  const rNorm = Math.sqrt(seededRandom(entry.id * 37));
  const radius = rNorm * maxRadius;

  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

export function moodPos(
  entry: TearEntry,
  allEntries: TearEntry[],
  vp: { w: number; h: number }
): Position {
  const cx = vp.w / 2;
  const cy = vp.h / 2 - 30;
  const maxRadius = Math.min(vp.w * 0.40, vp.h * 0.38, 340);

  // Each mood occupies a 120° arc sector; small gap between groups
  const arcStart = { sad: 0, touched: (Math.PI * 2) / 3, unsure: (Math.PI * 4) / 3 };
  const arcSpan = (Math.PI * 2) / 3;
  const gap = 0.18; // radians of padding at each sector edge

  const start = arcStart[entry.mood] + gap;
  const span = arcSpan - gap * 2;

  // Reuse same seeds as scatter so radius & relative spread feel continuous
  const angle = start + seededRandom(entry.id * 53) * span;
  const rNorm = Math.sqrt(seededRandom(entry.id * 37));
  const radius = rNorm * maxRadius;

  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

export function datePos(
  entry: TearEntry,
  allEntries: TearEntry[],
  vp: { w: number; h: number },
  tearHeight: number
): Position {
  const dates = [...new Set(allEntries.map(e => e.date))].sort();
  const colW = (vp.w - 80) / dates.length;
  const x = 40 + dates.indexOf(entry.date) * colW + colW / 2;

  const sameDate = allEntries
    .filter(e => e.date === entry.date)
    .sort((a, b) => a.mood.localeCompare(b.mood));

  return {
    x,
    y: vp.h * 0.76 - sameDate.findIndex(e => e.id === entry.id) * (tearHeight + 25),
  };
}
