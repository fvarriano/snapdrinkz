import { View, StyleSheet, ScrollView, TextInput, StatusBar, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Screen from './components/Screen';
import Text from './components/Typography';
import Button from './components/Button';
import LoadingIndicator from './components/LoadingIndicator';
import CocktailListItem from './components/CocktailListItem';
import theme from './styles/theme';

export default function HomeScreen() {
  const { session, signOut, loading: authLoading } = useAuth();
  const { favorites, loading: favoritesLoading, removeFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !session) {
      router.replace('/auth/sign-in');
    }
  }, [session, authLoading]);

  const filteredFavorites = favorites.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={theme.colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cocktails"
            placeholderTextColor={theme.colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
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
                isHighlighted={index === 0}
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
}); 