import React, { useState } from 'react';
import { View, Image, StyleSheet, StyleProp, ImageStyle, ViewStyle, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getImageSource, DEFAULT_FALLBACK_IMAGE } from '../utils/imageMap';

interface TeaImageProps {
  source?: ImageSourcePropType;
  imageKey?: string | null;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  accessibilityLabel?: string;
}

export const TeaImage: React.FC<TeaImageProps> = ({
  source: propSource,
  imageKey,
  style,
  containerStyle,
  iconSize = 28,
  resizeMode = 'cover',
  accessibilityLabel,
}) => {
  const [hasError, setHasError] = useState(false);
  const source = !hasError
    ? (propSource ?? (imageKey ? getImageSource(imageKey) : DEFAULT_FALLBACK_IMAGE))
    : DEFAULT_FALLBACK_IMAGE;

  if (hasError) {
    return (
      <View
        style={[styles.placeholderContainer, containerStyle, style as ViewStyle]}
        accessible={true}
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel || 'Tea image placeholder'}
      >
        <LinearGradient
          colors={['#185a32', '#2f9e4f', '#66bb6a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Ionicons name="leaf" size={iconSize} color="#FFFFFF" style={styles.leafIcon} />
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.imageWrapper, containerStyle, style as ViewStyle]}>
      <Image
        source={source}
        style={[styles.image, style]}
        resizeMode={resizeMode}
        onError={() => setHasError(true)}
        accessible={true}
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel || 'Tea illustration'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafIcon: {
    opacity: 0.9,
  },
});
