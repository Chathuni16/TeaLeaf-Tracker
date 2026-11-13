import { ImageSourcePropType } from 'react-native';
import { teaImages, teaTypeImages, regionImages, estateImages, heroImages, logoImage } from '../data/images';

/**
 * Default fallback placeholder image bundled locally for any tea or estate with a missing image.
 */
export const DEFAULT_FALLBACK_IMAGE: ImageSourcePropType = heroImages.heroBanner;

/**
 * Single registry for all bundled local images.
 * Keeps image loading 100% offline and avoids runtime packager errors.
 * Backed by src/data/images.ts.
 */
export const imageMap: Record<string, ImageSourcePropType> = {
  // App logo
  logo: logoImage,

  // Region images
  ...regionImages,

  // Tea-specific images
  ...teaImages,

  // Estate-specific images
  ...estateImages,

  // Tea type fallbacks (also accessible by type name as key)
  Black: teaTypeImages['Black'],
  Green: teaTypeImages['Green'],
  White: teaTypeImages['White'],
  'Silver Tips': teaTypeImages['Silver Tips'],
  black_tea: teaTypeImages['Black'],
  green_tea: teaTypeImages['Green'],
  white_tea: teaTypeImages['White'],
  silver_tips_tea: teaTypeImages['Silver Tips'],

  // Hero & General
  welcome_bg: heroImages.welcomeBg,
  hero_tea: heroImages.heroBanner,
  brew_cup: heroImages.brewCup,
};

/**
 * Safe image resolver that always returns a valid bundled ImageSourcePropType.
 * If an asset key is missing or not found, gracefully falls back to DEFAULT_FALLBACK_IMAGE.
 */
export const getImageSource = (key: string | undefined | null): ImageSourcePropType => {
  if (!key) return DEFAULT_FALLBACK_IMAGE;
  return imageMap[key] || DEFAULT_FALLBACK_IMAGE;
};
