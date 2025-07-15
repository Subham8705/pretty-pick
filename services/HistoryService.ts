import AsyncStorage from '@react-native-async-storage/async-storage';
import { WearHistory } from '@/types/WearHistory';
import { Outfit } from '@/types/Outfit';

const HISTORY_KEY = 'fitmate_wear_history';

export class HistoryService {
  static async getWearHistory(): Promise<WearHistory[]> {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting wear history:', error);
      return [];
    }
  }

  static async addWearHistory(outfit: Outfit, date: Date, notes?: string): Promise<void> {
    try {
      const history = await this.getWearHistory();
      
      const newEntry: WearHistory = {
        id: Date.now().toString(),
        outfit,
        date: date.toISOString(),
        notes,
      };

      history.push(newEntry);
      
      // Sort by date (newest first)
      history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error adding wear history:', error);
    }
  }

  static async deleteWearHistory(id: string): Promise<void> {
    try {
      const history = await this.getWearHistory();
      const filteredHistory = history.filter(entry => entry.id !== id);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
    } catch (error) {
      console.error('Error deleting wear history:', error);
    }
  }

  static async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }

  static async getHistoryForDateRange(startDate: Date, endDate: Date): Promise<WearHistory[]> {
    try {
      const history = await this.getWearHistory();
      return history.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
      });
    } catch (error) {
      console.error('Error getting history for date range:', error);
      return [];
    }
  }

  static async getOutfitWearCount(outfitId: string): Promise<number> {
    try {
      const history = await this.getWearHistory();
      return history.filter(entry => entry.outfit.id === outfitId).length;
    } catch (error) {
      console.error('Error getting outfit wear count:', error);
      return 0;
    }
  }
}