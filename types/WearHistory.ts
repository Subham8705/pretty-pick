import { Outfit } from './Outfit';

export interface WearHistory {
  id: string;
  outfit: Outfit;
  date: string;
  notes?: string;
  rating?: number;
}