import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
// import "react-native-crypto";
import "stream-browserify";
import { Buffer } from "buffer";
import "react-native-get-random-values";

import { useColorScheme } from "@/hooks/useColorScheme";
import { ROUTES } from "@/constants/routes";
import { Provider } from "react-redux";
import { store } from "@/store";

import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (typeof global !== "undefined") {
    global.Buffer = Buffer;
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name={ROUTES.walletSetup}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name={ROUTES.seedPhrase}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={ROUTES.confirmSeedPhrase}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={ROUTES.walletCreatedSuccessfully}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={ROUTES.walletImportOptions}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={ROUTES.walletImportSeedPhrase}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={ROUTES.dashBoard}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={ROUTES.auth}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={ROUTES.detailToken}
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
