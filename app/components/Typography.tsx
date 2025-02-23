import React from 'react';
import {
  Text as RNText,
  TextStyle,
  StyleSheet,
  StyleProp,
} from 'react-native';
import theme from '../styles/theme';

interface TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: keyof typeof theme.colors.text;
  weight?: keyof typeof theme.typography.weights;
  center?: boolean;
}

const Text = ({
  children,
  style,
  variant = 'body',
  color = 'primary',
  weight = 'regular',
  center = false,
}: TextProps) => {
  return (
    <RNText
      style={[
        styles.base,
        styles[variant],
        { color: theme.colors.text[color] },
        { fontWeight: theme.typography.weights[weight] },
        center && styles.center,
        style,
      ]}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    color: theme.colors.text.primary,
  },
  center: {
    textAlign: 'center',
  },
  h1: {
    fontSize: theme.typography.sizes.xxl,
    lineHeight: theme.typography.sizes.xxl * 1.2,
    fontWeight: theme.typography.weights.bold,
  },
  h2: {
    fontSize: theme.typography.sizes.xl,
    lineHeight: theme.typography.sizes.xl * 1.2,
    fontWeight: theme.typography.weights.bold,
  },
  h3: {
    fontSize: theme.typography.sizes.lg,
    lineHeight: theme.typography.sizes.lg * 1.2,
    fontWeight: theme.typography.weights.semibold,
  },
  body: {
    fontSize: theme.typography.sizes.md,
    lineHeight: theme.typography.sizes.md * 1.5,
  },
  caption: {
    fontSize: theme.typography.sizes.sm,
    lineHeight: theme.typography.sizes.sm * 1.5,
    color: theme.colors.text.secondary,
  },
  label: {
    fontSize: theme.typography.sizes.xs,
    lineHeight: theme.typography.sizes.xs * 1.5,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: theme.typography.weights.semibold,
  },
});

export default Text; 