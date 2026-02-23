// Every tear must land at the SAME position on every render.
// Never use Math.random() anywhere tears are positioned.

export function seededRandom(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

export function sr2(a: number, b: number): number {
  return seededRandom(a * 997 + b * 31);
}
