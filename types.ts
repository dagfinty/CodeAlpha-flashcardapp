
export interface Card {
  id: string;
  front: string;
  back: string;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  cards: Card[];
  color: string;
  createdAt: number;
}

export type View = 'HOME' | 'EDIT' | 'QUIZ';

export const COLORS = [
  'bg-indigo-500',
  'bg-rose-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-fuchsia-500',
  'bg-sky-500',
  'bg-orange-500',
  'bg-violet-600'
];
