import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Calendar, Heart, Trash2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react-native';
import { HistoryService } from '@/services/HistoryService';
import { OutfitService } from '@/services/OutfitService';
import { WearHistory } from '@/types/WearHistory';
import { useTheme } from '@/hooks/useTheme';

export default function HistoryScreen() {
  const [history, setHistory] = useState<WearHistory[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [calendarView, setCalendarView] = useState(false);
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 24,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerContent: {
      flex: 1,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginLeft: 12,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: '500',
      marginLeft: 40,
    },
    viewToggle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.borderLight,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 20,
      alignItems: 'center',
    },
    activeTab: {
      borderBottomWidth: 3,
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.textSecondary,
      letterSpacing: 0.3,
    },
    activeTabText: {
      color: colors.primary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    monthNavigator: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    monthButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.borderLight,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    },
    monthText: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: -0.3,
    },
    calendarContainer: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    calendarHeader: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    calendarHeaderDay: {
      flex: 1,
      textAlign: 'center',
      fontSize: 13,
      fontWeight: '700',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    calendarDayContainer: {
      width: '14.28%',
      aspectRatio: 1,
      padding: 2,
    },
    calendarDay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      position: 'relative',
    },
    calendarDayWithOutfit: {
      backgroundColor: colors.primary + '20',
    },
    calendarDayToday: {
      backgroundColor: colors.primary,
    },
    emptyCalendarDay: {
      flex: 1,
    },
    calendarDayText: {
      fontSize: 15,
      color: colors.text,
      fontWeight: '600',
    },
    calendarDayTextWithOutfit: {
      color: colors.primary,
      fontWeight: '700',
    },
    calendarDayTextToday: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    outfitDot: {
      position: 'absolute',
      bottom: 4,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
    },
    historyList: {
      paddingBottom: 120,
    },
    historyItem: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    historyDate: {
      width: 70,
      alignItems: 'center',
      justifyContent: 'center',
    },
    historyDateText: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
      fontWeight: '600',
    },
    historyOutfit: {
      flex: 1,
      flexDirection: 'row',
      marginLeft: 16,
    },
    outfitImages: {
      flexDirection: 'row',
      gap: 8,
    },
    imageContainer: {
      position: 'relative',
    },
    historyImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      backgroundColor: colors.borderLight,
    },
    imageLabel: {
      position: 'absolute',
      bottom: -4,
      left: 0,
      right: 0,
      backgroundColor: colors.text,
      borderRadius: 4,
      paddingVertical: 1,
      alignItems: 'center',
    },
    imageLabelText: {
      fontSize: 8,
      fontWeight: '600',
      color: colors.background,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    historyDetails: {
      flex: 1,
      marginLeft: 16,
      justifyContent: 'center',
    },
    historyTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
      letterSpacing: -0.1,
    },
    historySubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 4,
      fontWeight: '500',
    },
    historyNotes: {
      fontSize: 13,
      color: colors.primary,
      fontStyle: 'italic',
    },
    deleteButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#FEF2F2',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    favoritesList: {
      paddingBottom: 120,
    },
    favoriteItem: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    favoriteImage: {
      width: 60,
      height: 60,
      borderRadius: 10,
      backgroundColor: colors.borderLight,
    },
    favoriteDetails: {
      flex: 1,
      marginLeft: 16,
      justifyContent: 'center',
    },
    favoriteTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 6,
      letterSpacing: -0.2,
    },
    favoriteSubtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      marginBottom: 6,
      fontWeight: '500',
    },
    matchScoreContainer: {
      backgroundColor: '#DCFCE7',
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
      alignSelf: 'flex-start',
    },
    favoriteScore: {
      fontSize: 13,
      color: '#16A34A',
      fontWeight: '700',
    },
    favoriteButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#FEF2F2',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: 40,
      lineHeight: 24,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const historyData = await HistoryService.getWearHistory();
    const favoriteOutfits = await OutfitService.getFavoriteOutfits();
    setHistory(historyData);
    setFavorites(favoriteOutfits);
  };

  const deleteHistoryItem = async (id: string) => {
    await HistoryService.deleteWearHistory(id);
    loadData();
  };

  const toggleFavorite = async (outfit: any) => {
    const updatedOutfit = {
      ...outfit,
      isFavorite: !outfit.isFavorite,
    };
    await OutfitService.updateOutfit(updatedOutfit);
    loadData();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedMonth(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const dayHistory = history.filter(h => 
        new Date(h.date).toDateString() === dayDate.toDateString()
      );
      days.push({
        day,
        date: dayDate,
        history: dayHistory,
      });
    }
    
    return days;
  };

  const renderCalendarDay = (dayData: any) => {
    if (!dayData) {
      return <View style={styles.emptyCalendarDay} />;
    }

    const hasOutfit = dayData.history.length > 0;
    const isToday = dayData.date.toDateString() === new Date().toDateString();

    return (
      <TouchableOpacity
        style={[
          styles.calendarDay,
          hasOutfit && styles.calendarDayWithOutfit,
          isToday && styles.calendarDayToday,
        ]}
      >
        <Text
          style={[
            styles.calendarDayText,
            hasOutfit && styles.calendarDayTextWithOutfit,
            isToday && styles.calendarDayTextToday,
          ]}
        >
          {dayData.day}
        </Text>
        {hasOutfit && <View style={styles.outfitDot} />}
      </TouchableOpacity>
    );
  };

  const renderHistoryItem = ({ item }: { item: WearHistory }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyDate}>
        <Text style={styles.historyDateText}>
          {new Date(item.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
      </View>
      
      <View style={styles.historyOutfit}>
        <View style={styles.outfitImages}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.outfit.shirt.image }} style={styles.historyImage} />
          </View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.outfit.pant.image }} style={styles.historyImage} />
          </View>
        </View>
        
        <View style={styles.historyDetails}>
          <Text style={styles.historyTitle}>
            {item.outfit.shirt.name} + {item.outfit.pant.name}
          </Text>
          <Text style={styles.historySubtitle}>
            {item.outfit.occasion} • {item.outfit.season}
          </Text>
          {item.notes && (
            <Text style={styles.historyNotes}>💭 {item.notes}</Text>
          )}
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteHistoryItem(item.id)}
      >
        <Trash2 size={16} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  const renderFavoriteItem = ({ item }: { item: any }) => (
    <View style={styles.favoriteItem}>
      <View style={styles.outfitImages}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.shirt.image }} style={styles.favoriteImage} />
          <View style={styles.imageLabel}>
            <Text style={styles.imageLabelText}>Shirt</Text>
          </View>
        </View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.pant.image }} style={styles.favoriteImage} />
          <View style={styles.imageLabel}>
            <Text style={styles.imageLabelText}>Pants</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.favoriteDetails}>
        <Text style={styles.favoriteTitle}>
          {item.shirt.name} + {item.pant.name}
        </Text>
        <Text style={styles.favoriteSubtitle}>
          {item.occasion} • {item.season}
        </Text>
        <View style={styles.matchScoreContainer}>
          <Text style={styles.favoriteScore}>
            {item.matchScore}% match
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item)}
      >
        <Heart 
          size={20} 
          color="#EF4444" 
          fill="#EF4444"
        />
      </TouchableOpacity>
    </View>
  );

  const filteredHistory = history.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth() === selectedMonth.getMonth() &&
           itemDate.getFullYear() === selectedMonth.getFullYear();
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Sparkles size={28} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text }]}>History</Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Track your style journey</Text>
        </View>
        <TouchableOpacity
          style={[styles.viewToggle, { backgroundColor: colors.borderLight, borderColor: colors.border }]}
          onPress={() => setCalendarView(!calendarView)}
        >
          <Calendar size={20} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'history' && (
          <>
            <View style={styles.monthNavigator}>
              <TouchableOpacity
                style={styles.monthButton}
                onPress={() => navigateMonth('prev')}
              >
                <ChevronLeft size={20} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.monthText}>{getMonthName(selectedMonth)}</Text>
              <TouchableOpacity
                style={styles.monthButton}
                onPress={() => navigateMonth('next')}
              >
                <ChevronRight size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {calendarView ? (
              <View style={styles.calendarContainer}>
                <View style={styles.calendarHeader}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <Text key={day} style={styles.calendarHeaderDay}>
                      {day}
                    </Text>
                  ))}
                </View>
                <View style={styles.calendarGrid}>
                  {getDaysInMonth(selectedMonth).map((day, index) => (
                    <View key={index} style={styles.calendarDayContainer}>
                      {renderCalendarDay(day)}
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <FlatList
                data={filteredHistory}
                renderItem={renderHistoryItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.historyList}
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>No outfits worn this month</Text>
                    <Text style={styles.emptySubtitle}>
                      Start wearing outfits to build your style history
                    </Text>
                  </View>
                )}
              />
            )}
          </>
        )}

        {activeTab === 'favorites' && (
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.favoritesList}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No favorite outfits</Text>
                <Text style={styles.emptySubtitle}>
                  Mark outfits as favorites to see them here
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}