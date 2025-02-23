import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../styles/theme';
import { BlurView } from 'expo-blur';

interface ScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  useBlur?: boolean;
  intensity?: number;
}

const Screen = ({
  children,
  style,
  useBlur = false,
  intensity = 50,
}: ScreenProps) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="light-content" />
      {useBlur ? (
        <>
          <BlurView
            intensity={intensity}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.content}>{children}</View>
        </>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </SafeAreaView>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  },
  content: {
    flex: 1,
    padding: theme.layout.screenPadding,
  },
}); 