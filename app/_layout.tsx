import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "stream-browserify";
import { Buffer } from "buffer";
import "react-native-get-random-values";
import { Provider } from "react-redux";
import { store, persistor } from "@/store";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ROUTES } from "@/constants/routes";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PersistGate } from "redux-persist/integration/react";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();



export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [timeoutElapsed, setTimeoutElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutElapsed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  

  useEffect(() => {
    if (loaded || error || timeoutElapsed) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, timeoutElapsed]);

  if (!loaded && !error) {
    return null;
  }

  if (typeof global !== "undefined") {
    global.Buffer = Buffer;
  }


  return (
    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
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
            {/* <Stack.Screen
                  name={ROUTES.walletImportOptions}
                  options={{
                    headerShown: false,
                  }}
                /> */}
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
            <Stack.Screen
              name={ROUTES.search}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={ROUTES.recovery}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={ROUTES.seedPhraseRecovery}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={ROUTES.manager}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name={ROUTES.editName}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={ROUTES.accountAddresses}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={ROUTES.privateKey}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={ROUTES.PrivateKeyRecovery}
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
