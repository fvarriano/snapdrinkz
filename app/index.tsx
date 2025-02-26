import React from 'react';
import { View, StyleSheet, ScrollView, TextInput, StatusBar, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useEffect, useState, useCallback } from 'react';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Screen from './components/Screen';
import Text from './components/Typography';
import Button from './components/Button';
import LoadingIndicator from './components/LoadingIndicator';
import CocktailListItem from './components/CocktailListItem';
import theme from './styles/theme';
import { getRecommendedCocktails } from '../lib/cocktails';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const { session, signOut, loading: authLoading } = useAuth();
  const { favorites, loading: favoritesLoading, removeFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Filter favorites based on search query
  const filteredFavorites = favorites.filter(recipe => {
    const query = searchQuery.toLowerCase();
    
    // Check recipe name
    if (recipe.name.toLowerCase().includes(query)) {
      return true;
    }
    
    // Check ingredients
    return recipe.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(query)
    );
  });

  // Get recommendations based on favorites and search query
  const updateRecommendations = useCallback(() => {
    setLoadingRecommendations(true);
    
    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      try {
        const recommendedCocktails = getRecommendedCocktails(favorites, searchQuery);
        setRecommendations(recommendedCocktails);
      } catch (error) {
        console.error('Error getting recommendations:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    }, 100);
  }, [favorites, searchQuery]);

  // Update recommendations when favorites or search query changes
  useEffect(() => {
    updateRecommendations();
  }, [updateRecommendations]);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!authLoading && !session) {
      router.replace('/auth/sign-in');
    }
  }, [session, authLoading]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Trigger haptic feedback when typing
    if (text.length > 0 && searchQuery.length === 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Determine if we're searching for an ingredient
  const isSearchingIngredient = searchQuery.length > 0 && 
    ['rum', 'gin', 'vodka', 'whiskey', 'tequila', 'bourbon', 'vermouth', 'curacao'].some(
      ingredient => searchQuery.toLowerCase().includes(ingredient)
    );

  if (authLoading) {
    return (
      <Screen>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <LoadingIndicator text="Loading..." />
        </View>
      </Screen>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Screen>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>Cocktails</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={async () => {
            try {
              await signOut();
              router.replace('/auth/sign-in');
            } catch (error) {
              console.error('Error signing out:', error);
            }
          }}
        >
          <Ionicons name="person" size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[
          styles.searchInputContainer,
          isSearchingIngredient && styles.searchingIngredient
        ]}>
          <Ionicons 
            name={isSearchingIngredient ? "wine-outline" : "search"} 
            size={20} 
            color={isSearchingIngredient ? theme.colors.accent : theme.colors.text.secondary} 
            style={styles.searchIcon} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or ingredient"
            placeholderTextColor={theme.colors.text.secondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
        {isSearchingIngredient && (
          <Text style={styles.searchHint}>
            Showing cocktails with {searchQuery.toLowerCase()}
          </Text>
        )}
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Favorites Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Favorites</Text>
        </View>

        {favoritesLoading ? (
          <LoadingIndicator />
        ) : filteredFavorites.length === 0 && !searchQuery ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="local-bar" size={48} color={theme.colors.text.secondary} />
            <Text variant="body" color="secondary" center style={styles.emptyText}>
              No favorite cocktails yet.{'\n'}
              Take a photo to discover recipes!
            </Text>
            <Button
              title="Take a Photo"
              icon="camera-alt"
              onPress={() => router.push('/camera')}
              gradient
            />
          </View>
        ) : filteredFavorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="body" color="secondary" center>
              No cocktails found matching "{searchQuery}"
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredFavorites.map((recipe, index) => (
              <CocktailListItem
                key={recipe.id || index}
                name={recipe.name}
                strength="Strong"
                imageUrl={recipe.image_url}
                isFavorite={true}
                isHighlighted={index === 0 && !searchQuery}
                onPress={() => {
                  // Navigate to recipe details
                  router.push({
                    pathname: '/recipe-details',
                    params: {
                      name: recipe.name,
                      ingredients: JSON.stringify(recipe.ingredients),
                      instructions: JSON.stringify(recipe.instructions),
                      imageUrl: recipe.image_url || '',
                      isFavorite: 'true'
                    }
                  });
                }}
                onFavoritePress={() => {
                  // Handle unfavorite
                  removeFavorite(recipe.name);
                }}
              />
            ))}
          </View>
        )}

        {/* Recommendations Section */}
        {!favoritesLoading && (
          <>
            <View style={[styles.sectionHeader, styles.recommendationsHeader]}>
              <Text style={styles.sectionTitle}>Recommended For You</Text>
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  updateRecommendations();
                }}
              >
                <Ionicons name="refresh" size={18} color={theme.colors.accent} />
              </TouchableOpacity>
            </View>

            {loadingRecommendations ? (
              <View style={styles.loadingRecommendations}>
                <LoadingIndicator size={24} />
              </View>
            ) : recommendations.length === 0 ? (
              <View style={styles.emptyRecommendations}>
                <Text variant="body" color="secondary" center>
                  {searchQuery 
                    ? `No recommendations matching "${searchQuery}"`
                    : "No recommendations available"}
                </Text>
              </View>
            ) : (
              <View style={styles.list}>
                {recommendations.map((recipe, index) => (
                  <CocktailListItem
                    key={`rec-${index}`}
                    name={recipe.name}
                    strength="Strong"
                    isFavorite={false}
                    onPress={() => {
                      // Navigate to recipe details
                      router.push({
                        pathname: '/recipe-details',
                        params: {
                          name: recipe.name,
                          ingredients: JSON.stringify(recipe.ingredients),
                          instructions: JSON.stringify(recipe.instructions),
                          isFavorite: 'false'
                        }
                      });
                    }}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/camera')}
        >
          <Ionicons name="camera" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchingIngredient: {
    borderColor: theme.colors.accent,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 32,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  list: {
    paddingTop: 8,
    gap: 12,
    marginBottom: 24,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
  recommendationsHeader: {
    marginTop: 16,
  },
  refreshButton: {
    padding: 8,
  },
  loadingRecommendations: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyRecommendations: {
    padding: 24,
    alignItems: 'center',
  },
  searchHint: {
    fontSize: 12,
    color: theme.colors.accent,
    marginTop: 8,
    marginLeft: 4,
    fontStyle: 'italic',
  },
}); 