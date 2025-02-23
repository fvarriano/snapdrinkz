import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import theme from '../styles/theme';
import Text from './Typography';

interface LoadingIndicatorProps {
  size?: number;
  text?: string;
}

const LoadingIndicator = ({ size = 8, text }: LoadingIndicatorProps) => {
  const dots = Array(3).fill(0);
  const animations = dots.map((_, i) => useSharedValue(0));

  React.useEffect(() => {
    dots.forEach((_, i) => {
      animations[i].value = withRepeat(
        withSequence(
          withDelay(
            i * 200,
            withTiming(1, {
              duration: 500,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
          ),
          withTiming(0, {
            duration: 500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        ),
        -1,
        false,
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        {dots.map((_, i) => {
          const animatedStyle = useAnimatedStyle(() => ({
            transform: [
              { scale: animations[i].value },
              { translateY: animations[i].value * -10 },
            ],
            opacity: animations[i].value,
          }));

          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                { width: size, height: size, borderRadius: size / 2 },
                animatedStyle,
              ]}
            />
          );
        })}
      </View>
      {text && (
        <Text
          variant="caption"
          color="secondary"
          style={styles.text}
        >
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
  },
  dot: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: 4,
  },
  text: {
    marginTop: theme.spacing.md,
  },
});

export default LoadingIndicator; 