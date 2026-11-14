import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { TeaType } from '../types';
import { useResponsive } from '../utils/responsive';
import { useBrewTimer } from '../hooks/useBrewTimer';
import brewingData from '../data/brewing.json';

const TEA_TYPES: TeaType[] = ['Black', 'Green', 'White', 'Silver Tips'];

export const BrewingGuideScreen: React.FC = () => {
  const { colors } = useTheme();
  const route = useRoute<any>();
  const initialTeaType: TeaType = route.params?.initialTeaType ?? 'Black';
  const [activeType, setActiveType] = useState<TeaType>(initialTeaType);

  // Switch tab to the requested tea type when navigating from TeaDetailsScreen
  useEffect(() => {
    if (route.params?.initialTeaType && TEA_TYPES.includes(route.params.initialTeaType)) {
      setActiveType(route.params.initialTeaType as TeaType);
    }
  }, [route.params?.initialTeaType]);
  const { formMaxWidth, isDesktop, isTablet, width } = useResponsive();

  const isSmall = width <= 340;

  const currentGuide = useMemo(() => {
    return brewingData.find((b) => b.tea_type === activeType) || brewingData[0];
  }, [activeType]);

  const { formattedTime, isRunning, isPaused, isCompleted, start, pause, reset } = useBrewTimer(
    currentGuide.steep_minutes,
    activeType
  );

  const iconSize = isSmall ? 56 : isDesktop ? 84 : isTablet ? 76 : 68;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.innerContent, { maxWidth: formMaxWidth }]}>
        <ScreenHeader title="Brewing Guide" />

        {/* Responsive Segmented control */}
        <View style={[styles.segmentContainer, { backgroundColor: colors.surface }]}>
          {TEA_TYPES.map((type) => {
            const isSelected = activeType === type;
            return (
              <TouchableOpacity
                key={type}
                onPress={() => {
                  setActiveType(type);
                }}
                style={[
                  styles.segmentItem,
                  {
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                  },
                ]}
                accessibilityRole="tab"
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={[
                    styles.segmentText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textMuted,
                      fontWeight: isSelected ? typography.weights.bold : typography.weights.medium,
                      fontSize: isSmall ? 10 : isDesktop ? typography.sizes.sm : typography.sizes.xs,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Cup icon / illustration */}
          <View style={styles.illustrationWrap}>
            <Ionicons name="cafe-outline" size={iconSize} color={colors.primary} />
          </View>

          {/* 3 Stat Tiles with flex layout */}
          <View style={[styles.statsRow, { gap: isSmall ? 4 : spacing.sm }]}>
            <View style={[styles.statTile, { backgroundColor: colors.surface }]}>
              <Ionicons name="water" size={22} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Water</Text>
              <Text style={[styles.statVal, { color: colors.text }]}>{currentGuide.water_temp_c}°C</Text>
            </View>
            <View style={[styles.statTile, { backgroundColor: colors.surface }]}>
              <Ionicons name="time" size={22} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Steep</Text>
              <Text style={[styles.statVal, { color: colors.text }]}>{currentGuide.steep_minutes} min</Text>
            </View>
            <View style={[styles.statTile, { backgroundColor: colors.surface }]}>
              <Ionicons name="leaf" size={22} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Leaves</Text>
              <Text style={[styles.statVal, { color: colors.text }]}>{currentGuide.leaves_grams_per_cup}g/cup</Text>
            </View>
          </View>

          {/* Tips Box */}
          <View style={[styles.tipsBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb-outline" size={20} color={colors.accent} />
              <Text style={[styles.tipsTitle, { color: colors.text }]}>Tips</Text>
            </View>
            <Text style={[styles.tipsText, { color: colors.textMuted }]}>
              {currentGuide.tips}
            </Text>
          </View>

          {/* Timer display */}
          <View style={[styles.timerContainer, { backgroundColor: colors.surface }]}>
            <Text
              style={[
                styles.timerText,
                {
                  color: isCompleted ? colors.accent : colors.primary,
                  fontSize: isSmall ? 40 : isDesktop ? 54 : 46,
                },
              ]}
            >
              {formattedTime}
            </Text>

            <View style={styles.timerActionsRow}>
              {!isRunning ? (
                <TouchableOpacity
                  style={[styles.timerBtn, { backgroundColor: colors.primary }]}
                  onPress={start}
                  accessibilityRole="button"
                  accessibilityLabel="Start brewing countdown"
                >
                  <Ionicons name="play" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.timerBtnText}>{isPaused ? 'Resume' : 'Start timer'}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.timerBtn, { backgroundColor: colors.accent }]}
                  onPress={pause}
                  accessibilityRole="button"
                  accessibilityLabel="Pause brewing countdown"
                >
                  <Ionicons name="pause" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.timerBtnText}>Pause</Text>
                </TouchableOpacity>
              )}

              {(isPaused || isRunning || isCompleted) && (
                <TouchableOpacity
                  style={[styles.resetBtn, { borderColor: colors.border }]}
                  onPress={() => reset()}
                  accessibilityRole="button"
                  accessibilityLabel="Reset brewing countdown"
                >
                  <Ionicons name="refresh" size={18} color={colors.text} />
                </TouchableOpacity>
              )}
            </View>
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
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    padding: 3,
    borderRadius: borderRadius.full,
    justifyContent: 'space-between',
    elevation: 1,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
  segmentText: {
    textAlign: 'center',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 100, // Clears bottom tab bar
  },
  illustrationWrap: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statTile: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    marginTop: 4,
  },
  statVal: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
  tipsBox: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  tipsTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginLeft: spacing.xs,
  },
  tipsText: {
    fontSize: typography.sizes.xs + 1,
    lineHeight: typography.lineHeights.sm,
  },
  timerContainer: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  timerText: {
    fontWeight: typography.weights.bold,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  timerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    height: 48,
    borderRadius: borderRadius.full,
    elevation: 2,
  },
  timerBtnText: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.md,
  },
  resetBtn: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
