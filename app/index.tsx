import { View, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Screen from './components/Screen';
import Text from './components/Typography';
import Button from './components/Button';
import Card from './components/Card';
import LoadingIndicator from './components/LoadingIndicator';
import theme from './styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

const AnimatedCard = Animated.createAnimatedComponent(Card);

export default function HomeScreen() {
  const { session, signOut, loading: authLoading } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();

  useEffect(() => {
    if (!authLoading && !session) {
      router.replace('/auth/sign-in');
    }
  }, [session, authLoading]);

  if (authLoading) {
    return (
      <Screen>
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
          <View style={styles.logoContainer}>
            <MaterialIcons
              name="local-bar"
              size={48}
              color={theme.colors.text.primary}
            />
          </View>
          <Text variant="h1" center style={styles.title}>
            SnapDrinkz
          </Text>
          <Text
            variant="body"
            color="secondary"
            center
            style={styles.subtitle}
          >
            Your Personal Mixologist
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          <Button
            title="Snap Your Bottles"
            icon="camera-alt"
            onPress={() => router.replace('/camera')}
            gradient
            size="large"
            style={styles.mainButton}
          />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons 
                name="bookmark" 
                size={24} 
                color={theme.colors.accent}
              />
              <Text variant="h2" style={styles.sectionTitle}>
                Favorite Recipes
              </Text>
            </View>

            {favoritesLoading ? (
              <LoadingIndicator />
            ) : favorites.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Ionicons 
                  name="heart-outline" 
                  size={32} 
                  color={theme.colors.text.secondary}
                />
                <Text 
                  variant="body" 
                  color="secondary" 
                  center 
                  style={styles.emptyText}
                >
                  No favorite recipes yet.{'\n'}
                  Take a photo to discover cocktails!
                </Text>
              </Card>
            ) : (
              <View style={styles.favoritesGrid}>
                {favorites.map((recipe, index) => (
                  <AnimatedCard
                    key={recipe.id}
                    entering={FadeInDown.delay(index * 100)}
                    style={styles.recipeCard}
                    onPress={() => {
                      // TODO: Navigate to recipe details
                    }}
                  >
                    <View style={styles.recipeHeader}>
                      <MaterialIcons
                        name="local-bar"
                        size={24}
                        color={theme.colors.accent}
                      />
                      <Text variant="h3" style={styles.recipeName}>
                        {recipe.name}
                      </Text>
                    </View>
                    <Text 
                      variant="caption" 
                      color="secondary" 
                      style={styles.recipeIngredients}
                    >
                      {recipe.ingredients.join(', ')}
                    </Text>
                  </AnimatedCard>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <Button
        title="Sign Out"
        icon="logout"
        variant="outline"
        onPress={async () => {
          try {
            await signOut();
            router.replace('/auth/sign-in');
          } catch (error) {
            console.error('Error signing out:', error);
          }
        }}
        style={styles.signOutButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingVertical: theme.spacing.xl,
    marginHorizontal: -theme.layout.screenPadding,
    paddingHorizontal: theme.layout.screenPadding,
    borderBottomLeftRadius: theme.borderRadius.xxl,
    borderBottomRightRadius: theme.borderRadius.xxl,
    ...theme.shadows.large,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.round,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  title: {
    marginBottom: theme.spacing.xs,
    fontSize: 36,
    fontWeight: theme.typography.weights.bold,
  },
  subtitle: {
    opacity: 0.8,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing.xl,
  },
  mainButton: {
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
  },
  emptyCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 24,
  },
  favoritesGrid: {
    gap: theme.spacing.md,
  },
  recipeCard: {
    padding: theme.spacing.lg,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  recipeName: {
    flex: 1,
  },
  recipeIngredients: {
    marginTop: theme.spacing.xs,
  },
  signOutButton: {
    marginTop: theme.spacing.md,
  },
}); 