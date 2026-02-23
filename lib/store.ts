import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TearEntry, SortMode } from './types';

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
        if (state && state.entries.length === 0) {
          const { SEED_ENTRIES } = require('./seeds');
          state.entries = SEED_ENTRIES.map((e: { mood: string; note: string; reasons: string[]; date: string }, i: number) => ({
            ...e, id: i + 1, createdAt: Date.now() - (15 - i) * 86400000,
          }));
        }
      },
    }
  )
);
