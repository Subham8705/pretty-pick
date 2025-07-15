import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { Plus, CreditCard as Edit2, Trash2, Camera, X, Sparkles } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { WardrobeService } from '@/services/WardrobeService';
import { ClothingItem } from '@/types/ClothingItem';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');

export default function WardrobeScreen() {
  const [shirts, setShirts] = useState<ClothingItem[]>([]);
  const [pants, setPants] = useState<ClothingItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedType, setSelectedType] = useState<'shirt' | 'pant'>('shirt');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { colors } = useTheme();
  const [cameraRef, setCameraRef] = useState<any>(null);

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
      fontWeight: '400',
      marginLeft: 40,
    },
    addButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
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
    sectionHeader: {
      flexDirection: 'row',
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
      marginLeft: 12,
    },
    countText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    clothingItem: {
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
    imageContainer: {
      position: 'relative',
    },
    itemImage: {
      width: 80,
      height: 80,
      borderRadius: 16,
      backgroundColor: colors.borderLight,
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 16,
    },
    itemBadge: {
      position: 'absolute',
      top: 6,
      right: 6,
      backgroundColor: 'rgba(139, 92, 246, 0.9)',
      borderRadius: 8,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#FFFFFF',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    itemInfo: {
      flex: 1,
      marginLeft: 16,
      justifyContent: 'center',
    },
    itemName: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
      letterSpacing: -0.2,
    },
    itemDetails: {
      fontSize: 15,
      color: colors.textSecondary,
      marginBottom: 6,
      fontWeight: '500',
    },
    seasonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemSeason: {
      fontSize: 13,
      color: colors.primary,
      textTransform: 'capitalize',
      fontWeight: '600',
    },
    wearCount: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: '500',
    },
    itemActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    editButton: {
      backgroundColor: colors.borderLight,
    },
    deleteButton: {
      backgroundColor: '#FEF2F2',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 15,
      color: colors.textTertiary,
      textAlign: 'center',
      lineHeight: 22,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitleContainer: {
      flex: 1,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
      letterSpacing: -0.3,
    },
    modalSubtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.borderLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    typeSelector: {
      marginBottom: 32,
    },
    label: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
      letterSpacing: -0.2,
    },
    typeButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    typeButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 16,
      backgroundColor: colors.borderLight,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    },
    typeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    typeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    typeButtonTextActive: {
      color: '#FFFFFF',
    },
    imageSection: {
      marginBottom: 32,
    },
    imagePreviewContainer: {
      alignItems: 'center',
    },
    previewImage: {
      width: 160,
      height: 160,
      borderRadius: 20,
      backgroundColor: colors.borderLight,
    },
    retakeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.borderLight,
      borderRadius: 12,
      gap: 6,
    },
    retakeText: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: '600',
    },
    cameraButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
      borderRadius: 20,
      backgroundColor: colors.borderLight,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
    },
    cameraButtonText: {
      fontSize: 18,
      color: colors.primary,
      fontWeight: '600',
      marginTop: 12,
    },
    cameraButtonSubtext: {
      fontSize: 14,
      color: colors.textTertiary,
      marginTop: 4,
    },
    formGroup: {
      marginBottom: 24,
    },
    input: {
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.background,
      fontWeight: '500',
    },
    optionButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    optionButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 24,
      backgroundColor: colors.borderLight,
      borderWidth: 2,
      borderColor: colors.border,
    },
    optionButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    optionButtonText: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    optionButtonTextActive: {
      color: '#FFFFFF',
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    cameraContainer: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    cameraOverlay: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    closeCameraButton: {
      position: 'absolute',
      top: 60,
      right: 24,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cameraBottom: {
      position: 'absolute',
      bottom: 60,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    captureButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    captureButtonInner: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: colors.primary,
    },
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    type: 'casual',
    fabric: '',
    season: 'all',
  });

  useEffect(() => {
    loadWardrobe();
  }, []);

  const loadWardrobe = async () => {
    const wardrobe = await WardrobeService.getWardrobe();
    setShirts(wardrobe.shirts);
    setPants(wardrobe.pants);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      color: '',
      type: 'casual',
      fabric: '',
      season: 'all',
    });
    setCapturedImage(null);
    setShowAddModal(true);
  };

  const handleEditItem = (item: ClothingItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      color: item.color,
      type: item.type,
      fabric: item.fabric,
      season: item.season,
    });
    setCapturedImage(item.image);
    setSelectedType(item.category);
    setShowAddModal(true);
  };

  const handleSaveItem = async () => {
    if (!formData.name || !capturedImage) {
      Alert.alert('Error', 'Please fill in all fields and take a photo');
      return;
    }

    const itemData = {
      ...formData,
      image: capturedImage,
      category: selectedType,
    };

    if (editingItem) {
      await WardrobeService.updateItem(editingItem.id, itemData);
    } else {
      await WardrobeService.addItem(itemData);
    }

    setShowAddModal(false);
    loadWardrobe();
  };

  const handleDeleteItem = async (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await WardrobeService.deleteItem(id);
            loadWardrobe();
          },
        },
      ]
    );
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission required', 'Camera access is needed to take photos');
        return;
      }
    }
    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        setCapturedImage(photo.uri);
        setShowCamera(false);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const renderClothingItem = (item: ClothingItem) => (
    <View key={item.id} style={styles.clothingItem}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.imageOverlay}>
          <View style={styles.itemBadge}>
            <Text style={styles.badgeText}>{item.type}</Text>
          </View>
        </View>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>
          {item.color} • {item.fabric}
        </Text>
        <View style={styles.seasonContainer}>
          <Text style={styles.itemSeason}>{item.season}</Text>
          <Text style={styles.wearCount}>{item.wearCount} wears</Text>
        </View>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditItem(item)}
        >
          <Edit2 size={16} color="#8B5CF6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteItem(item.id)}
        >
          <Trash2 size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Sparkles size={28} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text }]}>My Wardrobe</Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Curate your perfect style</Text>
        </View>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={handleAddItem}>
          <Plus size={22} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shirts</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{shirts.length}</Text>
            </View>
          </View>
          {shirts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No shirts yet</Text>
              <Text style={styles.emptySubtitle}>Add your first shirt to get started</Text>
            </View>
          ) : (
            shirts.map(renderClothingItem)
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pants</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{pants.length}</Text>
            </View>
          </View>
          {pants.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No pants yet</Text>
              <Text style={styles.emptySubtitle}>Add your first pair to complete your wardrobe</Text>
            </View>
          ) : (
            pants.map(renderClothingItem)
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {editingItem ? 'Update your wardrobe item' : 'Expand your collection'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAddModal(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.typeSelector}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    selectedType === 'shirt' && styles.typeButtonActive,
                  ]}
                  onPress={() => setSelectedType('shirt')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      selectedType === 'shirt' && styles.typeButtonTextActive,
                    ]}
                  >
                    Shirt
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    selectedType === 'pant' && styles.typeButtonActive,
                  ]}
                  onPress={() => setSelectedType('pant')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      selectedType === 'pant' && styles.typeButtonTextActive,
                    ]}
                  >
                    Pants
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.imageSection}>
              <Text style={styles.label}>Photo</Text>
              {capturedImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: capturedImage }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.retakeButton} onPress={openCamera}>
                    <Camera size={16} color="#8B5CF6" />
                    <Text style={styles.retakeText}>Retake Photo</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
                  <Camera size={28} color="#8B5CF6" />
                  <Text style={styles.cameraButtonText}>Take Photo</Text>
                  <Text style={styles.cameraButtonSubtext}>Capture your item clearly</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="e.g., Blue Oxford Shirt"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Color</Text>
              <TextInput
                style={styles.input}
                value={formData.color}
                onChangeText={(text) => setFormData({ ...formData, color: text })}
                placeholder="e.g., Navy Blue"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Style</Text>
              <View style={styles.optionButtons}>
                {['casual', 'formal', 'party'].map((style) => (
                  <TouchableOpacity
                    key={style}
                    style={[
                      styles.optionButton,
                      formData.type === style && styles.optionButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, type: style })}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        formData.type === style && styles.optionButtonTextActive,
                      ]}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Fabric</Text>
              <TextInput
                style={styles.input}
                value={formData.fabric}
                onChangeText={(text) => setFormData({ ...formData, fabric: text })}
                placeholder="e.g., Cotton, Wool, Silk"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Season</Text>
              <View style={styles.optionButtons}>
                {['all', 'summer', 'winter', 'spring', 'fall'].map((season) => (
                  <TouchableOpacity
                    key={season}
                    style={[
                      styles.optionButton,
                      formData.season === season && styles.optionButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, season })}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        formData.season === season && styles.optionButtonTextActive,
                      ]}
                    >
                      {season.charAt(0).toUpperCase() + season.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveItem}>
              <Text style={styles.saveButtonText}>
                {editingItem ? 'Update Item' : 'Add to Wardrobe'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Camera Modal */}
      <Modal visible={showCamera} animationType="slide">
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            ref={(ref) => setCameraRef(ref)}
              if (ref) {
                const takePhoto = () => takePicture();
                (ref as any).takePhoto = takePhoto;
              }
            }}
          >
            <View style={styles.cameraOverlay}>
              <TouchableOpacity
                style={styles.closeCameraButton}
                onPress={() => setShowCamera(false)}
              >
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.cameraBottom}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={() => {
                    const camera = arguments[0];
                    if (camera?.takePhoto) {
                      camera.takePhoto();
                    }
                  }}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
    </View>
  );
}