import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { TeaImage } from '../components/TeaImage';
import { getEstateImage } from '../data/images';
import { RootStackScreenProps } from '../navigation/types';
import { useTrip } from '../context/TripContext';
import { useResponsive } from '../utils/responsive';
import { Estate } from '../types';

export const MyTripScreen: React.FC<RootStackScreenProps<'MyTrip'>> = ({ navigation }) => {
  const { colors } = useTheme();
  const { tripEstates, removeTripItem, clearTrip, totalDriveMinutes, totalDistanceKm } = useTrip();
  const { contentMaxWidth, numColumns, isDesktop, width } = useResponsive();

  const thumbSize = width <= 340 ? 56 : isDesktop ? 76 : 64;

  const renderEstateItem = ({ item }: { item: Estate }) => {
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

        <TouchableOpacity
          onPress={() => removeTripItem(item.id)}
          style={styles.removeBtn}
          accessibilityRole="button"
          accessibilityLabel="Remove from trip"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.innerContent, { maxWidth: contentMaxWidth }]}>
        <ScreenHeader
          title="My Trip"
          subtitle={tripEstates.length > 0 ? `${tripEstates.length} estates in itinerary` : 'Your saved tea trips'}
          showBack
          rightAction={
            tripEstates.length > 0
              ? {
                  icon: 'trash-outline',
                  onPress: clearTrip,
                  accessibilityLabel: 'Clear all trip items',
                }
              : undefined
          }
        />

        {tripEstates.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.surface }]}>
              <Ionicons name="map-outline" size={44} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No estates in your trip</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Explore Sri Lanka's tea estates and save them here to plan your travel itinerary.
            </Text>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('EstatesToVisit')}
              accessibilityRole="button"
              accessibilityLabel="Explore estates to visit"
            >
              <Text style={styles.actionBtnText}>Explore Estates</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            key={numColumns}
            data={tripEstates}
            keyExtractor={(item) => item.id}
            renderItem={renderEstateItem}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryNum, { color: colors.primary }]}>{tripEstates.length}</Text>
                  <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Estates</Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryNum, { color: colors.primary }]}>{totalDriveMinutes}m</Text>
                  <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Drive time</Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryNum, { color: colors.primary }]}>{totalDistanceKm}km</Text>
                  <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Distance</Text>
                </View>
              </View>
            }
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
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: 100, // Clears bottom tab bar
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  summaryCard: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNum: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  summaryLabel: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
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
  removeBtn: {
    padding: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    maxWidth: 500,
    alignSelf: 'center',
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: typography.lineHeights.sm,
    marginBottom: spacing.xl,
  },
  actionBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
  },
});
