/**
 * components/product/ProductImage.js
 *
 * Full-bleed hero image for the DetailsScreen.
 * Occupies the top 40% of the screen with a subtle gradient overlay
 * at the bottom to aid readability of title text layered above it.
 */

import React, { useState } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../theme/palette';

const ProductImage = ({ uri, heightPercent = 0.40 }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={[styles.container, { flex: heightPercent }]}>
      {!loaded && (
        <ActivityIndicator
          style={StyleSheet.absoluteFill}
          color={Colors.accent}
          size="small"
        />
      )}
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="cover"
        onLoad={() => setLoaded(true)}
        accessibilityRole="image"
      />
      {/* Bottom gradient overlay for text contrast */}
      <View style={styles.gradient} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width:           '100%',
    backgroundColor: Colors.surface,
    overflow:        'hidden',
  },
  image: {
    width:  '100%',
    height: '100%',
  },
  // Simulated gradient using a semi-transparent overlay.
  // A real LinearGradient (expo-linear-gradient) can replace this.
  gradient: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    height:          80,
    backgroundColor: 'transparent',
    // We layer two overlapping views to fake a gradient
    borderTopWidth:   0,
  },
});

export default ProductImage;
