import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const theme = {
  colors: {
    // Primary colors
    primary: '#121212', // Elegant black
    secondary: '#F5F5F0', // Soft off-white
    accent: '#D4AF37', // Gold accent

    // Background colors
    background: {
      dark: '#121212', // Rich black
      card: '#1A1A1A', // Slightly lighter black
      highlight: '#252525', // Dark gray
      overlay: 'rgba(0, 0, 0, 0.85)', // Dark overlay
    },

    // Text colors
    text: {
      primary: '#F5F5F0', // Off white
      secondary: '#A0A0A0', // Muted silver
      accent: '#D4AF37', // Gold
      error: '#E74C3C', // Elegant red
      success: '#2ECC71', // Emerald
    },

    // Status colors
    status: {
      success: '#2ECC71', // Emerald
      error: '#E74C3C', // Elegant red
      warning: '#F39C12', // Amber
      info: '#3498DB', // Blue
    },

    // Gradients
    gradients: {
      primary: ['#121212', '#1A1A1A'], // Black gradient
      accent: ['#D4AF37', '#B8860B'], // Gold gradient
      dark: ['#121212', '#1A1A1A'], // Dark gradient
      glass: ['rgba(26, 26, 26, 0.8)', 'rgba(18, 18, 18, 0.9)'], // Glass effect
    },
  },

  // Typography
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
      display: 48,
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    fonts: {
      primary: 'System',
      secondary: 'Georgia',
    },
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
      wider: 1,
      widest: 2,
    },
  },

  // Spacing
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border Radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 9999,
  },

  // Shadows
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
    glass: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.44,
      shadowRadius: 16,
      elevation: 16,
    },
  },

  // Layout
  layout: {
    width,
    height,
    screenPadding: 20,
    maxContentWidth: 500,
    headerHeight: 180,
  },

  // Animation durations
  animation: {
    short: 200,
    medium: 300,
    long: 500,
  },

  // Blur effects
  blur: {
    light: 10,
    medium: 20,
    heavy: 30,
    glass: 40,
  },

  // Overlays
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    heavy: 'rgba(0, 0, 0, 0.7)',
    solid: 'rgba(0, 0, 0, 0.9)',
  },
} as const;

export type Theme = typeof theme;
export default theme; 