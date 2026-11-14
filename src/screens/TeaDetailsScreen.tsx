import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { TeaImage } from '../components/TeaImage';
import { getTeaImage } from '../data/images';
import { RootStackScreenProps } from '../navigation/types';
import { useResponsive } from '../utils/responsive';
import { useFavourites } from '../context/FavouritesContext';
import teasData from '../data/teas.json';
import { Tea } from '../types';

export const TeaDetailsScreen: React.FC<RootStackScreenProps<'TeaDetails'>> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { isDesktop, isTablet, formMaxWidth, width } = useResponsive();
  const { isFavourite, toggleFavourite } = useFavourites();

  const teaId = route.params?.teaId || 'dimbula_op';

  const tea = useMemo(() => {
    return (teasData as Tea[]).find((t) => t.id === teaId) || (teasData[0] as Tea);
  }, [teaId]);

  const isFav = isFavourite(tea.id);
  const heroHeight = width <= 340 ? 170 : isDesktop ? 280 : isTablet ? 240 : 200;
  const containerMaxWidth = isDesktop ? 800 : isTablet ? 680 : formMaxWidth;

  const notesList = useMemo(() => {
    return tea.flavour_notes.split(',').map((n) => n.trim());
  }, [tea.flavour_notes]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.innerContent, { maxWidth: containerMaxWidth }]}>
        {/* Top Header */}
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
            {tea.name}
          </Text>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: colors.surface }]}
            accessibilityRole="button"
            accessibilityLabel="Search"
            onPress={() => navigation.navigate('AllTeas', { autoFocusSearch: true })}
          >
            <Ionicons name="search" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero image card */}
          <View style={[styles.heroContainer, { height: heroHeight }]}>
            <TeaImage source={getTeaImage(tea.image_key, tea.type)} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <View style={[styles.typeBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.typeBadgeText}>{tea.type.toUpperCase()}</Text>
              </View>
              <Text style={styles.heroTitle}>{tea.name}</Text>
            </View>
            <TouchableOpacity
              style={[styles.favBtn, { backgroundColor: colors.surface }]}
              onPress={() => toggleFavourite(tea)}
              accessibilityRole="button"
              accessibilityLabel={isFav ? 'Remove from favourites' : 'Favourite tea'}
            >
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={24}
                color={isFav ? colors.heart : colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Info stats row */}
          <View style={[styles.statsRow, { backgroundColor: colors.surface }]}>
            <View style={styles.statCol}>
              <Ionicons name="map-outline" size={20} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Region</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{tea.region_id}</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statCol}>
              <Ionicons name="trending-up-outline" size={20} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Elevation</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{tea.elevation}</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statCol}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Harvest</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{tea.harvest_season}</Text>
            </View>
          </View>

          {/* Flavour notes */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Flavour notes</Text>
          <View style={styles.notesRow}>
            {notesList.map((note) => (
              <View
                key={note}
                style={[styles.noteChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Text style={[styles.noteText, { color: colors.text }]}>{note}</Text>
              </View>
            ))}
          </View>

          {/* About */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <Text style={[styles.aboutText, { color: colors.textMuted }]}>
            {tea.about}
          </Text>

          {/* View Brewing Guide button */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.primary,
                height: isDesktop ? 56 : 52,
              },
            ]}
            onPress={() =>
              navigation.navigate('MainTabs', {
                screen: 'BrewingTab',
                params: { initialTeaType: tea.type },
              })
            }
            accessibilityRole="button"
            accessibilityLabel="View brewing guide for this tea"
          >
            <Ionicons name="timer-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.actionBtnText}>View brewing guide</Text>
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
    maxWidth: '65%',
    textAlign: 'center',
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
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    marginBottom: 4,
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  favBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    elevation: 1,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    marginTop: 4,
  },
  statValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  statDivider: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  notesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  noteChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  noteText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  aboutText: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.md,
    marginBottom: spacing.lg,
  },
  actionBtn: {
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
});
