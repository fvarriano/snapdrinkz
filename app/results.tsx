import React from 'react';
import { View, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { analyzeImage } from '../lib/googleVision';
import { findCocktails } from '../lib/cocktails';
import Screen from './components/Screen';
import Text from './components/Typography';
import Button from './components/Button';
import Card from './components/Card';
import LoadingIndicator from './components/LoadingIndicator';
import theme from './styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../contexts/FavoritesContext';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import RecipeCard from './components/RecipeCard';

const AnimatedCard = Animated.createAnimatedComponent(Card);

type ResultsParams = {
  imageUri: string;
  imageBase64: string;
};

interface CocktailRecipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  equipment?: string[];
  strength?: string;
}

export default function ResultsScreen() {
  const params = useLocalSearchParams<ResultsParams>();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [bottles, setBottles] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<CocktailRecipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);

  useEffect(() => {
    async function analyze() {
      console.log('Checking image data:', {
        hasUri: Boolean(params.imageUri),
        hasBase64: Boolean(params.imageBase64),
        base64Length: params.imageBase64?.length,
      });

      if (!params.imageBase64) {
        setError('No image data provided');
        setLoading(false);
        return;
      }

      try {
        const result = await analyzeImage(params.imageBase64);
        console.log('Analysis result:', {
          hasError: Boolean(result.error),
          bottlesCount: result.bottles.length,
        });

        if (result.error) {
          setError(result.error);
        } else {
          setBottles(result.bottles);
          
          // Extract ingredient names from the detected bottles
          const extractedIngredients = result.bottles
            .map(bottle => {
              const match = bottle.match(/Detected: (.*?) \(/);
              return match ? match[1].trim() : null;
            })
            .filter(Boolean) as string[];
          
          setDetectedIngredients(extractedIngredients);
          
          const possibleCocktails = findCocktails(result.bottles);
          console.log('Found cocktails:', possibleCocktails.length);
          setRecipes(possibleCocktails);
        }
      } catch (err) {
        console.error('Error in analyze function:', err);
        setError('Failed to analyze image');
      } finally {
        setLoading(false);
      }
    }
    analyze();
  }, [params.imageBase64]);

  const handleFavoritePress = async (recipe: CocktailRecipe) => {
    try {
      setFavoriteError(null);
      if (isFavorite(recipe.name)) {
        await removeFavorite(recipe.name);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await addFavorite({
          name: recipe.name,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          image_url: params.imageUri
        });
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setFavoriteError('Failed to update favorites. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <LoadingIndicator text="Analyzing your selection..." />
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text variant="h2" color="error" center>Error</Text>
          <Text variant="body" color="secondary" center style={styles.errorText}>
            {error}
          </Text>
          <Button
            title="Try Again"
            icon="camera-alt"
            onPress={() => router.replace('/camera')}
            gradient
            style={styles.actionButton}
          />
        </View>
      </Screen>
    );
  }

  if (bottles.length === 0) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <MaterialIcons name="search-off" size={48} color="#94A3B8" />
          <Text variant="h2" center>No Bottles Detected</Text>
          <Text variant="body" color="secondary" center style={styles.errorText}>
            Try taking another photo with better lighting and positioning
          </Text>
          <Button
            title="Try Again"
            icon="camera-alt"
            onPress={() => router.replace('/camera')}
            gradient
            style={styles.actionButton}
          />
        </View>
      </Screen>
    );
  }

  if (recipes.length === 0) {
    return (
      <Screen>
        <ScrollView style={styles.container}>
          <View style={styles.errorContainer}>
            <MaterialIcons name="local-bar" size={48} color="#94A3B8" />
            <Text variant="h2" center>No Matching Recipes</Text>
            <Text variant="body" color="secondary" center style={styles.errorText}>
              We detected these ingredients:
            </Text>
            
            <View style={styles.detectedItems}>
              {detectedIngredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientTag}>
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>
            
            <Text variant="body" color="secondary" center style={styles.errorText}>
              But we couldn't find any cocktail recipes that match. Try taking a photo of different bottles.
            </Text>
            
            <Button
              title="Try Again"
              icon="camera-alt"
              onPress={() => router.replace('/camera')}
              gradient
              style={styles.actionButton}
            />
          </View>
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {favoriteError && (
          <Text style={styles.errorBanner} color="error" center>
            {favoriteError}
          </Text>
        )}

        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.name}
            name={recipe.name}
            ingredients={recipe.ingredients}
            equipment={recipe.equipment || ['Shaker', 'Strainer', 'Glass']}
            description={recipe.instructions.join('\n')}
            strength="Strong 37%"
            imageUrl={params.imageUri}
            isFavorite={isFavorite(recipe.name)}
            onFavoritePress={() => handleFavoritePress(recipe)}
          />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  errorText: {
    marginTop: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorBanner: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  actionButton: {
    marginTop: 16,
    minWidth: 200,
  },
  detectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  ingredientTag: {
    backgroundColor: '#E7F5FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ingredientText: {
    color: '#228BE6',
    fontSize: 14,
    fontWeight: '500',
  },
}); 