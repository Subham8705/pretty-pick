import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { RefreshCw, Heart, Calendar, Share2, Sparkles, Crown } from 'lucide-react-native';
import { WardrobeService } from '@/services/WardrobeService';
import { OutfitService } from '@/services/OutfitService';
import { ClothingItem } from '@/types/ClothingItem';
import { Outfit } from '@/types/Outfit';
import { useTheme } from '@/hooks/useTheme';

export default function WeeklyFitScreen() {
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null);
  const [alternativeOutfits, setAlternativeOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekNumber, setWeekNumber] = useState(0);
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
    refreshButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.borderLight,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    bottomSpacer: {
      height: 120,
    },
    section: {
      marginBottom: 40,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 20,
      letterSpacing: -0.3,
    },
    outfitCard: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    mainOutfitCard: {
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    crownContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: '#FEF3C7',
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    crownText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#D97706',
      marginLeft: 6,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    outfitImages: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 20,
    },
    imageContainer: {
      position: 'relative',
    },
    outfitImage: {
      width: 100,
      height: 100,
      borderRadius: 16,
      backgroundColor: colors.borderLight,
    },
    imageLabel: {
      position: 'absolute',
      bottom: -8,
      left: 0,
      right: 0,
      backgroundColor: colors.text,
      borderRadius: 8,
      paddingVertical: 4,
      alignItems: 'center',
    },
    imageLabelText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.background,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    outfitInfo: {
      marginBottom: 20,
    },
    outfitTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
      letterSpacing: -0.2,
    },
    outfitMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    outfitSubtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    matchScoreContainer: {
      backgroundColor: '#DCFCE7',
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    matchScore: {
      fontSize: 13,
      fontWeight: '700',
      color: '#16A34A',
    },
    styleNote: {
      fontSize: 14,
      color: colors.primary,
      fontStyle: 'italic',
      lineHeight: 20,
    },
    outfitActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
    },
    actionButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.borderLight,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    },
    favoriteActive: {
      backgroundColor: '#EF4444',
      borderColor: '#EF4444',
    },
    wearButton: {
      flexDirection: 'row',
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
      gap: 8,
    },
    wearButtonText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    alternativeButton: {
      marginBottom: 0,
    },
    tipCard: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    tipIcon: {
      fontSize: 20,
      marginRight: 16,
    },
    tipText: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      lineHeight: 22,
      fontWeight: '500',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: {
      fontSize: 18,
      color: colors.textSecondary,
      marginTop: 16,
      fontWeight: '500',
    },
  });

  useEffect(() => {
    loadWeeklyFit();
  }, []);

  const loadWeeklyFit = async () => {
    setLoading(true);
    try {
      const wardrobe = await WardrobeService.getWardrobe();
      const outfits = OutfitService.generateOutfitSuggestions(wardrobe);
      
      if (outfits.length > 0) {
        const currentWeek = getCurrentWeekNumber();
        setWeekNumber(currentWeek);
        
        const weeklyOutfit = await OutfitService.getWeeklyOutfit(currentWeek);
        if (weeklyOutfit) {
          setCurrentOutfit(weeklyOutfit);
        } else {
          const newWeeklyOutfit = outfits[0];
          await OutfitService.saveWeeklyOutfit(currentWeek, newWeeklyOutfit);
          setCurrentOutfit(newWeeklyOutfit);
        }
        
        setAlternativeOutfits(outfits.slice(1, 4));
      }
    } catch (error) {
      console.error('Error loading weekly fit:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentWeekNumber = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  };

  const handleGenerateNew = async () => {
    Alert.alert(
      'Generate New Outfit',
      'This will replace your current weekly outfit. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            const wardrobe = await WardrobeService.getWardrobe();
            const outfits = OutfitService.generateOutfitSuggestions(wardrobe);
            
            if (outfits.length > 0) {
              const newOutfit = outfits[Math.floor(Math.random() * outfits.length)];
              await OutfitService.saveWeeklyOutfit(weekNumber, newOutfit);
              setCurrentOutfit(newOutfit);
            }
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async () => {
    if (!currentOutfit) return;
    
    const updatedOutfit = {
      ...currentOutfit,
      isFavorite: !currentOutfit.isFavorite,
    };
    
    await OutfitService.updateOutfit(updatedOutfit);
    setCurrentOutfit(updatedOutfit);
    
    // Show feedback to user
    if (updatedOutfit.isFavorite) {
      Alert.alert('Added to Favorites! ❤️', 'You can view this outfit in History > Favorites tab');
    } else {
      Alert.alert('Removed from Favorites', 'Outfit removed from your favorites');
    }
  };

  const handleWearToday = async () => {
    if (!currentOutfit) return;
    
    await OutfitService.markAsWorn(currentOutfit, new Date());
    Alert.alert('Perfect!', 'Outfit added to your history. You look amazing! ✨');
  };

  const handleShareOutfit = () => {
    if (!currentOutfit) return;
    
    Alert.alert(
      'Share Outfit',
      `Share your "${currentOutfit.shirt.name} + ${currentOutfit.pant.name}" outfit?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Share',
          onPress: () => {
            // In a real app, this would integrate with native sharing
            Alert.alert('Shared!', 'Your outfit has been shared successfully! 📸');
          },
        },
      ]
    );
  };

  const handleSelectAlternative = async (outfit: Outfit) => {
    await OutfitService.saveWeeklyOutfit(weekNumber, outfit);
    setCurrentOutfit(outfit);
  };

  const renderOutfitCard = (outfit: Outfit, isMain = false) => (
    <View style={[styles.outfitCard, isMain && styles.mainOutfitCard]}>
      {isMain && (
        <View style={styles.crownContainer}>
          <Crown size={20} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.crownText}>This Week's Pick</Text>
        </View>
      )}
      
      <View style={styles.outfitImages}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: outfit.shirt.image }} style={styles.outfitImage} />
          <View style={styles.imageLabel}>
            <Text style={styles.imageLabelText}>Shirt</Text>
          </View>
        </View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: outfit.pant.image }} style={styles.outfitImage} />
          <View style={styles.imageLabel}>
            <Text style={styles.imageLabelText}>Pants</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.outfitInfo}>
        <Text style={styles.outfitTitle}>
          {outfit.shirt.name} + {outfit.pant.name}
        </Text>
        <View style={styles.outfitMeta}>
          <Text style={styles.outfitSubtitle}>
            {outfit.occasion} • {outfit.season}
          </Text>
          <View style={styles.matchScoreContainer}>
            <Text style={styles.matchScore}>{outfit.matchScore}% match</Text>
          </View>
        </View>
        
        {outfit.styleNote && (
          <Text style={styles.styleNote}>💡 {outfit.styleNote}</Text>
        )}
      </View>
      
      {isMain && (
        <View style={styles.outfitActions}>
          <TouchableOpacity
            style={[styles.actionButton, outfit.isFavorite && styles.favoriteActive]}
            onPress={handleToggleFavorite}
          >
            <Heart 
              size={18} 
              color={outfit.isFavorite ? '#FFFFFF' : '#EF4444'}
              fill={outfit.isFavorite ? '#FFFFFF' : 'none'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleWearToday}
          >
            <Calendar size={18} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShareOutfit}
          >
            <Share2 size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Sparkles size={32} color="#8B5CF6" />
        <Text style={styles.loadingText}>Curating your perfect look...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Sparkles size={28} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text }]}>Weekly Fit</Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Week {weekNumber} of 2024</Text>
        </View>
        <TouchableOpacity style={[styles.refreshButton, { backgroundColor: colors.borderLight, borderColor: colors.border }]} onPress={handleGenerateNew}>
          <RefreshCw size={20} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {currentOutfit && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Curated Look</Text>
            {renderOutfitCard(currentOutfit, true)}
            
            <TouchableOpacity style={styles.wearButton} onPress={handleWearToday}>
              <Text style={styles.wearButtonText}>Wear This Today</Text>
              <Sparkles size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {alternativeOutfits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alternative Styles</Text>
            {alternativeOutfits.map((outfit, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectAlternative(outfit)}
                style={styles.alternativeButton}
              >
                {renderOutfitCard(outfit)}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Style Insights</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>✨</Text>
            <Text style={styles.tipText}>
              Mix textures and patterns for a more sophisticated look
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>👑</Text>
            <Text style={styles.tipText}>
              Accessories can elevate any outfit from good to exceptional
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>🎨</Text>
            <Text style={styles.tipText}>
              Layer colors from light to dark for visual depth and interest
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}