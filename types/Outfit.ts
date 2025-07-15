import { ClothingItem } from './ClothingItem';

export interface Outfit {
  id: string;
  shirt: ClothingItem;
  pant: ClothingItem;
  occasion: string;
  season: string;
  matchScore: number;
  styleNote?: string;
  isFavorite: boolean;
  createdAt: string;
}