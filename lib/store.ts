import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TearEntry, SortMode } from './types';

interface TearStore {
  entries:         TearEntry[];
  sort:            SortMode;
  formOpen:        boolean;
  introduced:      boolean;
  lastCollectedId: number | null;

  setEntries:         (entries: TearEntry[]) => void;
  setSort:            (s: SortMode) => void;
  setFormOpen:        (open: boolean) => void;
  setIntroduced:      () => void;
  setLastCollectedId: (id: number | null) => void;
  clearLastCollected: () => void;
}

export const useTearStore = create<TearStore>()(
  persist(
    (set) => ({
      entries:         [],
      sort:            'scatter',
      formOpen:        false,
      introduced:      false,
      lastCollectedId: null,

      setEntries:         (entries) => set({ entries }),
      setSort:            (sort) => set({ sort }),
      setFormOpen:        (formOpen) => set({ formOpen }),
      setIntroduced:      () => set({ introduced: true }),
      setLastCollectedId: (id) => set({ lastCollectedId: id }),
      clearLastCollected: () => set({ lastCollectedId: null }),
    }),
    {
      name: 'tc_prefs',
      partialize: (_state) => ({}),
    }
  )
);
