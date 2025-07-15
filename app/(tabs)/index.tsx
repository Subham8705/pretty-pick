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


export default function WardrobeScreen() {
  const [shirts, setShirts] = useState<ClothingItem[]>([]);
  const [pants, setPants] = useState<ClothingItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedType, setSelectedType] = useState<'shirt' | 'pant'>('shirt');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<any>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    headerContent: {
      flex: 1,
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginLeft: 12,
      letterSpacing: -0.5,
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: '400',
      marginLeft: 40,
    addButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    content: {
      flex: 1,
    contentContainer: {
      paddingHorizontal: 24,
      paddingTop: 24,
    bottomSpacer: {
      height: 120,
    section: {
      marginBottom: 40,
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: -0.3,
    countBadge: {
      backgroundColor: colors.borderLight,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 4,
      marginLeft: 12,
    countText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    clothingItem: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
      borderWidth: 1,
      borderColor: colors.border,
    imageContainer: {
      position: 'relative',
    itemImage: {
      width: 80,
      height: 80,
      borderRadius: 16,
      backgroundColor: colors.borderLight,
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 16,
    itemBadge: {
      position: 'absolute',
      top: 6,
      right: 6,
      backgroundColor: 'rgba(139, 92, 246, 0.9)',
      borderRadius: 8,
      paddingHorizontal: 6,
      paddingVertical: 2,
    badgeText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#FFFFFF',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    itemInfo: {
      flex: 1,
      marginLeft: 16,
      justifyContent: 'center',
    itemName: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
      letterSpacing: -0.2,
    itemDetails: {
      fontSize: 15,
      color: colors.textSecondary,
      marginBottom: 6,
      fontWeight: '500',
    seasonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    itemSeason: {
      fontSize: 13,
      color: colors.primary,
      textTransform: 'capitalize',
      fontWeight: '600',
    wearCount: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: '500',
    itemActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    editButton: {
      backgroundColor: colors.borderLight,
    deleteButton: {
      backgroundColor: '#FEF2F2',
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 8,
    emptySubtitle: {
      fontSize: 15,
      color: colors.textTertiary,
      textAlign: 'center',
      lineHeight: 22,
    modalContainer: {
      flex: 1,
      backgroundColor: colors.surface,
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    modalTitleContainer: {
      flex: 1,
    modalTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
      letterSpacing: -0.3,
    modalSubtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: '500',
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.borderLight,
      justifyContent: 'center',
      alignItems: 'center',
    modalContent: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
    typeSelector: {
      marginBottom: 32,
    label: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
      letterSpacing: -0.2,
    typeButtons: {
      flexDirection: 'row',
      gap: 12,
    typeButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 16,
      backgroundColor: colors.borderLight,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    typeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    typeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    typeButtonTextActive: {
      color: '#FFFFFF',
    imageSection: {
      marginBottom: 32,
    imagePreviewContainer: {
      alignItems: 'center',
    previewImage: {
      width: 160,
      height: 160,
      borderRadius: 20,
      backgroundColor: colors.borderLight,
    retakeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.borderLight,
      borderRadius: 12,
      gap: 6,
    retakeText: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: '600',
    cameraButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
      borderRadius: 20,
      backgroundColor: colors.borderLight,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
    cameraButtonText: {
      fontSize: 18,
      color: colors.primary,
      fontWeight: '600',
      marginTop: 12,
    cameraButtonSubtext: {
      fontSize: 14,
      color: colors.textTertiary,
      marginTop: 4,
    formGroup: {
      marginBottom: 24,
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
    optionButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    optionButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 24,
      backgroundColor: colors.borderLight,
      borderWidth: 2,
      borderColor: colors.border,
    optionButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    optionButtonText: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: '600',
    optionButtonTextActive: {
      color: '#FFFFFF',
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
      shadowColor: colors.primary,
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '700',
      letterSpacing: 0.5,
    cameraContainer: {
      flex: 1,
    camera: {
      flex: 1,
    cameraOverlay: {
      flex: 1,
      backgroundColor: 'transparent',
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
    cameraBottom: {
      position: 'absolute',
      bottom: 60,
      left: 0,
      right: 0,
      alignItems: 'center',
    captureButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    captureButtonInner: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: colors.primary,

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    type: 'casual',
    fabric: '',
    season: 'all',

  useEffect(() => {
    loadWardrobe();

  const loadWardrobe = async () => {
    const wardrobe = await WardrobeService.getWardrobe();
    setShirts(wardrobe.shirts);
    setPants(wardrobe.pants);

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      color: '',
      type: 'casual',
      fabric: '',
      season: 'all',
    setCapturedImage(null);
    setShowAddModal(true);

  const handleEditItem = (item: ClothingItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      color: item.color,
      type: item.type,
      fabric: item.fabric,
      season: item.season,
    setCapturedImage(item.image);
    setSelectedType(item.category);
    setShowAddModal(true);

  const handleSaveItem = async () => {
    if (!formData.name || !capturedImage) {
      Alert.alert('Error', 'Please fill in all fields and take a photo');
      return;

    const itemData = {
      ...formData,
      image: capturedImage,
      category: selectedType,

    if (editingItem) {
      await WardrobeService.updateItem(editingItem.id, itemData);
      await WardrobeService.addItem(itemData);

    setShowAddModal(false);
    loadWardrobe();

  const handleDeleteItem = async (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await WardrobeService.deleteItem(id);
            loadWardrobe();
      ]
    );

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission required', 'Camera access is needed to take photos');
        return;
    setShowCamera(true);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        setCapturedImage(photo.uri);
        setShowCamera(false);
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');

  const renderClothingItem = (item: ClothingItem) => (
          </View>
        </View>
      </View>
        </Text>
        </View>
      </View>
        <TouchableOpacity
        >
        </TouchableOpacity>
        <TouchableOpacity
        >
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
          </View>
        </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
      >
            </View>
          </View>
          {shirts.length === 0 ? (
            </View>
          ) : (
            shirts.map(renderClothingItem)
        </View>

            </View>
          </View>
          {pants.length === 0 ? (
            </View>
          ) : (
            pants.map(renderClothingItem)
        </View>

      </ScrollView>

              </Text>
              </Text>
            </View>
            <TouchableOpacity 
            >
            </TouchableOpacity>
          </View>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    selectedType === 'shirt' && styles.typeButtonActive,
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      selectedType === 'shirt' && styles.typeButtonTextActive,
                  >
                    Shirt
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    selectedType === 'pant' && styles.typeButtonActive,
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      selectedType === 'pant' && styles.typeButtonTextActive,
                  >
                    Pants
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

              {capturedImage ? (
                  </TouchableOpacity>
                </View>
              ) : (
                </TouchableOpacity>
            </View>

              <TextInput
                placeholder="e.g., Blue Oxford Shirt"
                placeholderTextColor="#9CA3AF"
              />
            </View>

              <TextInput
                placeholder="e.g., Navy Blue"
                placeholderTextColor="#9CA3AF"
              />
            </View>

                {['casual', 'formal', 'party'].map((style) => (
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      formData.type === style && styles.optionButtonActive,
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        formData.type === style && styles.optionButtonTextActive,
                    >
                    </Text>
                  </TouchableOpacity>
              </View>
            </View>

              <TextInput
                placeholder="e.g., Cotton, Wool, Silk"
                placeholderTextColor="#9CA3AF"
              />
            </View>

                {['all', 'summer', 'winter', 'spring', 'fall'].map((season) => (
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      formData.season === season && styles.optionButtonActive,
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        formData.season === season && styles.optionButtonTextActive,
                    >
                    </Text>
                  </TouchableOpacity>
              </View>
            </View>

              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

          <CameraView
          >
              <TouchableOpacity
              >
              </TouchableOpacity>
                <TouchableOpacity
                >
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
    </View>
  );
