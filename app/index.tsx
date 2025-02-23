import { View, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Screen from './components/Screen';
import Text from './components/Typography';
import Button from './components/Button';
import LoadingIndicator from './components/LoadingIndicator';
import theme from './styles/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { session, signOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/auth/sign-in');
    }
  }, [session, loading]);

  if (loading) {
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
      <LinearGradient
        colors={theme.colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <MaterialIcons
            name="local-bar"
            size={64}
            color={theme.colors.text.primary}
          />
        </View>
        <Text variant="h1" center style={styles.title}>
          Welcome to SnapDrinkz!
        </Text>
        <Text
          variant="body"
          color="secondary"
          center
          style={styles.subtitle}
        >
          Turn your bottles into amazing cocktails
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text variant="caption" color="secondary" style={styles.email}>
          Signed in as: {session.user.email}
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Take a Photo"
            icon="camera-alt"
            onPress={() => router.replace('/camera')}
            gradient
            size="large"
          />

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
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingVertical: theme.spacing.xxl,
    marginHorizontal: -theme.layout.screenPadding,
    paddingHorizontal: theme.layout.screenPadding,
    borderBottomLeftRadius: theme.borderRadius.xxl,
    borderBottomRightRadius: theme.borderRadius.xxl,
    ...theme.shadows.large,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.round,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing.xl,
  },
  email: {
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    gap: theme.spacing.lg,
  },
  signOutButton: {
    marginTop: theme.spacing.md,
  },
}); 