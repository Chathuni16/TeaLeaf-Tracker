import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ScreenHeader } from '../components/ScreenHeader';
import { RootStackScreenProps } from '../navigation/types';
import { useResponsive } from '../utils/responsive';

const INFO_CONTENT: Record<string, { heading: string; body: string[] }> = {
  privacy: {
    heading: '100% Offline & Private',
    body: [
      'TeaLeaf Tracker is committed to your complete privacy. This application operates entirely offline on your mobile device.',
      'We do not collect, track, transmit, or store any personal information, location data, or browsing activity on any remote servers.',
      'Your favourites, trip plans, and settings are stored strictly in local SQLite and AsyncStorage databases on your device.',
      'No third-party trackers, analytics SDKs, or cloud services are embedded in this application.',
    ],
  },
  about: {
    heading: 'TeaLeaf Tracker v1.0.0',
    body: [
      'Subtitle: Ceylon Tea Estate Guide',
      'TeaLeaf Tracker is an educational and travel companion designed for tea enthusiasts, travellers, and students exploring the heritage of Sri Lankan tea.',
      'Created as a university individual project (ICA 03) demonstrating offline-first React Native architecture, SQLite database persistence, and clean mobile UI engineering.',
      'All tea varieties, regional elevations, tasting notes, and historic estates are curated from authentic Ceylon tea classification standards.',
    ],
  },
  contact: {
    heading: 'Get in Touch',
    body: [
      'Developer: Student / ICA 03 Project',
      'Module: Mobile Client Computing (MCC)',
      'Institution: University Individual Project',
      'Email: student@tealeaftracker.local',
      'Feedback: For viva assessments, feature inquiries, or project evaluation, please reach out via university internal submission channels.',
    ],
  },
};

export const InfoScreen: React.FC<RootStackScreenProps<'Info'>> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { formMaxWidth, isDesktop, isTablet } = useResponsive();
  const { title, contentKey } = route.params;
  const content = INFO_CONTENT[contentKey] || INFO_CONTENT.about;

  const readingMaxWidth = isDesktop ? 720 : isTablet ? 640 : formMaxWidth;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.innerContent, { maxWidth: readingMaxWidth }]}>
        <ScreenHeader title={title} showBack />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text
              style={[
                styles.heading,
                {
                  color: colors.primary,
                  fontSize: isDesktop ? typography.sizes.xl : typography.sizes.lg,
                },
              ]}
            >
              {content.heading}
            </Text>
            {content.body.map((para, index) => (
              <Text
                key={index}
                style={[
                  styles.paragraph,
                  {
                    color: colors.text,
                    fontSize: isDesktop ? typography.sizes.sm + 1 : typography.sizes.sm,
                    lineHeight: isDesktop ? 24 : typography.lineHeights.md,
                  },
                ]}
              >
                {para}
              </Text>
            ))}
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
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  heading: {
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
  },
  paragraph: {
    marginBottom: spacing.md,
  },
});
