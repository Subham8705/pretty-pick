import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClothingItem } from '@/types/ClothingItem';
import { Outfit } from '@/types/Outfit';
import { WardrobeService } from './WardrobeService';

const WEEKLY_OUTFIT_KEY = 'fitmate_weekly_outfit';
const FAVORITE_OUTFITS_KEY = 'fitmate_favorite_outfits';

export class OutfitService {
  static generateOutfitSuggestions(wardrobe: { shirts: ClothingItem[]; pants: ClothingItem[] }): Outfit[] {
    const outfits: Outfit[] = [];
    
    wardrobe.shirts.forEach(shirt => {
      wardrobe.pants.forEach(pant => {
        const outfit = this.createOutfit(shirt, pant);
        if (outfit.matchScore >= 60) { // Only include good matches
          outfits.push(outfit);
        }
      });
    });

    // Sort by match score
    return outfits.sort((a, b) => b.matchScore - a.matchScore);
  }

  static createOutfit(shirt: ClothingItem, pant: ClothingItem): Outfit {
    const matchScore = this.calculateMatchScore(shirt, pant);
    const occasion = this.determineOccasion(shirt, pant);
    const season = this.determineSeason(shirt, pant);
    const styleNote = this.generateStyleNote(shirt, pant);

    return {
      id: `${shirt.id}-${pant.id}`,
      shirt,
      pant,
      occasion,
      season,
      matchScore,
      styleNote,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };
  }

  static calculateMatchScore(shirt: ClothingItem, pant: ClothingItem): number {
    let score = 70; // Base score

    // Color matching
    const colorCompatibility = this.getColorCompatibility(shirt.color, pant.color);
    score += colorCompatibility * 15;

    // Style matching
    if (shirt.type === pant.type) {
      score += 10;
    } else if (
      (shirt.type === 'casual' && pant.type === 'formal') ||
      (shirt.type === 'formal' && pant.type === 'casual')
    ) {
      score += 5; // Smart casual
    }

    // Season compatibility
    if (shirt.season === pant.season || shirt.season === 'all' || pant.season === 'all') {
      score += 5;
    }

    // Fabric compatibility
    if (this.areFabricsCompatible(shirt.fabric, pant.fabric)) {
      score += 5;
    }

    // Ensure score is between 0-100
    return Math.max(0, Math.min(100, score));
  }

  static getColorCompatibility(color1: string, color2: string): number {
    const colorGroups = {
      neutral: ['white', 'black', 'gray', 'grey', 'beige', 'navy'],
      warm: ['red', 'orange', 'yellow', 'pink', 'brown'],
      cool: ['blue', 'green', 'purple', 'teal', 'cyan'],
    };

    const getColorGroup = (color: string) => {
      const lowerColor = color.toLowerCase();
      for (const [group, colors] of Object.entries(colorGroups)) {
        if (colors.some(c => lowerColor.includes(c))) {
          return group;
        }
      }
      return 'other';
    };

    const group1 = getColorGroup(color1);
    const group2 = getColorGroup(color2);

    if (group1 === 'neutral' || group2 === 'neutral') {
      return 1; // Neutral colors go with everything
    }

    if (group1 === group2) {
      return 0.8; // Same color group
    }

    return 0.6; // Different color groups
  }

  static areFabricsCompatible(fabric1: string, fabric2: string): boolean {
    const casualFabrics = ['cotton', 'denim', 'jersey', 'canvas'];
    const formalFabrics = ['wool', 'silk', 'polyester', 'linen'];

    const isCasual1 = casualFabrics.some(f => fabric1.toLowerCase().includes(f));
    const isCasual2 = casualFabrics.some(f => fabric2.toLowerCase().includes(f));
    const isFormal1 = formalFabrics.some(f => fabric1.toLowerCase().includes(f));
    const isFormal2 = formalFabrics.some(f => fabric2.toLowerCase().includes(f));

    return (isCasual1 && isCasual2) || (isFormal1 && isFormal2);
  }

  static determineOccasion(shirt: ClothingItem, pant: ClothingItem): string {
    if (shirt.type === 'formal' && pant.type === 'formal') {
      return 'formal';
    }
    if (shirt.type === 'party' || pant.type === 'party') {
      return 'party';
    }
    return 'casual';
  }

  static determineSeason(shirt: ClothingItem, pant: ClothingItem): string {
    if (shirt.season === 'all' || pant.season === 'all') {
      return shirt.season === 'all' ? pant.season : shirt.season;
    }
    return shirt.season === pant.season ? shirt.season : 'all';
  }

  static generateStyleNote(shirt: ClothingItem, pant: ClothingItem): string {
    const notes = [
      'Perfect for a relaxed day out',
      'Great for office meetings',
      'Ideal for casual gatherings',
      'Perfect for date nights',
      'Great for weekend activities',
      'Ideal for professional settings',
      'Perfect for social events',
      'Great for everyday wear',
    ];

    return notes[Math.floor(Math.random() * notes.length)];
  }

  static getOutfitsByOccasion(wardrobe: { shirts: ClothingItem[]; pants: ClothingItem[] }, occasion: string): Outfit[] {
    const allOutfits = this.generateOutfitSuggestions(wardrobe);
    
    if (occasion === 'summer' || occasion === 'winter') {
      return allOutfits.filter(outfit => 
        outfit.season === occasion || 
        outfit.season === 'all' ||
        outfit.shirt.season === occasion ||
        outfit.pant.season === occasion
      );
    }
    
    return allOutfits.filter(outfit => outfit.occasion === occasion);
  }

  static async getWeeklyOutfit(weekNumber: number): Promise<Outfit | null> {
    try {
      const key = `${WEEKLY_OUTFIT_KEY}_${weekNumber}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting weekly outfit:', error);
      return null;
    }
  }

  static async saveWeeklyOutfit(weekNumber: number, outfit: Outfit): Promise<void> {
    try {
      const key = `${WEEKLY_OUTFIT_KEY}_${weekNumber}`;
      await AsyncStorage.setItem(key, JSON.stringify(outfit));
    } catch (error) {
      console.error('Error saving weekly outfit:', error);
    }
  }

  static async getFavoriteOutfits(): Promise<Outfit[]> {
    try {
      const data = await AsyncStorage.getItem(FAVORITE_OUTFITS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorite outfits:', error);
      return [];
    }
  }

  static async updateOutfit(outfit: Outfit): Promise<void> {
    try {
      const favorites = await this.getFavoriteOutfits();
      const index = favorites.findIndex(f => f.id === outfit.id);
      
      if (outfit.isFavorite) {
        if (index === -1) {
          favorites.push(outfit);
        } else {
          favorites[index] = outfit;
        }
      } else {
        if (index !== -1) {
          favorites.splice(index, 1);
        }
      }
      
      await AsyncStorage.setItem(FAVORITE_OUTFITS_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error updating outfit:', error);
    }
  }

  static async markAsWorn(outfit: Outfit, date: Date): Promise<void> {
    try {
      // Increment wear count for both items
      await WardrobeService.incrementWearCount(outfit.shirt.id);
      await WardrobeService.incrementWearCount(outfit.pant.id);
      
      // Add to history (this will be handled by HistoryService)
      const { HistoryService } = await import('./HistoryService');
      await HistoryService.addWearHistory(outfit, date);
    } catch (error) {
      console.error('Error marking outfit as worn:', error);
    }
  }
}