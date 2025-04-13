import "@/global.css";
import {GluestackUIProvider} from "@/components/ui/gluestack-ui-provider";
import {SplashScreen, Stack} from "expo-router";
import {useFonts} from "expo-font";
import {useEffect, useState} from "react";
import {ThemeProvider} from "@react-navigation/core";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {SafeAreaView} from "react-native";
import {GestureHandlerRootView} from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [colorMode, setColorMode] = useState<"dark" | "light">("dark");
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const theme = colorMode === "dark" ? DarkTheme : DefaultTheme;

  return (
    <GluestackUIProvider mode={colorMode}>
      <ThemeProvider value={theme}>
        <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
          <GestureHandlerRootView>
            <Stack screenOptions={{headerShown: false}}/>
          </GestureHandlerRootView>
        </SafeAreaView>
      </ThemeProvider>
    </GluestackUIProvider>
  )
}
