export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSubtle: string;
  card: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  text: string;
  textMuted: string;
  textLight: string;
  border: string;
  borderLight: string;
  chipSelected: string;
  chipSelectedText: string;
  chipUnselected: string;
  chipUnselectedText: string;
  chipBorder: string;
  heart: string;
  badgeBg: string;
  badgeText: string;
  error: string;
  success: string;
  warning: string;
  overlay: string;
}

export const lightColors: ThemeColors = {
  background: '#F6F8F0',
  surface: '#FFFFFF',
  surfaceSubtle: '#F0F4EC',
  card: '#FFFFFF',
  primary: '#0F5B2E',
  primaryLight: '#E8F5E9',
  primaryDark: '#083B1D',
  accent: '#2F9E4F',
  text: '#1B2A1F',
  textMuted: '#6B7A6F',
  textLight: '#8C9A90',
  border: '#E1E9E0',
  borderLight: '#EDF3EC',
  chipSelected: '#0F5B2E',
  chipSelectedText: '#FFFFFF',
  chipUnselected: '#FFFFFF',
  chipUnselectedText: '#1B2A1F',
  chipBorder: '#C8D6C9',
  heart: '#E53935',
  badgeBg: '#E8F5E9',
  badgeText: '#0F5B2E',
  error: '#D32F2F',
  success: '#2F9E4F',
  warning: '#F57C00',
  overlay: 'rgba(15, 91, 46, 0.45)',
};

export const darkColors: ThemeColors = {
  background: '#0B140E',
  surface: '#142218',
  surfaceSubtle: '#192C1F',
  card: '#1A2D21',
  primary: '#2F9E4F',
  primaryLight: '#1C3624',
  primaryDark: '#0F5B2E',
  accent: '#45B865',
  text: '#F1F6F2',
  textMuted: '#9BB0A1',
  textLight: '#7A8E80',
  border: '#223829',
  borderLight: '#1C3022',
  chipSelected: '#2F9E4F',
  chipSelectedText: '#FFFFFF',
  chipUnselected: '#1A2D21',
  chipUnselectedText: '#E0E8E2',
  chipBorder: '#2E4736',
  heart: '#FF5252',
  badgeBg: '#1C3624',
  badgeText: '#45B865',
  error: '#EF5350',
  success: '#45B865',
  warning: '#FFA726',
  overlay: 'rgba(0, 0, 0, 0.65)',
};
