import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Screen from './components/Screen';
import Text from './components/Typography';
import theme from './styles/theme';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

export default function CameraScreen() {
  const [image, setImage] = useState<{ uri: string; base64: string | undefined } | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setImage({
          uri: result.assets[0].uri,
          base64: result.assets[0].base64,
        });
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleConfirm = async () => {
    if (image?.uri && image?.base64) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.replace({
        pathname: '/results',
        params: {
          imageUri: image.uri,
          imageBase64: image.base64,
        }
      });
    }
  };

  const handleRetake = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setImage(null);
  };

  const goBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {!image ? (
        <>
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={styles.headerGradient}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={goBack}
            >
              <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.cameraPlaceholder}>
            <View style={styles.instructionContainer}>
              <Text variant="h2" style={styles.instructionTitle}>
                Take a Photo
              </Text>
              <Text variant="body" color="secondary" style={styles.instructionText}>
                Position your bottles in frame and take a clear photo
              </Text>
            </View>
          </View>

          <BlurView intensity={30} tint="dark" style={styles.bottomBar}>
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={takePicture}
              disabled={cameraPermission === false}
            >
              <View style={styles.captureButtonInner}>
                <Ionicons name="camera" size={28} color="#000" />
              </View>
            </TouchableOpacity>
          </BlurView>
        </>
      ) : (
        <>
          <Image source={{ uri: image.uri }} style={styles.preview} />
          
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={styles.headerGradient}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleRetake}
            >
              <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
              <Text style={styles.backText}>Retake</Text>
            </TouchableOpacity>
          </LinearGradient>

          <BlurView intensity={30} tint="dark" style={styles.bottomBar}>
            <TouchableOpacity 
              style={styles.analyzeButton}
              onPress={handleConfirm}
            >
              <Text style={styles.analyzeButtonText}>Find Recipes</Text>
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </TouchableOpacity>
          </BlurView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  instructionContainer: {
    alignItems: 'center',
    padding: 24,
  },
  instructionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 26,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  analyzeButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
  analyzeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
}); 