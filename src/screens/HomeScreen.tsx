import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
<<<<<<< Updated upstream
=======
import { useAuth } from '../context/AuthContext';
>>>>>>> Stashed changes
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { TeaImage } from '../components/TeaImage';
import { getTeaImage, heroImages } from '../data/images';
import { useResponsive } from '../utils/responsive';
import teasData from '../data/teas.json';
import { Tea } from '../types';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
<<<<<<< Updated upstream
  const [menuVisible, setMenuVisible] = useState(false);
  const { contentMaxWidth, isDesktop, isTablet, numColumns, width } = useResponsive();

=======
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const { contentMaxWidth, isDesktop, isTablet, numColumns, width } = useResponsive();

  const firstName = user?.full_name ? user.full_name.trim().split(' ')[0] : null;

>>>>>>> Stashed changes
  const featuredTeas = (teasData as Tea[]).filter((t) => t.is_featured === 1);
  const heroHeight = width <= 340 ? 150 : isDesktop ? 250 : isTablet ? 210 : 170;
  const gridTileWidth = isDesktop ? '23.5%' : isTablet ? '23.5%' : '48%';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.innerContent, { maxWidth: contentMaxWidth }]}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={[styles.headerBtn, { backgroundColor: colors.surface }]}
            accessibilityRole="button"
            accessibilityLabel="Open navigation menu"
          >
            <Ionicons name="menu" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('AllTeas', { autoFocusSearch: true })}
            style={[styles.headerBtn, { backgroundColor: colors.surface }]}
            accessibilityRole="button"
            accessibilityLabel="Search teas"
          >
            <Ionicons name="search" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Title Section */}
          <View style={styles.titleSection}>
<<<<<<< Updated upstream
=======
            {firstName && (
              <Text
                style={[
                  styles.greetingText,
                  {
                    color: colors.accent,
                    fontSize: width <= 340 ? typography.sizes.xs : typography.sizes.sm,
                  },
                ]}
              >
                Hello, {firstName} 👋
              </Text>
            )}
>>>>>>> Stashed changes
            <Text
              style={[
                styles.mainTitle,
                {
                  color: colors.primary,
                  fontSize: width <= 340 ? 22 : isDesktop ? 28 : 24,
                },
              ]}
            >
              TeaLeaf Tracker
            </Text>
            <Text
              style={[
                styles.subTitle,
                {
                  color: colors.textMuted,
                  fontSize: width <= 340 ? typography.sizes.xs : typography.sizes.sm,
                },
              ]}
            >
              Ceylon Tea Estate Guide
            </Text>
          </View>

          {/* Hero banner */}
          <View style={[styles.heroCard, { height: heroHeight }]}>
            <TeaImage source={heroImages.heroBanner} style={styles.heroImage} />
            <TouchableOpacity
              style={[styles.bannerBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('AllTeas')}
              activeOpacity={0.85}
            >
              <Ionicons name="leaf" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.bannerBtnText}>Explore All Teas</Text>
            </TouchableOpacity>
          </View>

          {/* Responsive Navigation Tiles */}
          <View style={styles.gridContainer}>
            <TouchableOpacity
              style={[styles.gridTile, { width: gridTileWidth, backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('RegionExplorer')}
              activeOpacity={0.8}
            >
              <Ionicons name="map-outline" size={isDesktop ? 32 : 28} color={colors.primary} />
              <Text style={[styles.gridTitle, { color: colors.text }]}>Browse by region</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridTile, { width: gridTileWidth, backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('EstatesToVisit')}
              activeOpacity={0.8}
            >
              <Ionicons name="business-outline" size={isDesktop ? 32 : 28} color={colors.primary} />
              <Text style={[styles.gridTitle, { color: colors.text }]}>Estates to Visit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridTile, { width: gridTileWidth, backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('MainTabs', { screen: 'BrewingTab' })}
              activeOpacity={0.8}
            >
              <Ionicons name="timer-outline" size={isDesktop ? 32 : 28} color={colors.primary} />
              <Text style={[styles.gridTitle, { color: colors.text }]}>Brewing Guide</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridTile, { width: gridTileWidth, backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('MyTrip')}
              activeOpacity={0.8}
            >
              <Ionicons name="bookmark-outline" size={isDesktop ? 32 : 28} color={colors.primary} />
              <Text style={[styles.gridTitle, { color: colors.text }]}>My Trip</Text>
            </TouchableOpacity>
          </View>

          {/* Tea of the Day */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tea of the day</Text>
          </View>
          <TouchableOpacity
            style={[styles.teaOfDayCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('TeaDetails', { teaId: 'dimbula_op' })}
            activeOpacity={0.85}
          >
            <View style={[styles.teaThumb, { width: isDesktop ? 80 : 64, height: isDesktop ? 80 : 64 }]}>
              <TeaImage source={getTeaImage('dimbula_op', 'Black')} style={styles.teaThumbImg} />
            </View>
            <View style={styles.teaInfo}>
              <Text style={[styles.teaName, { color: colors.text }]}>Dimbula Orange Pekoe</Text>
              <Text style={[styles.teaMeta, { color: colors.textMuted }]}>High-grown • Black tea</Text>
              <Text style={[styles.teaNotes, { color: colors.accent }]}>Bright, Crisp, Citrus</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Featured Teas header */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Teas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllTeas')}>
              <Text style={[styles.seeAllText, { color: colors.accent }]}>See all &gt;</Text>
            </TouchableOpacity>
          </View>

          {/* Responsive Featured Teas Grid */}
          <View style={styles.featuredGrid}>
            {featuredTeas.map((tea) => {
              const cardWidth = numColumns === 1 ? '100%' : numColumns === 2 ? '48.5%' : '31.8%';
              return (
                <TouchableOpacity
                  key={tea.id}
                  style={[styles.featuredCard, { width: cardWidth, backgroundColor: colors.surface }]}
                  onPress={() => navigation.navigate('TeaDetails', { teaId: tea.id })}
                  activeOpacity={0.85}
                >
                  <View style={styles.featuredThumb}>
                    <TeaImage source={getTeaImage(tea.image_key, tea.type)} style={styles.featuredThumbImg} />
                  </View>
                  <View style={styles.featuredContent}>
                    <Text style={[styles.featuredName, { color: colors.text }]} numberOfLines={1}>
                      {tea.name}
                    </Text>
                    <Text style={[styles.featuredMeta, { color: colors.textMuted }]}>
                      {tea.elevation} • {tea.type}
                    </Text>
                    <Text style={[styles.featuredNotes, { color: colors.accent }]} numberOfLines={1}>
                      {tea.flavour_notes}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Quick Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>TeaLeaf Tracker</Text>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('RegionExplorer');
              }}
            >
              <Ionicons name="map-outline" size={22} color={colors.text} />
              <Text style={[styles.modalItemText, { color: colors.text }]}>Region Explorer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Settings');
              }}
            >
              <Ionicons name="settings-outline" size={22} color={colors.text} />
              <Text style={[styles.modalItemText, { color: colors.text }]}>Settings</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100, // Sufficient bottom padding to clear the tab bar
  },
  titleSection: {
    marginVertical: spacing.xs,
  },
<<<<<<< Updated upstream
=======
  greetingText: {
    fontWeight: typography.weights.semiBold,
    marginBottom: 2,
  },
>>>>>>> Stashed changes
  mainTitle: {
    fontWeight: typography.weights.bold,
  },
  subTitle: {
    fontWeight: typography.weights.medium,
    marginTop: 2,
  },
  heroCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginTop: spacing.xs,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  heroImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    elevation: 3,
  },
  bannerBtnText: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  gridTile: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  gridTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  seeAllText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semiBold,
  },
  teaOfDayCard: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: spacing.md,
  },
  teaThumb: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  teaThumbImg: {
    width: '100%',
    height: '100%',
  },
  teaInfo: {
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
    marginTop: 2,
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  featuredThumb: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  featuredThumbImg: {
    width: '100%',
    height: '100%',
  },
  featuredContent: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  featuredName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  featuredMeta: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  featuredNotes: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  modalItemText: {
    fontSize: typography.sizes.md,
    marginLeft: spacing.md,
  },
});
