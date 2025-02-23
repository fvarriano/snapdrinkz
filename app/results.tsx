import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { analyzeImage } from '../lib/googleVision';
import { findCocktails } from '../lib/cocktails';
import { MaterialIcons } from '@expo/vector-icons';

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
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
        <MaterialIcons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {params.imageUri && (
        <Image 
          source={{ uri: params.imageUri }} 
          style={styles.image} 
          resizeMode="contain"
        />
      )}
      
      <Text style={styles.title}>Analysis Results</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Analyzing image...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.replace('/camera')}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : bottles.length === 0 ? (
        <View style={styles.noBottlesContainer}>
          <Text style={styles.noBottlesText}>No bottles detected in the image</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.replace('/camera')}
          >
            <Text style={styles.buttonText}>Take Another Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Detected Bottles:</Text>
          {bottles.map((bottle, index) => (
            <Text key={index} style={styles.bottleText}>• {bottle}</Text>
          ))}

          {recipes.length > 0 && (
            <>
              <Text style={[styles.resultsTitle, styles.recipesTitle]}>
                Possible Cocktails:
              </Text>
              {recipes.map((recipe, index) => (
                <View key={index} style={styles.recipeCard}>
                  <Text style={styles.recipeName}>{recipe.name}</Text>
                  <Text style={styles.recipeSubtitle}>Ingredients:</Text>
                  {recipe.ingredients.map((ingredient, i) => (
                    <Text key={i} style={styles.recipeText}>• {ingredient}</Text>
                  ))}
                  <Text style={styles.recipeSubtitle}>Instructions:</Text>
                  {recipe.instructions.map((instruction, i) => (
                    <Text key={i} style={styles.recipeText}>
                      {i + 1}. {instruction}
                    </Text>
                  ))}
                </View>
              ))}
            </>
          )}

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.replace('/camera')}
          >
            <Text style={styles.buttonText}>Take Another Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
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
  image: {
    width: '100%',
    height: 200,
    marginTop: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  noBottlesContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noBottlesText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultsContainer: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  recipesTitle: {
    marginTop: 30,
  },
  bottleText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  recipeCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  recipeSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginTop: 10,
    marginBottom: 5,
  },
  recipeText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
}); 