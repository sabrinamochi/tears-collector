export type Mood = 'sad' | 'touched' | 'unsure';

export type Intensity = 'mist' | 'flow' | 'pour';

export type TearEntry = {
  id: number;
  mood: Mood;
  note: string;
  intensity: Intensity;
  nickname?: string;
  date: string;       // 'YYYY-MM-DD'
  createdAt: number;  // Date.now()
};

export type SortMode = 'scatter' | 'mood' | 'date';

export type Position = { x: number; y: number };
