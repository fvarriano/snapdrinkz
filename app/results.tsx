import React from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { analyzeImage } from '../lib/googleVision';
import { findCocktails, findMoreCocktails } from '../lib/cocktails';
import Screen from './components/Screen';
import Text from './components/Typography';
import Button from './components/Button';
import LoadingIndicator from './components/LoadingIndicator';
import theme from './styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../contexts/FavoritesContext';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import CompactRecipeCard from './components/CompactRecipeCard';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [hasMoreRecipes, setHasMoreRecipes] = useState(true);

  useEffect(() => {
    async function analyze() {
      if (!params.imageBase64) {
        setError('No image data provided');
        setLoading(false);
        return;
      }

      try {
        const result = await analyzeImage(params.imageBase64);

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
          setRecipes(possibleCocktails);
          setHasMoreRecipes(possibleCocktails.length < 5); // Assume there are more if we got less than 5
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

  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreRecipes) return;
    
    try {
      setLoadingMore(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // This is a placeholder - you'll need to implement findMoreCocktails in your cocktails.ts file
      const moreRecipes = await findMoreCocktails(bottles, recipes.map(r => r.name));
      
      if (moreRecipes.length > 0) {
        setRecipes(prev => [...prev, ...moreRecipes]);
      } else {
        setHasMoreRecipes(false);
      }
    } catch (error) {
      console.error('Error loading more recipes:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <LoadingIndicator text="Analyzing your selection..." />
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <StatusBar barStyle="light-content" />
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
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <MaterialIcons name="search-off" size={48} color={theme.colors.text.secondary} />
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
        <StatusBar barStyle="light-content" />
        <ScrollView style={styles.container}>
          <View style={styles.errorContainer}>
            <MaterialIcons name="local-bar" size={48} color={theme.colors.text.secondary} />
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
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[theme.colors.background.dark, 'transparent']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text variant="h2" style={styles.headerTitle}>Recipes</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {favoriteError && (
          <Text style={styles.errorBanner} color="error" center>
            {favoriteError}
          </Text>
        )}

        <View style={styles.detectedContainer}>
          <Text style={styles.detectedTitle}>Detected Ingredients</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.detectedScroll}
          >
            {detectedIngredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientTag}>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.resultsTitle}>
          {recipes.length === 1 
            ? '1 Recipe Found' 
            : `${recipes.length} Recipes Found`}
        </Text>

        {recipes.map((recipe, index) => (
          <Animated.View 
            key={recipe.name}
            entering={FadeInDown.delay(index * 100).duration(300)}
          >
            <CompactRecipeCard
              name={recipe.name}
              ingredients={recipe.ingredients}
              instructions={recipe.instructions}
              strength="Strong 37%"
              imageUrl={params.imageUri}
              isFavorite={isFavorite(recipe.name)}
              onFavoritePress={() => handleFavoritePress(recipe)}
            />
          </Animated.View>
        ))}

        {hasMoreRecipes && (
          <TouchableOpacity 
            style={styles.loadMoreButton}
            onPress={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <LoadingIndicator size={24} />
            ) : (
              <>
                <Text style={styles.loadMoreText}>Find More Recipes</Text>
                <Ionicons name="search" size={16} color={theme.colors.accent} />
              </>
            )}
          </TouchableOpacity>
        )}

        <View style={styles.bottomActions}>
          <Button
            title="Take Another Photo"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 100, // Space for the header
    paddingBottom: 32,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: 40,
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
    marginVertical: 16,
    textAlign: 'center',
  },
  errorBanner: {
    padding: 8,
    marginBottom: 16,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 8,
  },
  actionButton: {
    marginTop: 16,
  },
  detectedContainer: {
    marginBottom: 20,
  },
  detectedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  detectedScroll: {
    paddingBottom: 8,
  },
  detectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 16,
  },
  ingredientTag: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  ingredientText: {
    color: theme.colors.accent,
    fontSize: 14,
    fontWeight: '500',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.accent,
    marginRight: 8,
  },
  bottomActions: {
    marginTop: 24,
  },
}); 