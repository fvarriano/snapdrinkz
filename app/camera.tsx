import { View, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Screen from './components/Screen';
import Text from './components/Typography';
import Button from './components/Button';
import Card from './components/Card';
import theme from './styles/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function CameraScreen() {
  const [image, setImage] = useState<{ uri: string; base64: string | undefined } | null>(null);

  const takePicture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      console.log('Camera result:', { 
        canceled: result.canceled,
        hasBase64: result.assets?.[0]?.base64 ? 'yes' : 'no',
      });

      if (!result.canceled && result.assets[0].base64) {
        setImage({
          uri: result.assets[0].uri,
          base64: result.assets[0].base64,
        });
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const handleConfirm = () => {
    if (image?.uri && image?.base64) {
      console.log('Sending image to results screen');
      router.replace({
        pathname: '/results',
        params: {
          imageUri: image.uri,
          imageBase64: image.base64,
        }
      });
    }
  };

  const handleRetake = () => {
    setImage(null);
  };

  const goBack = () => {
    router.replace('/');
  };

  return (
    <Screen useBlur>
      <Button
        title="Back"
        icon="arrow-back"
        variant="outline"
        size="small"
        onPress={goBack}
        style={styles.backButton}
      />

      {!image ? (
        <View style={styles.cameraPlaceholder}>
          <Card blurEffect style={styles.instructionCard}>
            <Text variant="h3" center style={styles.instructionTitle}>
              Take a Photo
            </Text>
            <Text variant="body" color="secondary" center style={styles.instructionText}>
              Position your bottles in frame and take a clear photo
            </Text>
          </Card>

          <Button
            title="Take Photo"
            icon="camera-alt"
            gradient
            size="large"
            onPress={takePicture}
            style={styles.captureButton}
          />
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image.uri }} style={styles.preview} />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.previewOverlay}
          >
            <View style={styles.previewButtons}>
              <Button
                title="Retake"
                icon="refresh"
                variant="outline"
                onPress={handleRetake}
              />
              <Button
                title="Analyze"
                icon="check"
                gradient
                onPress={handleConfirm}
              />
            </View>
          </LinearGradient>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: theme.spacing.xl,
    left: theme.spacing.lg,
    zIndex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  instructionCard: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  instructionTitle: {
    marginBottom: theme.spacing.md,
  },
  instructionText: {
    opacity: 0.8,
  },
  captureButton: {
    width: '100%',
  },
  previewContainer: {
    flex: 1,
    marginHorizontal: -theme.layout.screenPadding,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl * 2,
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
}); 