import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { User, Bell, Palette, Shield, CircleHelp as HelpCircle, LogOut, Trash2, Download, Upload, ChevronRight, Sparkles } from 'lucide-react-native';
import { WardrobeService } from '@/services/WardrobeService';
import { HistoryService } from '@/services/HistoryService';
import { useTheme } from '@/hooks/useTheme';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [weeklyReminders, setWeeklyReminders] = useState(true);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const { isDarkMode, toggleTheme, colors } = useTheme();

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
    content: {
      flex: 1,
    },
    contentContainer: {
      paddingTop: 24,
    },
    bottomSpacer: {
      height: 120,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      marginHorizontal: 24,
      letterSpacing: -0.2,
    },
    sectionContent: {
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    destructiveIcon: {
      backgroundColor: '#FEF2F2',
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
      letterSpacing: -0.1,
    },
    settingSubtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    destructiveText: {
      color: '#EF4444',
    },
    footer: {
      padding: 40,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 6,
      letterSpacing: -0.1,
    },
    footerSubtext: {
      fontSize: 14,
      color: colors.textTertiary,
      fontWeight: '500',
    },
  });

  const handleClearWardrobe = () => {
    Alert.alert(
      'Clear Wardrobe',
      'This will permanently delete all your clothing items. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await WardrobeService.clearWardrobe();
            Alert.alert('Success', 'Wardrobe cleared successfully');
          },
        },
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'This will permanently delete all your outfit history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await HistoryService.clearHistory();
            Alert.alert('Success', 'History cleared successfully');
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    try {
      Alert.alert('Export Data', 'Data export functionality would be implemented here');
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleImportData = async () => {
    try {
      Alert.alert('Import Data', 'Data import functionality would be implemented here');
    } catch (error) {
      Alert.alert('Error', 'Failed to import data');
    }
  };

  const renderSettingItem = (
    icon: any,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode,
    destructive = false
  ) => {
    const IconComponent = icon;
    
    return (
      <TouchableOpacity
        style={styles.settingItem}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={[styles.settingIcon, destructive && styles.destructiveIcon]}>
          <IconComponent 
            size={20} 
            color={destructive ? '#EF4444' : '#8B5CF6'}
            strokeWidth={2.5}
          />
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, destructive && styles.destructiveText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
        {rightElement || (
          onPress && <ChevronRight size={20} color="#9CA3AF" />
        )}
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Sparkles size={28} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Customize your FitMate experience</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderSection('Profile', (
          <>
            {renderSettingItem(
              User,
              'Profile Information',
              'Update your personal details',
              () => Alert.alert('Profile', 'Profile settings would open here')
            )}
          </>
        ))}

        {renderSection('Preferences', (
          <>
            {renderSettingItem(
              Bell,
              'Notifications',
              'Enable push notifications',
              undefined,
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#F3F4F6', true: '#8B5CF6' }}
                thumbColor={notifications ? '#FFFFFF' : '#9CA3AF'}
              />
            )}
            {renderSettingItem(
              Bell,
              'Weekly Reminders',
              'Get reminded about new weekly outfits',
              undefined,
              <Switch
                value={weeklyReminders}
                onValueChange={setWeeklyReminders}
                trackColor={{ false: '#F3F4F6', true: '#8B5CF6' }}
                thumbColor={weeklyReminders ? '#FFFFFF' : '#9CA3AF'}
              />
            )}
            {renderSettingItem(
              Palette,
              'Auto-Generate Outfits',
              'Automatically create weekly outfit suggestions',
              undefined,
              <Switch
                value={autoGenerate}
                onValueChange={setAutoGenerate}
                trackColor={{ false: '#F3F4F6', true: '#8B5CF6' }}
                thumbColor={autoGenerate ? '#FFFFFF' : '#9CA3AF'}
              />
            )}
            {renderSettingItem(
              Palette,
              'Dark Mode',
              'Switch to dark theme',
              undefined,
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor={isDarkMode ? '#FFFFFF' : colors.textTertiary}
              />
            )}
          </>
        ))}

        {renderSection('Data Management', (
          <>
            {renderSettingItem(
              Download,
              'Export Data',
              'Download your wardrobe and history',
              handleExportData
            )}
            {renderSettingItem(
              Upload,
              'Import Data',
              'Restore from backup file',
              handleImportData
            )}
          </>
        ))}

        {renderSection('Privacy & Security', (
          <>
            {renderSettingItem(
              Shield,
              'Privacy Settings',
              'Manage your data and privacy',
              () => Alert.alert('Privacy', 'Privacy settings would open here')
            )}
            {renderSettingItem(
              Shield,
              'Data Usage',
              'View how your data is used',
              () => Alert.alert('Data Usage', 'Data usage details would be shown here')
            )}
          </>
        ))}

        {renderSection('Support', (
          <>
            {renderSettingItem(
              HelpCircle,
              'Help & Support',
              'Get help and contact support',
              () => Alert.alert('Support', 'Support options would be shown here')
            )}
            {renderSettingItem(
              HelpCircle,
              'About FitMate',
              'Version 1.0.0',
              () => Alert.alert('About', 'FitMate v1.0.0\nIntelligent wardrobe management')
            )}
          </>
        ))}

        {renderSection('Danger Zone', (
          <>
            {renderSettingItem(
              Trash2,
              'Clear Wardrobe',
              'Delete all clothing items',
              handleClearWardrobe,
              undefined,
              true
            )}
            {renderSettingItem(
              Trash2,
              'Clear History',
              'Delete all outfit history',
              handleClearHistory,
              undefined,
              true
            )}
            {renderSettingItem(
              LogOut,
              'Reset App',
              'Clear all data and reset app',
              () => Alert.alert('Reset', 'Reset functionality would be implemented here'),
              undefined,
              true
            )}
          </>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            FitMate - Intelligent Wardrobe Management
          </Text>
          <Text style={styles.footerSubtext}>
            Version 1.0.0 • Made with ❤️
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}