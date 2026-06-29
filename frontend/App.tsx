import React from "react";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_700Bold_Italic,
} from "@expo-google-fonts/playfair-display";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App(): React.ReactElement | null {
  const [loaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_700Bold_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!loaded) {
    return null;
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="dark" />
    </>
  );
}
