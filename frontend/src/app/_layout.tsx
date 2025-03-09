import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Karla: require('@assets/fonts/Karla-Regular.ttf'),
    KarlaMedium: require('@assets/fonts/Karla-Medium.ttf'),
    KarlaBold: require('@assets/fonts/Karla-Bold.ttf'),
    KarlaExtraBold: require('@assets/fonts/Karla-ExtraBold.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  // value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="client" options={{title: 'TabOneDef', headerShown: false}}/> */}
        {/* <Stack.Screen name="(tabs)/client/two" options={{title: 'TabTwoDef'}}/> */}
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}
      </Stack>
    </ThemeProvider>
  );
}
