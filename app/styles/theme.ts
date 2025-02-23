import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const theme = {
  colors: {
    // Primary colors
    primary: '#8B4513', // Elegant brown
    secondary: '#D4AF37', // Royal gold
    accent: '#C41E3A', // Rich red

    // Background colors
    background: {
      dark: '#1A1A1A', // Deep black
      card: '#2A2A2A', // Dark gray
      highlight: '#3A3A3A', // Light gray
    },

    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
      accent: '#D4AF37', // Gold
      error: '#C41E3A', // Rich red
      success: '#2E8B57', // Emerald green
    },

    // Status colors
    status: {
      success: '#2E8B57', // Emerald green
      error: '#C41E3A', // Rich red
      warning: '#D4AF37', // Gold
      info: '#4682B4', // Steel blue
    },

    // Gradients
    gradients: {
      primary: ['#8B4513', '#D4AF37'], // Brown to gold
      accent: ['#C41E3A', '#D4AF37'], // Red to gold
      dark: ['#1A1A1A', '#2A2A2A'], // Dark gradient
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
    fonts: {
      primary: 'System',
      secondary: 'Georgia',
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
    glass: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
    },
  },

  // Layout
  layout: {
    width,
    height,
    screenPadding: 20,
    maxContentWidth: 500,
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
  },
} as const;

export type Theme = typeof theme;
export default theme; 