import { Mood } from './types';
import { seededRandom } from './seededRandom';

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
