import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from './components/Screen';
import Text from './components/Typography';
import Button from './components/Button';
import { useFavorites } from '../contexts/FavoritesContext';
import * as Haptics from 'expo-haptics';
import theme from './styles/theme';
import { LinearGradient } from 'expo-linear-gradient';

type RecipeDetailsParams = {
  name: string;
  ingredients: string;
  instructions: string;
  imageUrl?: string;
  isFavorite: string;
};

export default function RecipeDetailsScreen() {
  const params = useLocalSearchParams<RecipeDetailsParams>();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  const name = params.name || 'Recipe';
  const ingredients = params.ingredients ? JSON.parse(params.ingredients) : [];
  const instructions = params.instructions ? JSON.parse(params.instructions) : [];
  const imageUrl = params.imageUrl;
  const favorite = params.isFavorite === 'true';

  const handleFavoritePress = async () => {
    try {
      if (favorite || isFavorite(name)) {
        await removeFavorite(name);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await addFavorite({
          name,
          ingredients,
          instructions,
          image_url: imageUrl
        });
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <Screen>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <>
              <Image source={{ uri: imageUrl }} style={styles.image} />
              <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'transparent']}
                style={styles.imageGradient}
              />
            </>
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="wine-outline" size={48} color="#333" />
            </View>
          )}
          
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={handleFavoritePress}
            >
              <Ionicons 
                name={favorite || isFavorite(name) ? "heart" : "heart-outline"} 
                size={24} 
                color={favorite || isFavorite(name) ? theme.colors.accent : theme.colors.text.primary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text variant="h2" style={styles.title}>{name}</Text>
          
          <View style={styles.strengthContainer}>
            <Text style={styles.strengthText}>Strong</Text>
          </View>

          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.tagsContainer}>
              {ingredients.map((ingredient, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.tag,
                    index % 2 === 0 ? styles.darkTag : styles.lightTag
                  ]}
                >
                  <Text 
                    style={[
                      styles.tagText,
                      index % 2 === 0 ? styles.lightTagText : styles.darkTagText
                    ]}
                  >
                    {ingredient}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Instructions</Text>
            {instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Equipment</Text>
            <View style={styles.equipmentList}>
              {['Shaker', 'Strainer', 'Glass'].map((item, index) => (
                <Text key={index} style={styles.equipmentItem}>• {item}</Text>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Take Another Photo"
              icon="camera-alt"
              onPress={() => router.push('/camera')}
              gradient
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 350,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    marginTop: -40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: theme.colors.background.dark,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  strengthContainer: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  strengthText: {
    color: theme.colors.accent,
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  darkTag: {
    backgroundColor: '#252525',
  },
  lightTag: {
    backgroundColor: 'rgba(245, 245, 240, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 245, 240, 0.2)',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  lightTagText: {
    color: theme.colors.text.primary,
  },
  darkTagText: {
    color: theme.colors.text.primary,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  instructionNumberText: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.primary,
  },
  equipmentList: {
    gap: 8,
  },
  equipmentItem: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    marginTop: 8,
    backgroundColor: theme.colors.accent,
  },
}); 