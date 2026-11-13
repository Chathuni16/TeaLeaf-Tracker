/**
 * src/data/images.ts
 *
 * Centralised, typed image registry for TeaLeaf Tracker.
 *
 * Metro bundler requires static require() calls — no dynamic strings allowed.
 * All images are bundled at build-time for 100% offline use.
 *
 * Usage:
 *   import { getTeaImage, getEstateImage, getRegionImage, heroImages } from '../data/images';
 *   <TeaImage source={getTeaImage(tea.image_key, tea.type)} />
 *   <TeaImage source={getEstateImage(estate.image_key || estate.id, estate.region_id)} />
 *   <TeaImage source={getRegionImage(region.id)} />
 */

import { ImageSourcePropType } from 'react-native';

// ---------------------------------------------------------------------------
// Raw asset require() registry (grouped by category)
// ---------------------------------------------------------------------------

/** Tea images — keyed by specific tea ID / image_key */
export const teaImages: Record<string, ImageSourcePropType> = {
  dimbula_op: require('../../assets/images/teas/tea_black_01.jpg'),
  dimbula_bp: require('../../assets/images/teas/tea_black_02.jpg'),
  dimbula_green: require('../../assets/images/teas/tea_green_01.jpg'),
  dimbula_silver: require('../../assets/images/teas/tea_silver_01.jpg'),
  nuwara_eliya_pekoe: require('../../assets/images/teas/tea_black_01.jpg'),
  ceylon_silver_tips: require('../../assets/images/teas/tea_silver_02.jpg'),
  kandy_green: require('../../assets/images/teas/tea_green_02.jpg'),
  nuwara_eliya_fbop: require('../../assets/images/teas/tea_black_02.jpg'),
  nuwara_eliya_white: require('../../assets/images/teas/tea_white_01.jpg'),
  uva_highland_op: require('../../assets/images/teas/tea_black_01.jpg'),
  uva_green_special: require('../../assets/images/teas/tea_green_01.jpg'),
  uva_silver_buds: require('../../assets/images/teas/tea_silver_01.jpg'),
  kandy_fbop: require('../../assets/images/teas/tea_black_02.jpg'),
  kandy_white_peony: require('../../assets/images/teas/tea_white_02.jpg'),
  ruhuna_op1: require('../../assets/images/teas/tea_black_01.jpg'),
  ruhuna_virgin_white: require('../../assets/images/teas/tea_white_01.jpg'),
  ruhuna_green_pearl: require('../../assets/images/teas/tea_green_02.jpg'),
  sabaragamuwa_op: require('../../assets/images/teas/tea_black_02.jpg'),
  sabaragamuwa_silver: require('../../assets/images/teas/tea_silver_01.jpg'),
  sabaragamuwa_white: require('../../assets/images/teas/tea_white_02.jpg'),
  dimbula_golden_infusion: require('../../assets/images/teas/tea_black_01.jpg'),
};

/**
 * Tea type images — one representative image per tea type.
 * Used as a fallback when a tea's specific image_key has no entry.
 */
export const teaTypeImages: Record<string, ImageSourcePropType> = {
  Black: require('../../assets/images/teas/tea_black_01.jpg'),
  Green: require('../../assets/images/teas/tea_green_01.jpg'),
  White: require('../../assets/images/teas/tea_white_01.jpg'),
  'Silver Tips': require('../../assets/images/teas/tea_silver_01.jpg'),
};

/** Region landscape images — keyed by region ID */
export const regionImages: Record<string, ImageSourcePropType> = {
  nuwara_eliya: require('../../assets/images/regions/region_nuwara_eliya.jpg'),
  uva: require('../../assets/images/regions/region_uva.jpg'),
  dimbula: require('../../assets/images/regions/region_dimbula.jpg'),
  kandy: require('../../assets/images/regions/region_kandy.jpg'),
  ruhuna: require('../../assets/images/regions/region_ruhuna.jpg'),
  sabaragamuwa: require('../../assets/images/regions/region_sabaragamuwa.jpg'),
};

/** Estate images — keyed by estate ID / image_key for all 10 estates */
export const estateImages: Record<string, ImageSourcePropType> = {
  pedro_estate: require('../../assets/images/estates/estate_01.jpg'),
  labookellie: require('../../assets/images/estates/estate_02.jpg'),
  uva_halpewatte: require('../../assets/images/estates/estate_03.jpg'),
  kandy_estate: require('../../assets/images/estates/estate_04.jpg'),
  handunugoda: require('../../assets/images/estates/estate_05.jpg'),
  norwood_estate: require('../../assets/images/estates/estate_06.jpg'),
  bluefield_gardens: require('../../assets/images/estates/estate_07.jpg'),
  bogawantalawa_estate: require('../../assets/images/estates/estate_08.jpg'),
  poronuwa_estate: require('../../assets/images/estates/estate_09.jpg'),
  loolkandura: require('../../assets/images/estates/estate_10.jpg'),
};

/** Hero / background images */
export const heroImages = {
  heroBanner: require('../../assets/images/home_hero.jpg') as ImageSourcePropType,
  welcomeBg: require('../../assets/images/welcome_bg.jpg') as ImageSourcePropType,
  brewCup: require('../../assets/images/brew_cup.jpg') as ImageSourcePropType,
};

/** App logo */
export const logoImage: ImageSourcePropType = require('../../assets/images/logo.png');

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Returns the best available image source for a tea.
 * Priority: specific tea ID → tea type → tea type 'Black' fallback (never estate/landscape).
 */
export const getTeaImage = (
  imageKey?: string | null,
  teaType?: string | null
): ImageSourcePropType => {
  if (imageKey && teaImages[imageKey]) return teaImages[imageKey];
  if (imageKey) {
    const normKey = imageKey.toLowerCase().replace(/\s+/g, '_');
    if (teaImages[normKey]) return teaImages[normKey];
  }
  if (teaType && teaTypeImages[teaType]) return teaTypeImages[teaType];
  return teaTypeImages['Black'];
};

/**
 * Returns the best available image source for an estate.
 * Priority: specific estate ID / key → region ID → hero banner fallback.
 */
export const getEstateImage = (
  estateKeyOrId?: string | null,
  regionId?: string | null
): ImageSourcePropType => {
  if (estateKeyOrId && estateImages[estateKeyOrId]) return estateImages[estateKeyOrId];
  if (estateKeyOrId) {
    const normEstate = estateKeyOrId.toLowerCase().replace(/\s+/g, '_');
    if (estateImages[normEstate]) return estateImages[normEstate];
  }
  if (regionId && regionImages[regionId]) return regionImages[regionId];
  if (regionId) {
    const normRegion = regionId.toLowerCase().replace(/\s+/g, '_');
    if (regionImages[normRegion]) return regionImages[normRegion];
  }
  return heroImages.heroBanner;
};

/**
 * Returns the region image for a given region ID.
 * Falls back to the hero banner if the region has no image.
 */
export const getRegionImage = (regionId?: string | null): ImageSourcePropType => {
  if (regionId && regionImages[regionId]) return regionImages[regionId];
  if (regionId) {
    const normRegion = regionId.toLowerCase().replace(/\s+/g, '_');
    if (regionImages[normRegion]) return regionImages[normRegion];
  }
  return heroImages.heroBanner;
};
