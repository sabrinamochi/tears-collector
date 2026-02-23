import { Mood } from './types';

export const SEED_ENTRIES: Array<{ mood: Mood; note: string; reasons: string[]; date: string }> = [
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
];
