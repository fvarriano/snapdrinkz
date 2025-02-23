import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
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

const AnimatedCard = Animated.createAnimatedComponent(Card);

type ResultsParams = {
  imageUri: string;
  imageBase64: string;
};

interface CocktailRecipe {
  name: string;
  ingredients: string[];
  instructions: string[];
}

export default function ResultsScreen() {
  const params = useLocalSearchParams<ResultsParams>();
  const [bottles, setBottles] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<CocktailRecipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <Screen>
      <Button
        title="Back"
        icon="arrow-back"
        variant="outline"
        size="small"
        onPress={() => router.replace('/')}
        style={styles.backButton}
      />

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
      
      <Text variant="h2" style={styles.title}>Analysis Results</Text>
      
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
        <Animated.ScrollView
          style={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
        >
          <AnimatedCard
            entering={FadeInUp.delay(200)}
            style={styles.detectedBottlesCard}
          >
            <Text variant="h3">Detected Bottles</Text>
            {bottles.map((bottle, index) => (
              <Text
                key={index}
                variant="body"
                color="secondary"
                style={styles.bottleText}
              >
                • {bottle}
              </Text>
            ))}
          </AnimatedCard>

          {recipes.length > 0 && (
            <>
              <Text variant="h3" style={styles.recipesTitle}>
                Possible Cocktails
              </Text>
              {recipes.map((recipe, index) => (
                <AnimatedCard
                  key={index}
                  entering={FadeInDown.delay(300 + index * 100)}
                  style={styles.recipeCard}
                >
                  <Text variant="h3" style={styles.recipeName}>
                    {recipe.name}
                  </Text>
                  
                  <Text variant="label" color="accent" style={styles.recipeSubtitle}>
                    Ingredients
                  </Text>
                  {recipe.ingredients.map((ingredient, i) => (
                    <Text
                      key={i}
                      variant="body"
                      color="secondary"
                      style={styles.recipeText}
                    >
                      • {ingredient}
                    </Text>
                  ))}
                  
                  <Text variant="label" color="accent" style={styles.recipeSubtitle}>
                    Instructions
                  </Text>
                  {recipe.instructions.map((instruction, i) => (
                    <Text
                      key={i}
                      variant="body"
                      color="secondary"
                      style={styles.recipeText}
                    >
                      {i + 1}. {instruction}
                    </Text>
                  ))}
                </AnimatedCard>
              ))}
            </>
          )}

          <Button
            title="Take Another Photo"
            onPress={() => router.replace('/camera')}
            gradient
            style={styles.bottomButton}
          />
        </Animated.ScrollView>
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
  title: {
    marginBottom: theme.spacing.xl,
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
  resultsContainer: {
    flex: 1,
  },
  detectedBottlesCard: {
    marginBottom: theme.spacing.lg,
  },
  bottleText: {
    marginTop: theme.spacing.xs,
  },
  recipesTitle: {
    marginBottom: theme.spacing.lg,
  },
  recipeCard: {
    marginBottom: theme.spacing.lg,
  },
  recipeName: {
    marginBottom: theme.spacing.md,
  },
  recipeSubtitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  recipeText: {
    marginBottom: theme.spacing.xs,
  },
  bottomButton: {
    marginBottom: theme.spacing.xl,
  },
}); 