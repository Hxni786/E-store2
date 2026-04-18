/**
 * App.js — Hxni Ecommerce Store
 *
 * Root component. Responsibilities:
 *  1. Load all three custom font families via expo-google-fonts
 *  2. Hold the splash screen until fonts are ready
 *  3. Wrap the app in SafeAreaProvider (required by react-native-safe-area-context)
 *  4. Mount the AppNavigator
 *
 * Font families loaded:
 *  ├── Playfair Display  700Bold, 700Bold_Italic  → SerifHeading
 *  ├── Source Sans 3     400Regular, 600SemiBold  → SansBody
 *  └── IBM Plex Mono     400Regular, 500Medium    → MonoLabel
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
