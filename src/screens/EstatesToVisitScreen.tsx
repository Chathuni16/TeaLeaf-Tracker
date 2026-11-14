import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { TeaImage } from '../components/TeaImage';
import { getEstateImage } from '../data/images';
import { RootStackScreenProps } from '../navigation/types';
import { useResponsive } from '../utils/responsive';
import estatesData from '../data/estates.json';
import { Estate } from '../types';

export const EstatesToVisitScreen: React.FC<RootStackScreenProps<'EstatesToVisit'>> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { contentMaxWidth, numColumns, isDesktop, width } = useResponsive();

  const regionFilter = route.params?.regionFilter;
  const thumbSize = width <= 340 ? 56 : isDesktop ? 76 : 64;

  const filteredEstates = useMemo(() => {
    let list = estatesData as Estate[];

    if (regionFilter) {
      list = list.filter(
        (e) =>
          e.region_id.toLowerCase().includes(regionFilter.toLowerCase()) ||
          e.name.toLowerCase().includes(regionFilter.toLowerCase())
      );
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.region_id.toLowerCase().includes(q) ||
          e.highlights.toLowerCase().includes(q) ||
          e.tea_types.toLowerCase().includes(q)
      );
    }

    return list;
  }, [searchQuery, regionFilter]);

  const renderEstateCard = ({ item }: { item: Estate }) => {
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
        onPress={() => navigation.navigate('EstateDetails', { estateId: item.id })}
        activeOpacity={0.85}
      >
        <View style={[styles.thumbnail, { width: thumbSize, height: thumbSize }]}>
          <TeaImage source={getEstateImage(item.image_key || item.id, item.region_id)} style={styles.thumbImg} />
        </View>
        <View style={styles.infoCol}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.region, { color: colors.textMuted }]} numberOfLines={1}>
            {item.region_id.replace('_', ' ')}
          </Text>
          <Text style={[styles.meta, { color: colors.accent }]}>
            ⏱ {item.drive_minutes} min · {item.distance_km} km
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.innerContent, { maxWidth: contentMaxWidth }]}>
        <ScreenHeader
          title={regionFilter ? `${regionFilter} Estates` : 'Estates to Visit'}
          showBack
          rightAction={{
            icon: 'search',
            onPress: () => {},
            accessibilityLabel: 'Search estates',
          }}
        />

        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: spacing.xs }} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search tea estates..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {filteredEstates.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No estates found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Try adjusting your search query to discover other historic tea plantations.
            </Text>
          </View>
        ) : (
          <FlatList
            key={numColumns}
            data={filteredEstates}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
            renderItem={renderEstateCard}
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
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.sm,
    paddingVertical: 0,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: 100, // Clears bottom tab bar / footer
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
  thumbnail: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  infoCol: {
    marginLeft: spacing.md,
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
  },
  region: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  meta: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    marginTop: 4,
  },
  emptyContainer: {
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
});
