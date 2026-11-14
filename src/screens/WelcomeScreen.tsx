import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackScreenProps } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useResponsive } from '../utils/responsive';
import { heroImages, logoImage } from '../data/images';

export const WelcomeScreen: React.FC<RootStackScreenProps<'Welcome'>> = ({ navigation }) => {
  const { colors } = useTheme();
  const { formMaxWidth, isDesktop, isTablet, width } = useResponsive();
  const { user } = useAuth();

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('@ceylon_tea_guide_onboarded', 'true');
    } catch {
      // Continue even if storage fails
    }
    if (user) {
      navigation.replace('MainTabs');
    } else {
      navigation.replace('Login');
    }
  };

  const logoSize = width <= 340 ? 120 : width < 600 ? 150 : isTablet ? 190 : 220;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Full-screen background image with dark overlay */}
      <ImageBackground
        source={heroImages.welcomeBg}
    style={styles.bgImage}
    imageStyle={{ width: '100%', height: '100%' }}
    resizeMode="cover"
      >
        {/* Semi-transparent overlay so text stays readable */}
        <View style={styles.overlay} />

        {/* Centred content column */}
        <View style={[styles.innerContent, { maxWidth: formMaxWidth }]}>

          {/* ── TOP: Logo + App name ── */}
          <View style={styles.topSection}>
            <Image
              source={logoImage}
              style={[styles.logo, { width: logoSize, height: logoSize }]}
              resizeMode="contain"
              accessible
              accessibilityRole="image"
              accessibilityLabel="TeaLeaf Tracker Logo"
            />
            <Text
              style={[
                styles.appName,
                {
                  color: '#FFFFFF',
                  fontSize: width <= 340 ? 24 : isDesktop ? 36 : isTablet ? 30 : 26,
                },
              ]}
            >
              TeaLeaf Tracker
            </Text>
            <Text
              style={[
                styles.tagline,
                {
                  color: 'rgba(255,255,255,0.90)',
                  fontSize: width <= 340 ? 13 : isDesktop ? 17 : 15,
                },
              ]}
            >
              Explore • Learn • Visit
            </Text>
          </View>

          {/* ── MIDDLE: Short description ── */}
          <View style={styles.middleSection}>
            <Text
              style={[
                styles.description,
                {
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: width <= 340 ? 13 : isDesktop ? 16 : 14,
                  maxWidth: isDesktop ? 520 : '100%',
                },
              ]}
            >
              Discover Sri Lanka's finest tea regions, master brewing authentic teas, and explore historic
              estates nestled in the misty highlands.
            </Text>
          </View>

          {/* ── BOTTOM: CTA button ── */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              onPress={handleGetStarted}
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary,
                  height: width <= 340 ? 48 : isDesktop ? 58 : 52,
                },
              ]}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Get Started with TeaLeaf Tracker"
            >
              <Text
                style={[
                  styles.buttonText,
                  { fontSize: isDesktop ? typography.sizes.lg : typography.sizes.md },
                ]}
              >
                Get Started →
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
 safeArea: {
  flex: 1,
  backgroundColor: '#0B2A14',
},
bgImage: {
  flex: 1,
  width: '100%',
  height: '100%',
},
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 30, 10, 0.52)',
  },
  innerContent: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  topSection: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  logo: {
    maxWidth: '80%',
  },
  appName: {
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  tagline: {
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  middleSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  description: {
    lineHeight: typography.lineHeights.md,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomSection: {
    paddingBottom: spacing.md,
  },
  button: {
    width: '100%',
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
});
