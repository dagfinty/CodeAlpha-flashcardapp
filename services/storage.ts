
import { Deck } from '../types';

const BASE = (import.meta as any).env?.VITE_API_URL || '';
const API = `${BASE.replace(/\/+$/, '')}/api/decks`;

export const saveDecks = async (decks: Deck[]) => {
  try {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(decks),
    });
  } catch (e) {
    console.error('Failed to save decks to backend', e);
  }
};

export const loadDecks = async (): Promise<Deck[]> => {
  try {
    const res = await fetch(API);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('Failed to load decks from backend', e);
    return [];
  }
};
