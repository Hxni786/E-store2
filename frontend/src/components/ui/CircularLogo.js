/**
 * components/ui/CircularLogo.js
 *
 * Renders the Hxni brand logo from a remote image inside a
 * perfectly circular container with a subtle gold border.
 */

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Colors, Shadows } from '../../theme/palette';

const LOGO_URI = 'https://i.postimg.cc/JzN9VVs1/store-logo.png';

const CircularLogo = ({ size = 64, style }) => {
  const half = size / 2;

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          borderRadius: half,
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel="Hxni logo"
    >
      <Image
        source={{ uri: LOGO_URI }}
        style={{
          width: size - 4,
          height: size - 4,
          borderRadius: half,
        }}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    ...Shadows.sm,
  },
});

export default CircularLogo;
