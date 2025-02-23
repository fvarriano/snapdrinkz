import React, { forwardRef } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import theme from '../styles/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  blurEffect?: boolean;
  intensity?: number;
}

const Card = forwardRef<View, CardProps>(({
  children,
  style,
  onPress,
  blurEffect = false,
  intensity = 50,
}, ref) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const cardContent = (
    <View ref={ref} style={[styles.card, style]}>
      {children}
    </View>
  );

  if (blurEffect) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.container, animatedStyle]}
      >
        <BlurView intensity={intensity} style={StyleSheet.absoluteFill} />
        {cardContent}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle]}
    >
      {cardContent}
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
});

export default Card; 