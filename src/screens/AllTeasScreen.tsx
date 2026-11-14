import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTeaFilters } from '../context/FilterContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { TeaImage } from '../components/TeaImage';
import { getTeaImage } from '../data/images';
import { RootStackScreenProps } from '../navigation/types';
import { useResponsive } from '../utils/responsive';
import { useFavourites } from '../context/FavouritesContext';
import teasData from '../data/teas.json';
import { Tea } from '../types';

export const AllTeasScreen: React.FC<Partial<RootStackScreenProps<'AllTeas'>>> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { contentMaxWidth, numColumns, isDesktop, width } = useResponsive();
  const { filters, setFilters, resetFilters, activeCount } = useTeaFilters();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(route?.params?.autoFocusSearch ?? false);

  const regionFilter = route?.params?.regionFilter;

  // Sync regionFilter route param into FilterContext so filters work uniformly
  useEffect(() => {
    if (regionFilter) {
      setFilters((prev) => ({
        ...prev,
        regions: [regionFilter],
      }));
      navigation?.setParams({ regionFilter: undefined });
    }
  }, [regionFilter, navigation, setFilters]);

  // Combine route param regionFilter (prior to effect clearing) with context regions
  const effectiveRegions = useMemo(() => {
    if (regionFilter && !filters.regions.includes(regionFilter)) {
      return [regionFilter, ...filters.regions];
    }
    return filters.regions;
  }, [regionFilter, filters.regions]);

  const displayActiveCount = useMemo(() => {
    const hasPendingParam = Boolean(regionFilter && !filters.regions.includes(regionFilter));
    return activeCount + (hasPendingParam ? 1 : 0);
  }, [activeCount, regionFilter, filters.regions]);

  const headerTitle = useMemo(() => {
    if (regionFilter) {
      return `${regionFilter} Teas`;
    }
    if (filters.regions.length === 1) {
      return `${filters.regions[0]} Teas`;
    }
    return 'All Teas';
  }, [regionFilter, filters.regions]);

  const handleClearFilters = () => {
    resetFilters();
    setSearchQuery('');
    if (route?.params?.regionFilter) {
      navigation?.setParams({ regionFilter: undefined });
    }
  };

  const filteredTeas = useMemo(() => {
    let result = teasData as Tea[];

    // 1. Region filtering (OR within category)
    if (effectiveRegions.length > 0) {
      result = result.filter((t) =>
        effectiveRegions.some((r) => {
          const norm = r.toLowerCase().replace(/[\s-]+/g, '_');
          return (
            t.region_id.toLowerCase() === norm ||
            t.region_id.toLowerCase() === r.toLowerCase() ||
            t.name.toLowerCase().includes(r.toLowerCase())
          );
        })
      );
    }

    // 2. Elevation filtering (OR within category)
    if (filters.elevations.length > 0) {
      result = result.filter((t) => filters.elevations.includes(t.elevation));
    }

    // 3. Tea type filtering (OR within category)
    if (filters.teaTypes.length > 0) {
      result = result.filter((t) => filters.teaTypes.includes(t.type));
    }

    // 4. Search query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.region_id.toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q) ||
          t.flavour_notes.toLowerCase().includes(q) ||
          t.elevation.toLowerCase().includes(q)
      );
    }

    // 5. Sorting
    const sorted = [...result];
    if (filters.sortBy === 'name_asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'name_desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else if (filters.sortBy === 'elevation') {
      const order: Record<string, number> = {
        'High-grown': 1,
        'Mid-grown': 2,
        'Low-grown': 3,
      };
      sorted.sort((a, b) => {
        const diff = (order[a.elevation] || 4) - (order[b.elevation] || 4);
        if (diff !== 0) return diff;
        return a.name.localeCompare(b.name);
      });
    }

    return sorted;
  }, [effectiveRegions, filters.elevations, filters.teaTypes, filters.sortBy, searchQuery]);

  const thumbSize = width <= 340 ? 56 : isDesktop ? 76 : 64;

  const renderTeaCard = ({ item }: { item: Tea }) => {
    const isFav = isFavourite(item.id);
    const isMultiCol = numColumns > 1;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            margin: isMultiCol ? spacing.xs : 0,
            marginBottom: spacing.md,
            maxWidth: numColumns === 1 ? '100%' : numColumns === 2 ? '50%' : '33.33%',
          },
        ]}
        onPress={() => navigation?.navigate('TeaDetails', { teaId: item.id })}
        activeOpacity={0.85}
      >
        <View style={[styles.cardThumb, { width: thumbSize, height: thumbSize }]}>
          <TeaImage source={getTeaImage(item.image_key, item.type)} style={styles.cardThumbImg} />
        </View>

        <View style={styles.cardInfo}>
          <Text style={[styles.teaName, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.teaMeta, { color: colors.textMuted }]}>
            {item.elevation} • {item.type}
          </Text>
          <Text style={[styles.teaNotes, { color: colors.accent }]} numberOfLines={1}>
            {item.flavour_notes}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => toggleFavourite(item)}
          style={styles.favBtn}
          accessibilityRole="button"
          accessibilityLabel={isFav ? 'Remove from favourites' : 'Add to favourites'}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={22}
            color={isFav ? colors.heart : colors.textMuted}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.innerContent, { maxWidth: contentMaxWidth }]}>
        <ScreenHeader
          title={headerTitle}
          showBack={navigation?.canGoBack()}
          rightAction={{
            icon: isSearchActive ? 'close' : 'search',
            onPress: () => {
              if (isSearchActive) setSearchQuery('');
              setIsSearchActive(!isSearchActive);
            },
            accessibilityLabel: isSearchActive ? 'Close search' : 'Open search',
          }}
        />

        {isSearchActive && (
          <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by name, region, type..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Subheader with Filter button and Count */}
        <View style={styles.filterRow}>
          <Text style={[styles.foundText, { color: colors.textMuted }]}>
            {filteredTeas.length} {filteredTeas.length === 1 ? 'tea' : 'teas'} found
          </Text>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation?.navigate('FilterTeas')}
            accessibilityRole="button"
            accessibilityLabel={`Open tea filter options${displayActiveCount > 0 ? `, ${displayActiveCount} active filters` : ''}`}
          >
            <Ionicons name="filter" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.filterButtonText}>Filter</Text>
            {displayActiveCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={[styles.filterBadgeText, { color: colors.primary }]}>
                  {displayActiveCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {filteredTeas.length === 0 ? (
          <View style={styles.emptyContent}>
            <Ionicons name="leaf-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No teas match your filters</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Try adjusting your search terms or filters to find what you're looking for.
            </Text>
            <TouchableOpacity
              style={[styles.clearFiltersBtn, { backgroundColor: colors.primary }]}
              onPress={handleClearFilters}
              accessibilityRole="button"
              accessibilityLabel="Clear all filters"
            >
              <Text style={styles.clearFiltersBtnText}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            key={numColumns}
            data={filteredTeas}
            keyExtractor={(item) => item.id}
            renderItem={renderTeaCard}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.sm,
    paddingVertical: 0,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  foundText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  filterBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    lineHeight: 14,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: 100, // Clears bottom tab bar
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardThumb: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  cardThumbImg: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  teaName: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
  },
  teaMeta: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  teaNotes: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    marginTop: 3,
  },
  favBtn: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  clearFiltersBtn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearFiltersBtnText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
});
