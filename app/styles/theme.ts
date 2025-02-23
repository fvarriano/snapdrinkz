import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const theme = {
  colors: {
    // Primary colors
    primary: '#6C63FF', // Modern purple
    secondary: '#FF6B6B', // Coral red
    accent: '#4ECDC4', // Turquoise

    // Background colors
    background: {
      dark: '#121212',
      card: '#1E1E1E',
      highlight: '#2A2A2A',
    },

    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
      accent: '#6C63FF',
      error: '#FF6B6B',
      success: '#4ECDC4',
    },

    // Status colors
    status: {
      success: '#4ECDC4',
      error: '#FF6B6B',
      warning: '#FFD93D',
      info: '#6C63FF',
    },

    // Gradients
    gradients: {
      primary: ['#6C63FF', '#4ECDC4'],
      accent: ['#FF6B6B', '#FFD93D'],
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
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Spacing
  spacing: {
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
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 8,
    },
  },

  // Layout
  layout: {
    width,
    height,
    screenPadding: 20,
  },

  // Animation durations
  animation: {
    short: 200,
    medium: 300,
    long: 500,
  },
} as const;

export type Theme = typeof theme;
export default theme; 