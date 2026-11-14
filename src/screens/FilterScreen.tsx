import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { RootStackScreenProps } from '../navigation/types';
import { useResponsive } from '../utils/responsive';

const REGIONS = ['Nuwara Eliya', 'Uva', 'Dimbula', 'Kandy', 'Ruhuna', 'Sabaragamuwa'];
const ELEVATIONS = ['High-grown', 'Mid-grown', 'Low-grown'];
const TEA_TYPES = ['Black', 'Green', 'White', 'Silver Tips'];

export const FilterScreen: React.FC<RootStackScreenProps<'FilterTeas'>> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { formMaxWidth, isDesktop, isTablet } = useResponsive();

  const [selectedRegions, setSelectedRegions] = useState<string[]>(route.params?.currentFilters?.regions || []);
  const [selectedElevations, setSelectedElevations] = useState<string[]>(
    route.params?.currentFilters?.elevations || []
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(route.params?.currentFilters?.teaTypes || []);

  const toggleRegion = (r: string) => {
    setSelectedRegions((prev) => (prev.includes(r) ? prev.filter((item) => item !== r) : [...prev, r]));
  };

  const toggleElevation = (e: string) => {
    setSelectedElevations((prev) => (prev.includes(e) ? prev.filter((item) => item !== e) : [...prev, e]));
  };

  const toggleType = (t: string) => {
    setSelectedTypes((prev) => (prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]));
  };

  const clearAll = () => {
    setSelectedRegions([]);
    setSelectedElevations([]);
    setSelectedTypes([]);
  };

  const chipPaddingH = isDesktop ? spacing.lg : spacing.md;
  const chipPaddingV = isDesktop ? spacing.sm : spacing.xs + 2;
  const chipFontSize = isDesktop ? typography.sizes.sm + 1 : typography.sizes.sm;
  const buttonHeight = isDesktop ? 52 : 48;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.innerContent, { maxWidth: formMaxWidth }]}>
        <ScreenHeader title="Filter Teas" showBack />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Region group */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Region</Text>
          <View style={styles.chipGroup}>
            {REGIONS.map((r) => {
              const isSelected = selectedRegions.includes(r);
              return (
                <TouchableOpacity
                  key={r}
                  onPress={() => toggleRegion(r)}
                  style={[
                    styles.chip,
                    {
                      paddingHorizontal: chipPaddingH,
                      paddingVertical: chipPaddingV,
                      backgroundColor: isSelected ? colors.chipSelected : colors.chipUnselected,
                      borderColor: isSelected ? colors.chipSelected : colors.chipBorder,
                    },
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        fontSize: chipFontSize,
                        color: isSelected ? colors.chipSelectedText : colors.chipUnselectedText,
                      },
                    ]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Elevation group */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Elevation</Text>
          <View style={styles.chipGroup}>
            {ELEVATIONS.map((e) => {
              const isSelected = selectedElevations.includes(e);
              return (
                <TouchableOpacity
                  key={e}
                  onPress={() => toggleElevation(e)}
                  style={[
                    styles.chip,
                    {
                      paddingHorizontal: chipPaddingH,
                      paddingVertical: chipPaddingV,
                      backgroundColor: isSelected ? colors.chipSelected : colors.chipUnselected,
                      borderColor: isSelected ? colors.chipSelected : colors.chipBorder,
                    },
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        fontSize: chipFontSize,
                        color: isSelected ? colors.chipSelectedText : colors.chipUnselectedText,
                      },
                    ]}
                  >
                    {e}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tea Type group */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tea type</Text>
          <View style={styles.chipGroup}>
            {TEA_TYPES.map((t) => {
              const isSelected = selectedTypes.includes(t);
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => toggleType(t)}
                  style={[
                    styles.chip,
                    {
                      paddingHorizontal: chipPaddingH,
                      paddingVertical: chipPaddingV,
                      backgroundColor: isSelected ? colors.chipSelected : colors.chipUnselected,
                      borderColor: isSelected ? colors.chipSelected : colors.chipBorder,
                    },
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        fontSize: chipFontSize,
                        color: isSelected ? colors.chipSelectedText : colors.chipUnselectedText,
                      },
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Action Footer */}
        <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.clearBtn, { height: buttonHeight, borderColor: colors.border }]}
            onPress={clearAll}
            accessibilityRole="button"
            accessibilityLabel="Clear all selected filters"
          >
            <Text style={[styles.clearBtnText, { color: colors.text }]}>Clear all</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.applyBtn, { height: buttonHeight, backgroundColor: colors.primary }]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Apply filters and show teas"
          >
            <Text style={styles.applyBtnText}>Show teas</Text>
          </TouchableOpacity>
        </View>
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
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    margin: 4,
  },
  chipText: {
    fontWeight: typography.weights.medium,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    gap: spacing.sm,
  },
  clearBtn: {
    flex: 1,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
  },
  applyBtn: {
    flex: 1.5,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
});
