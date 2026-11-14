import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { RootStackScreenProps } from '../navigation/types';
import { useResponsive } from '../utils/responsive';

export const SettingsScreen: React.FC<RootStackScreenProps<'Settings'>> = ({ navigation }) => {
  const { themeMode, setThemeMode, colors } = useTheme();
  const { formMaxWidth, isDesktop, isTablet } = useResponsive();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showTips, setShowTips] = useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.innerContent, { maxWidth: formMaxWidth }]}>
        <ScreenHeader title="Settings" showBack />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Appearance Section */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          <View style={[styles.segmentedControl, { backgroundColor: colors.surface }]}>
            {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => {
              const isSelected = themeMode === mode;
              return (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.segmentOption,
                    { backgroundColor: isSelected ? colors.primary : 'transparent' },
                  ]}
                  onPress={() => setThemeMode(mode)}
                  accessibilityRole="button"
                  accessibilityLabel={`Set appearance to ${mode}`}
                >
                  <Ionicons
                    name={mode === 'light' ? 'sunny' : mode === 'dark' ? 'moon' : 'phone-portrait-outline'}
                    size={isDesktop ? 20 : 18}
                    color={isSelected ? '#FFFFFF' : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.segmentText,
                      {
                        color: isSelected ? '#FFFFFF' : colors.text,
                        fontWeight: isSelected ? typography.weights.bold : typography.weights.medium,
                        fontSize: isDesktop ? typography.sizes.sm : typography.sizes.xs + 1,
                      },
                    ]}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Preferences Toggles */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLabelRow}>
                <Ionicons name="notifications-outline" size={22} color={colors.primary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

            <View style={styles.settingRow}>
              <View style={styles.settingLabelRow}>
                <Ionicons name="airplane-outline" size={22} color={colors.primary} />
                <View>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Offline Mode</Text>
                  <Text style={[styles.settingSub, { color: colors.accent }]}>Offline ready ✓ (100% local)</Text>
                </View>
              </View>
              <Switch value={true} disabled trackColor={{ false: colors.border, true: colors.primary }} thumbColor="#FFFFFF" />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

            <View style={styles.settingRow}>
              <View style={styles.settingLabelRow}>
                <Ionicons name="bulb-outline" size={22} color={colors.primary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Show Tips</Text>
              </View>
              <Switch
                value={showTips}
                onValueChange={setShowTips}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Static Info Links */}
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => navigation.navigate('Info', { title: 'Privacy Policy', contentKey: 'privacy' })}
            >
              <View style={styles.settingLabelRow}>
                <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => navigation.navigate('Info', { title: 'About TeaLeaf Tracker', contentKey: 'about' })}
            >
              <View style={styles.settingLabelRow}>
                <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>About TeaLeaf Tracker</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => navigation.navigate('Info', { title: 'Contact Us', contentKey: 'contact' })}
            >
              <View style={styles.settingLabelRow}>
                <Ionicons name="mail-outline" size={22} color={colors.primary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Contact Us</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContent: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: spacing.lg,
    elevation: 2,
  },
  segmentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  segmentText: {
    marginLeft: 6,
  },
  card: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: typography.sizes.sm + 1,
    marginLeft: spacing.md,
    fontWeight: typography.weights.medium,
  },
  settingSub: {
    fontSize: typography.sizes.xs,
    marginLeft: spacing.md,
    marginTop: 2,
    fontWeight: typography.weights.semiBold,
  },
  divider: {
    height: 1,
  },
});
