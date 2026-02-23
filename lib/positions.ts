import { TearEntry, Position } from './types';
import { seededRandom, sr2 } from './seededRandom';

export function scatterPos(
  entry: TearEntry,
  allEntries: TearEntry[],
  vp: { w: number; h: number }
): Position {
  const sorted = [...allEntries].sort((a, b) => a.id - b.id);
  const index = sorted.findIndex(e => e.id === entry.id);
  const total = Math.max(sorted.length, 1);

  // Center of the canvas, shifted up a bit for the mini bottle
  const cx = vp.w / 2;
  const cy = vp.h / 2 - 30;

  // Base radius — fits inside the viewport with padding
  const baseRadius = Math.min(vp.w * 0.38, vp.h * 0.36, 320);

  // Evenly spaced angle around the circle, plus a small seeded jitter
  const sliceAngle = (Math.PI * 2) / total;
  const angleJitter = (seededRandom(entry.id * 53) - 0.5) * sliceAngle * 0.55;
  const angle = index * sliceAngle + angleJitter - Math.PI / 2; // start at top

  // Radial jitter — stay in a band, never let two rings collide
  const radialBand = baseRadius * 0.18;
  const radius = baseRadius + (seededRandom(entry.id * 37) - 0.5) * 2 * radialBand;

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
  const groups: { sad: number[]; happy: number[]; yawn: number[] } = { sad: [], happy: [], yawn: [] };
  allEntries.forEach(e => groups[e.mood].push(e.id));

  const centerX = { sad: vp.w * 0.18, happy: vp.w * 0.5, yawn: vp.w * 0.82 };
  const g = groups[entry.mood];
  const i = g.indexOf(entry.id);
  const cols = Math.max(2, Math.ceil(Math.sqrt(g.length)));
  const spacing = 48 + sr2(entry.id, 9) * 22;

  return {
    x: centerX[entry.mood] + (i % cols - (cols - 1) / 2) * spacing + (sr2(entry.id, 3) - 0.5) * 90,
    y: vp.h * 0.22 + Math.floor(i / cols) * spacing + (sr2(entry.id, 5) - 0.5) * 65,
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
