import { useWindowDimensions } from 'react-native';

export type Breakpoint = 'phone' | 'tablet' | 'desktop';

export interface ResponsiveInfo {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  numColumns: number; // 1 below 600px, 2 for 600-900px, 3 above 900px
  contentMaxWidth: number;
  formMaxWidth: number;
  scale: number;
}

export const BREAKPOINTS = {
  phoneMax: 599,
  tabletMin: 600,
  tabletMax: 900,
  desktopMin: 901,
} as const;

/**
 * Returns the responsive column count based on viewport width:
 * - 1 column below 600px
 * - 2 columns for 600-900px
 * - 3 columns above 900px
 */
export const getNumColumns = (width: number): number => {
  if (width < 600) return 1;
  if (width <= 900) return 2;
  return 3;
};

export const getBreakpoint = (width: number): Breakpoint => {
  if (width < 600) return 'phone';
  if (width <= 900) return 'tablet';
  return 'desktop';
};

/**
 * Hook providing dynamic viewport dimensions and breakpoint utilities.
 * Reacts automatically to window resizing and orientation changes.
 */
export const useResponsive = (): ResponsiveInfo => {
  const { width, height } = useWindowDimensions();
  const breakpoint = getBreakpoint(width);
  const isPhone = width < 600;
  const isTablet = width >= 600 && width <= 900;
  const isDesktop = width > 900;
  const isWide = width >= 600;
  const numColumns = getNumColumns(width);

  // Responsive max widths for centered content
  const contentMaxWidth = isDesktop ? 1160 : isTablet ? 840 : 600;
  const formMaxWidth = 600;
  const scale = isDesktop ? 1.15 : isTablet ? 1.05 : 1;

  return {
    width,
    height,
    breakpoint,
    isPhone,
    isTablet,
    isDesktop,
    isWide,
    numColumns,
    contentMaxWidth,
    formMaxWidth,
    scale,
  };
};
