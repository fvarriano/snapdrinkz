import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export default function MartiniIcon({ size = 80, color = '#B38B59' }) {
  const sparkleOpacity1 = useRef(new Animated.Value(0)).current;
  const sparkleOpacity2 = useRef(new Animated.Value(0)).current;
  const sparkleOpacity3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(sparkleOpacity1, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleOpacity2, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleOpacity3, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        sparkleOpacity1.setValue(0);
        sparkleOpacity2.setValue(0);
        sparkleOpacity3.setValue(0);
        animate();
      });
    };

    animate();
  }, []);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Martini Glass */}
        <Path
          d="M20 20 L80 20 L50 70 L45 70 L50 85 L35 85 L35 90 L65 90 L65 85 L50 85 L55 70 L50 70 Z"
          fill={color}
          fillRule="evenodd"
        />
        
        {/* Olive */}
        <Circle cx="50" cy="35" r="5" fill="#2E8B57" />
      </Svg>
      
      {/* Animated Sparkles */}
      <Animated.View style={[styles.sparkle, styles.sparkle1, { opacity: sparkleOpacity1 }]} />
      <Animated.View style={[styles.sparkle, styles.sparkle2, { opacity: sparkleOpacity2 }]} />
      <Animated.View style={[styles.sparkle, styles.sparkle3, { opacity: sparkleOpacity3 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  sparkle1: {
    top: 15,
    right: 25,
  },
  sparkle2: {
    top: 30,
    left: 25,
  },
  sparkle3: {
    top: 45,
    right: 30,
  },
}); 