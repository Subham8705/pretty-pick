import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClothingItem } from '@/types/ClothingItem';

const WARDROBE_KEY = 'fitmate_wardrobe';

export class WardrobeService {
  static async getWardrobe(): Promise<{ shirts: ClothingItem[]; pants: ClothingItem[] }> {
    try {
      const data = await AsyncStorage.getItem(WARDROBE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return { shirts: [], pants: [] };
    } catch (error) {
      console.error('Error getting wardrobe:', error);
      return { shirts: [], pants: [] };
    }
  }

  static async addItem(item: Omit<ClothingItem, 'id' | 'dateAdded' | 'wearCount'>): Promise<void> {
    try {
      const wardrobe = await this.getWardrobe();
      
      const newItem: ClothingItem = {
        ...item,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString(),
        wearCount: 0,
      };

      if (item.category === 'shirt') {
        wardrobe.shirts.push(newItem);
      } else {
        wardrobe.pants.push(newItem);
      }

      await AsyncStorage.setItem(WARDROBE_KEY, JSON.stringify(wardrobe));
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  static async updateItem(id: string, updates: Partial<ClothingItem>): Promise<void> {
    try {
      const wardrobe = await this.getWardrobe();
      
      const updateArray = (items: ClothingItem[]) => {
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
          items[index] = { ...items[index], ...updates };
          return true;
        }
        return false;
      };

      const updated = updateArray(wardrobe.shirts) || updateArray(wardrobe.pants);
      
      if (updated) {
        await AsyncStorage.setItem(WARDROBE_KEY, JSON.stringify(wardrobe));
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }

  static async deleteItem(id: string): Promise<void> {
    try {
      const wardrobe = await this.getWardrobe();
      
      wardrobe.shirts = wardrobe.shirts.filter(item => item.id !== id);
      wardrobe.pants = wardrobe.pants.filter(item => item.id !== id);
      
      await AsyncStorage.setItem(WARDROBE_KEY, JSON.stringify(wardrobe));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  static async clearWardrobe(): Promise<void> {
    try {
      await AsyncStorage.removeItem(WARDROBE_KEY);
    } catch (error) {
      console.error('Error clearing wardrobe:', error);
    }
  }

  static async incrementWearCount(id: string): Promise<void> {
    try {
      const wardrobe = await this.getWardrobe();
      
      const incrementArray = (items: ClothingItem[]) => {
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
          items[index].wearCount += 1;
          items[index].lastWorn = new Date().toISOString();
          return true;
        }
        return false;
      };

      const updated = incrementArray(wardrobe.shirts) || incrementArray(wardrobe.pants);
      
      if (updated) {
        await AsyncStorage.setItem(WARDROBE_KEY, JSON.stringify(wardrobe));
      }
    } catch (error) {
      console.error('Error incrementing wear count:', error);
    }
  }
}