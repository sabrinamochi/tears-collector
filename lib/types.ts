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
