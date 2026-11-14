import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { TeaImage } from '../components/TeaImage';
import { getTeaImage } from '../data/images';
import { useFavourites } from '../context/FavouritesContext';
import { useResponsive } from '../utils/responsive';
import { Tea } from '../types';

export const FavouritesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { favourites, removeFavourite } = useFavourites();
  const { contentMaxWidth, numColumns, isDesktop, width } = useResponsive();

  const thumbSize = width <= 340 ? 56 : isDesktop ? 76 : 64;

  const renderTeaCard = ({ item }: { item: Tea }) => {
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
        onPress={() => navigation.navigate('TeaDetails', { teaId: item.id })}
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
          onPress={() => removeFavourite(item.id)}
          style={styles.favBtn}
          accessibilityRole="button"
          accessibilityLabel="Remove from favourites"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="heart" size={22} color={colors.heart} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.innerContent, { maxWidth: contentMaxWidth }]}>
        <ScreenHeader
          title="Favourites"
          subtitle={`${favourites.length} saved · stored on this device`}
          showBack={false}
        />

        {favourites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.surface }]}>
              <Ionicons name="heart-outline" size={44} color={colors.heart} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No favourite teas yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Tap the heart on any tea card or details page to save it for quick offline access.
            </Text>
            <TouchableOpacity
              style={[styles.browseBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('AllTeas')}
              accessibilityRole="button"
              accessibilityLabel="Browse teas"
            >
              <Text style={styles.browseBtnText}>Browse teas</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            key={numColumns}
            data={favourites}
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
  browseBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
  },
});
