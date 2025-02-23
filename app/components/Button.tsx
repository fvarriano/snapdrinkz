import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import theme from '../styles/theme';
import { MaterialIcons } from '@expo/vector-icons';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  gradient?: boolean;
}

const Button = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  gradient = false,
}: ButtonProps) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: theme.colors.primary,
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
        };
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.lg,
          paddingHorizontal: theme.spacing.xl,
        };
      default:
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        };
    }
  };

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : theme.colors.text.primary} />
      ) : (
        <Text style={[
          styles.text,
          variant === 'outline' && styles.outlineText,
          size === 'small' && styles.smallText,
          size === 'large' && styles.largeText,
          textStyle,
        ]}>
          {icon && (
            <MaterialIcons
              name={icon}
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
              color={variant === 'outline' ? theme.colors.primary : theme.colors.text.primary}
              style={styles.icon}
            />
          )}
          {title}
        </Text>
      )}
    </>
  );

  const buttonStyles = [
    styles.button,
    getVariantStyles(),
    getSizeStyles(),
    disabled && styles.disabled,
    style,
  ];

  if (gradient && variant !== 'outline') {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[animatedStyle]}
      >
        <LinearGradient
          colors={theme.colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={buttonStyles}
        >
          {buttonContent}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[buttonStyles, animatedStyle]}
    >
      {buttonContent}
    </AnimatedTouchable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...theme.shadows.small,
  },
  text: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    textAlign: 'center',
  },
  outlineText: {
    color: theme.colors.primary,
  },
  smallText: {
    fontSize: theme.typography.sizes.sm,
  },
  largeText: {
    fontSize: theme.typography.sizes.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
}); 