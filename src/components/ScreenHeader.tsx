import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useResponsive } from '../utils/responsive';

interface ScreenHeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    accessibilityLabel: string;
  };
  subtitle?: string;
  containerStyle?: StyleProp<ViewStyle>;
  maxWidth?: number;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  rightAction,
  subtitle,
  containerStyle,
  maxWidth,
}) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { isDesktop } = useResponsive();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
        maxWidth ? { maxWidth, alignSelf: 'center', width: '100%' } : null,
        containerStyle,
      ]}
    >
      <View style={styles.leftRow}>
        {showBack && (
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.iconButton, { backgroundColor: colors.surface }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={isDesktop ? 26 : 24} color={colors.text} />
          </TouchableOpacity>
        )}
        {title ? (
          <View style={styles.titleContainer}>
            <Text
              style={[
                styles.title,
                { color: colors.text, fontSize: isDesktop ? typography.sizes.xl : typography.sizes.lg },
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        ) : null}
      </View>

      {rightAction && (
        <TouchableOpacity
          onPress={rightAction.onPress}
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          accessibilityRole="button"
          accessibilityLabel={rightAction.accessibilityLabel}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name={rightAction.icon} size={isDesktop ? 24 : 22} color={colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleContainer: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  title: {
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
});
