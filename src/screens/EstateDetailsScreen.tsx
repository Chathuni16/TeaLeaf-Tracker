import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { TeaImage } from '../components/TeaImage';
import { getEstateImage } from '../data/images';
import { RootStackScreenProps } from '../navigation/types';
import { useResponsive } from '../utils/responsive';
import { useTrip } from '../context/TripContext';
import estatesData from '../data/estates.json';
import { Estate } from '../types';

export const EstateDetailsScreen: React.FC<RootStackScreenProps<'EstateDetails'>> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { isDesktop, isTablet, formMaxWidth, width } = useResponsive();
  const { isInTrip, toggleTrip } = useTrip();

  const estateId = route.params?.estateId || 'pedro_estate';

  const estate = useMemo(() => {
    return (estatesData as Estate[]).find((e) => e.id === estateId) || (estatesData[0] as Estate);
  }, [estateId]);

  const isSaved = isInTrip(estate.id);
  const heroHeight = width <= 340 ? 170 : isDesktop ? 280 : isTablet ? 240 : 200;
  const containerMaxWidth = isDesktop ? 800 : isTablet ? 680 : formMaxWidth;

  const teaTypeList = useMemo(() => {
    return estate.tea_types.split(',').map((t) => t.trim());
  }, [estate.tea_types]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.innerContent, { maxWidth: containerMaxWidth }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.headerBtn, { backgroundColor: colors.surface }]}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            Estate Details
          </Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero image card */}
          <View style={[styles.heroContainer, { height: heroHeight }]}>
            <TeaImage source={getEstateImage(estate.image_key || estate.id, estate.region_id)} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>{estate.name}</Text>
              <Text style={styles.heroRegion}>{estate.region_id.replace('_', ' ')}</Text>
            </View>
          </View>

          {/* Info Rows */}
          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <View style={styles.infoRow}>
              <Ionicons name="car-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Drive / Distance:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {estate.drive_minutes} min • {estate.distance_km} km
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Factory Tour:</Text>
              <Text style={[styles.infoValue, { color: colors.accent, fontWeight: '700' }]}>
                {estate.factory_tour ? 'Yes' : 'No'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Best Season:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{estate.best_season}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="star-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Highlights:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{estate.highlights}</Text>
            </View>
          </View>

          {/* Tea Types chips */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tea Types</Text>
          <View style={styles.chipsRow}>
            {teaTypeList.map((type) => (
              <View key={type} style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.chipText, { color: colors.text }]}>{type}</Text>
              </View>
            ))}
          </View>

          {/* About */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <Text style={[styles.aboutText, { color: colors.textMuted }]}>
            {estate.about}
          </Text>

          {/* Save to My Trip Button */}
          <TouchableOpacity
            style={[
              styles.tripBtn,
              {
                backgroundColor: isSaved ? colors.surfaceSubtle : colors.primary,
                height: isDesktop ? 56 : 52,
              },
            ]}
            onPress={() => toggleTrip(estate)}
            accessibilityRole="button"
            accessibilityLabel={isSaved ? 'Remove from My Trip' : 'Save to My Trip'}
          >
            <Ionicons
              name={isSaved ? 'checkmark-circle' : 'bookmark-outline'}
              size={20}
              color={isSaved ? colors.primary : '#FFFFFF'}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.tripBtnText, { color: isSaved ? colors.primary : '#FFFFFF' }]}>
              {isSaved ? 'Saved to My Trip ✓' : 'Save to My Trip'}
            </Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  heroContainer: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: spacing.md,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  heroRegion: {
    color: '#E0E7DC',
    fontSize: typography.sizes.sm,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  infoCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    flexWrap: 'wrap',
  },
  infoLabel: {
    marginLeft: spacing.sm,
    fontSize: typography.sizes.sm,
    minWidth: 120,
    flexShrink: 0,
  },
  infoValue: {
    flex: 1,
    fontSize: typography.sizes.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  aboutText: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.md,
    marginBottom: spacing.lg,
  },
  tripBtn: {
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  tripBtnText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
});
