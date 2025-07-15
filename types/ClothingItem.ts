export interface ClothingItem {
  id: string;
  name: string;
  category: 'shirt' | 'pant';
  color: string;
  type: 'casual' | 'formal' | 'party';
  fabric: string;
  season: 'all' | 'summer' | 'winter' | 'spring' | 'fall';
  image: string;
  dateAdded: string;
  lastWorn?: string;
  wearCount: number;
}