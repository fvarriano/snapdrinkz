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

const AnimatedCard = Animated.createAnimatedComponent(Card);

type ResultsParams = {
  imageUri: string;
  imageBase64: string;
  detectedBottles: string;
  possibleCocktails: string;
};

interface CocktailRecipe {
  name: string;
  ingredients: string[];
  instructions: string[];
}

export default function ResultsScreen() {
  const params = useLocalSearchParams<ResultsParams>();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [bottles, setBottles] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<CocktailRecipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

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
          const possibleCocktails = findCocktails(result.bottles);
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

  return (
    <Screen>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={theme.colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <MaterialIcons
              name="local-bar"
              size={32}
              color={theme.colors.text.primary}
            />
            <Text variant="h2" style={styles.title}>
              Discovered Cocktails
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {favoriteError && (
            <Card style={styles.errorBanner}>
              <Text variant="body" color="error" center>
                {favoriteError}
              </Text>
            </Card>
          )}

          {params.imageUri && (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: params.imageUri }} 
                style={styles.image} 
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.8)', 'transparent']}
                style={styles.imageOverlay}
              />
            </View>
          )}
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <LoadingIndicator text="Analyzing image..." />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Card style={styles.errorCard}>
                <Text variant="h3" color="error" center>
                  Error
                </Text>
                <Text variant="body" color="secondary" center style={styles.errorText}>
                  {error}
                </Text>
                <Button
                  title="Try Again"
                  onPress={() => router.replace('/camera')}
                  gradient
                />
              </Card>
            </View>
          ) : bottles.length === 0 ? (
            <View style={styles.noBottlesContainer}>
              <Card style={styles.messageCard}>
                <Text variant="h3" center>
                  No Bottles Detected
                </Text>
                <Text variant="body" color="secondary" center style={styles.messageText}>
                  Try taking another photo with better lighting and positioning
                </Text>
                <Button
                  title="Take Another Photo"
                  onPress={() => router.replace('/camera')}
                  gradient
                />
              </Card>
            </View>
          ) : (
            <View style={styles.recipesGrid}>
              {recipes.map((recipe, index) => (
                <AnimatedCard
                  key={recipe.name}
                  entering={FadeInDown.delay(index * 100)}
                  style={styles.recipeCard}
                >
                  <View style={styles.recipeHeader}>
                    <View style={styles.recipeTitle}>
                      <MaterialIcons
                        name="local-bar"
                        size={24}
                        color={theme.colors.accent}
                      />
                      <Text variant="h3" style={styles.recipeName}>
                        {recipe.name}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleFavoritePress(recipe)}
                      style={({ pressed }) => [
                        styles.favoriteButton,
                        pressed && styles.favoriteButtonPressed
                      ]}
                    >
                      <Ionicons
                        name={isFavorite(recipe.name) ? "heart" : "heart-outline"}
                        size={24}
                        color={theme.colors.accent}
                      />
                    </Pressable>
                  </View>

                  <View style={styles.section}>
                    <Text variant="h3" color="secondary">
                      Ingredients
                    </Text>
                    {recipe.ingredients.map((ingredient, i) => (
                      <Text key={i} variant="body" style={styles.ingredient}>
                        • {ingredient}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.section}>
                    <Text variant="h3" color="secondary">
                      Instructions
                    </Text>
                    {recipe.instructions.map((instruction, i) => (
                      <Text key={i} variant="body" style={styles.instruction}>
                        {i + 1}. {instruction}
                      </Text>
                    ))}
                  </View>
                </AnimatedCard>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Take Another Photo"
          icon="camera-alt"
          onPress={() => router.replace('/camera')}
          gradient
          style={styles.footerButton}
        />
        <Button
          title="Back to Home"
          icon="home"
          variant="outline"
          onPress={() => router.replace('/')}
          style={styles.footerButton}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    paddingVertical: theme.spacing.lg,
    marginHorizontal: -theme.layout.screenPadding,
    paddingHorizontal: theme.layout.screenPadding,
    borderBottomLeftRadius: theme.borderRadius.xxl,
    borderBottomRightRadius: theme.borderRadius.xxl,
    ...theme.shadows.large,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  title: {
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing.xl,
  },
  imageContainer: {
    height: 200,
    marginHorizontal: -theme.layout.screenPadding,
    marginBottom: theme.spacing.xl,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  errorCard: {
    gap: theme.spacing.lg,
  },
  errorText: {
    marginBottom: theme.spacing.md,
  },
  noBottlesContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  messageCard: {
    gap: theme.spacing.lg,
  },
  messageText: {
    marginBottom: theme.spacing.md,
  },
  recipesGrid: {
    gap: theme.spacing.lg,
  },
  recipeCard: {
    padding: theme.spacing.lg,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  recipeTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  recipeName: {
    flex: 1,
  },
  favoriteButton: {
    padding: theme.spacing.xs,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  ingredient: {
    marginTop: theme.spacing.xs,
  },
  instruction: {
    marginTop: theme.spacing.xs,
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  footerButton: {
    flex: 1,
  },
  errorBanner: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.status.error,
  },
  favoriteButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
}); 