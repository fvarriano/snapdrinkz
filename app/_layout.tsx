import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import theme from './styles/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: theme.colors.background.dark,
              },
              animation: 'fade',
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="camera"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="results"
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="recipe-details"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="auth/sign-in"
              options={{
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="auth/sign-up"
              options={{
                animation: 'slide_from_right',
              }}
            />
          </Stack>
        </FavoritesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
