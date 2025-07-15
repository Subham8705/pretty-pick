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
import { Briefcase, Coffee, PartyPopper, Sun, Snowflake, Sparkles } from 'lucide-react-native';
import { WardrobeService } from '@/services/WardrobeService';
import { OutfitService } from '@/services/OutfitService';
import { Outfit } from '@/types/Outfit';
import { useTheme } from '@/hooks/useTheme';

const occasions = [
  { id: 'casual', name: 'Daily Casual', icon: Coffee, color: '#10B981', bgColor: '#ECFDF5' },
  { id: 'formal', name: 'Office/Formal', icon: Briefcase, color: '#3B82F6', bgColor: '#EFF6FF' },
  { id: 'party', name: 'Party Wear', icon: PartyPopper, color: '#8B5CF6', bgColor: '#F3E8FF' },
  { id: 'summer', name: 'Summer Outfits', icon: Sun, color: '#F59E0B', bgColor: '#FFFBEB' },
  { id: 'winter', name: 'Winter Layered', icon: Snowflake, color: '#6B7280', bgColor: '#F9FAFB' },
];

export default function OccasionsScreen() {
  const [selectedOccasion, setSelectedOccasion] = useState('casual');
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
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
    occasionsScroll: {
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    occasionsContent: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      gap: 12,
    },
    occasionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 24,
      gap: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    occasionButtonText: {
      fontSize: 15,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: -0.3,
    },
    countBadge: {
      backgroundColor: colors.borderLight,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    countText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    outfitsList: {
      paddingBottom: 120,
    },
    outfitItem: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    outfitHeader: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    outfitImages: {
      flexDirection: 'column',
      gap: 8,
      marginRight: 16,
    },
    imageContainer: {
      position: 'relative',
    },
    outfitImage: {
      width: 60,
      height: 60,
      borderRadius: 12,
      backgroundColor: colors.borderLight,
    },
    imageLabel: {
      position: 'absolute',
      bottom: -4,
      left: 0,
      right: 0,
      backgroundColor: colors.text,
      borderRadius: 4,
      paddingVertical: 2,
      alignItems: 'center',
    },
    imageLabelText: {
      fontSize: 8,
      fontWeight: '600',
      color: colors.background,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    outfitDetails: {
      flex: 1,
      justifyContent: 'center',
    },
    outfitTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
      letterSpacing: -0.2,
    },
    outfitSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 6,
      fontWeight: '500',
    },
    matchScoreContainer: {
      backgroundColor: colors.success + '20',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      alignSelf: 'flex-start',
    },
    matchScore: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.success,
    },
    styleNote: {
      fontSize: 13,
      color: colors.primary,
      fontStyle: 'italic',
      lineHeight: 18,
      marginBottom: 12,
    },
    outfitActions: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: colors.borderLight,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    },
    favoriteButton: {
      backgroundColor: '#FEF2F2',
      borderColor: '#FCA5A5',
    },
    actionButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    favoriteButtonText: {
      color: '#DC2626',
    },
    wearButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    wearButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    loadingText: {
      fontSize: 18,
      color: colors.textSecondary,
      marginTop: 16,
      fontWeight: '500',
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
    loadOutfits();
  }, [selectedOccasion]);

  const loadOutfits = async () => {
    setLoading(true);
    try {
      const wardrobe = await WardrobeService.getWardrobe();
      const filteredOutfits = OutfitService.getOutfitsByOccasion(wardrobe, selectedOccasion);
      setOutfits(filteredOutfits);
    } catch (error) {
      console.error('Error loading outfits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsFavorite = async (outfit: Outfit) => {
    const updatedOutfit = {
      ...outfit,
      isFavorite: !outfit.isFavorite,
    };
    await OutfitService.updateOutfit(updatedOutfit);
    loadOutfits();
  };

  const handleWearOutfit = async (outfit: Outfit) => {
    await OutfitService.markAsWorn(outfit, new Date());
    loadOutfits();
  };

  const renderOccasionButton = (occasion: any) => {
    const IconComponent = occasion.icon;
    const isSelected = selectedOccasion === occasion.id;
    
    return (
      <TouchableOpacity
        key={occasion.id}
        style={[
          styles.occasionButton,
          { backgroundColor: isSelected ? occasion.color : occasion.bgColor },
        ]}
        onPress={() => setSelectedOccasion(occasion.id)}
      >
        <IconComponent 
          size={20} 
          color={isSelected ? '#FFFFFF' : occasion.color}
          strokeWidth={2.5}
        />
        <Text
          style={[
            styles.occasionButtonText,
            { color: isSelected ? '#FFFFFF' : occasion.color },
          ]}
        >
          {occasion.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOutfitItem = ({ item }: { item: Outfit }) => (
    <View style={styles.outfitItem}>
      <View style={styles.outfitHeader}>
        <View style={styles.outfitImages}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.shirt.image }} style={styles.outfitImage} />
            <View style={styles.imageLabel}>
              <Text style={styles.imageLabelText}>Shirt</Text>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.pant.image }} style={styles.outfitImage} />
            <View style={styles.imageLabel}>
              <Text style={styles.imageLabelText}>Pants</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.outfitDetails}>
          <Text style={styles.outfitTitle}>
            {item.shirt.name} + {item.pant.name}
          </Text>
          <Text style={styles.outfitSubtitle}>
            {item.shirt.color} • {item.pant.color}
          </Text>
          <View style={styles.matchScoreContainer}>
            <Text style={styles.matchScore}>
              {item.matchScore}% match
            </Text>
          </View>
        </View>
      </View>
      
      {item.styleNote && (
        <Text style={styles.styleNote}>💡 {item.styleNote}</Text>
      )}
      
      <View style={styles.outfitActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            item.isFavorite && styles.favoriteButton,
          ]}
          onPress={() => handleMarkAsFavorite(item)}
        >
          <Text
            style={[
              styles.actionButtonText,
              item.isFavorite && styles.favoriteButtonText,
            ]}
          >
            {item.isFavorite ? 'Favorited' : 'Favorite'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.wearButton}
          onPress={() => handleWearOutfit(item)}
        >
          <Text style={styles.wearButtonText}>Wear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getSelectedOccasion = () => {
    return occasions.find(o => o.id === selectedOccasion);
  };

  const selectedOccasionData = getSelectedOccasion();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Sparkles size={28} color="#8B5CF6" />
            <Text style={styles.title}>Occasions</Text>
          </View>
          <Text style={styles.subtitle}>Find the perfect outfit for any event</Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.occasionsScroll}
        contentContainerStyle={styles.occasionsContent}
      >
        {occasions.map(renderOccasionButton)}
      </ScrollView>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedOccasionData?.name} Outfits
          </Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {outfits.length} outfit{outfits.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Sparkles size={32} color="#8B5CF6" />
            <Text style={styles.loadingText}>Loading outfits...</Text>
          </View>
        ) : outfits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No outfits found</Text>
            <Text style={styles.emptySubtitle}>
              Add more items to your wardrobe to get outfit suggestions
            </Text>
          </View>
        ) : (
          <FlatList
            data={outfits}
            renderItem={renderOutfitItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.outfitsList}
          />
        )}
      </View>
    </View>
  );
}