import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

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
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <MaterialIcons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {!image ? (
        <View style={styles.cameraPlaceholder}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <MaterialIcons name="camera-alt" size={32} color="white" />
            <Text style={styles.captureText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image.uri }} style={styles.preview} />
          <View style={styles.previewButtons}>
            <TouchableOpacity style={styles.button} onPress={handleRetake}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton]} 
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Analyze</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    padding: 20,
    borderRadius: 10,
  },
  captureText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: '80%',
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#32cd32',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
}); 