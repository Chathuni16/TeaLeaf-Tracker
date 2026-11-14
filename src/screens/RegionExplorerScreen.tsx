import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { TeaImage } from '../components/TeaImage';
import { getRegionImage } from '../data/images';
import { RootStackScreenProps } from '../navigation/types';
import { useResponsive } from '../utils/responsive';

interface RegionItem {
  id: string;
  name: string;
  elevation: string;
}

const REGIONS: RegionItem[] = [
  { id: 'nuwara_eliya', name: 'Nuwara Eliya', elevation: 'High-grown' },
  { id: 'uva', name: 'Uva', elevation: 'High-grown' },
  { id: 'dimbula', name: 'Dimbula', elevation: 'High-grown' },
  { id: 'kandy', name: 'Kandy', elevation: 'Mid-grown' },
  { id: 'ruhuna', name: 'Ruhuna', elevation: 'Low-grown' },
  { id: 'sabaragamuwa', name: 'Sabaragamuwa', elevation: 'Low-grown' },
];

export const RegionExplorerScreen: React.FC<RootStackScreenProps<'RegionExplorer'>> = ({ navigation }) => {
  const { colors } = useTheme();
  const { contentMaxWidth, numColumns, isDesktop, isTablet, width } = useResponsive();

  const imgHeight = width <= 340 ? 95 : isDesktop ? 160 : isTablet ? 135 : 110;

  const renderRegionCard = ({ item }: { item: RegionItem }) => {
    const isMultiCol = numColumns > 1;

    return (
      <TouchableOpacity
        style={[
          styles.regionCard,
          {
            backgroundColor: colors.surface,
            margin: isMultiCol ? spacing.xs : 0,
            marginBottom: spacing.md,
            maxWidth: numColumns === 1 ? '100%' : numColumns === 2 ? '50%' : '33.33%',
          },
        ]}
        onPress={() => navigation.navigate('AllTeas', { regionFilter: item.name })}
        activeOpacity={0.85}
      >
        <View style={[styles.imgWrap, { height: imgHeight }]}>
          <TeaImage source={getRegionImage(item.id)} style={styles.regionImg} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.regionName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.regionElevation, { color: colors.textMuted }]}>{item.elevation}</Text>
          <TouchableOpacity
            style={styles.estatesLink}
            onPress={() => navigation.navigate('EstatesToVisit', { regionFilter: item.name })}
          >
            <Text style={[styles.estatesLinkText, { color: colors.accent }]}>Estates &gt;</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.innerContent, { maxWidth: contentMaxWidth }]}>
        <ScreenHeader
          title="Region Explorer"
          showBack
          rightAction={{
            icon: 'search',
            onPress: () => navigation.navigate('AllTeas', { autoFocusSearch: true }),
            accessibilityLabel: 'Search teas',
          }}
        />

        <FlatList
          key={numColumns}
          data={REGIONS}
          keyExtractor={(item) => item.id}
          renderItem={renderRegionCard}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
              <Text style={styles.heroTitle}>Explore Tea Regions of Sri Lanka</Text>
              <Text style={styles.heroSubtitle}>
                From mist-shrouded peaks over 6,000 ft to the lush lowlands near the southern coast.
              </Text>
            </View>
          }
        />
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: 100, // Clears bottom tab bar
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  heroCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: typography.sizes.xs + 1,
    marginTop: spacing.xs,
    lineHeight: typography.lineHeights.sm,
  },
  regionCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  imgWrap: {
    width: '100%',
  },
  regionImg: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    padding: spacing.sm,
  },
  regionName: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
  },
  regionElevation: {
    fontSize: typography.sizes.xs,
  },
  estatesLink: {
    marginTop: spacing.xs,
  },
  estatesLinkText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semiBold,
  },
});
