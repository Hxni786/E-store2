/**
 * components/product/ProductCard.js
 *
 * Grid card for the HomeScreen product feed.
 * Renders a 2-column layout with a square image, category tag,
 * product name, and gold-accented price.
 *
 * Props:
 *   product   {Product}   product data object
 *   onPress   {Function}  navigation handler
 *   width     {number}    explicit card width for the grid layout
 */

import React, { useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { SerifHeading, SansBody, MonoLabel } from '../ui/EditorialText';
import { Colors, Spacing, Shadows, FontSizes } from '../../theme/palette';
import { formatCurrency, truncate, categoryLabel } from '../../utils/formatters';

const ProductCard = ({ product, onPress, width }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const imageSize = width ? width : '100%';

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue:         0.975,
      duration:        100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue:         1,
      duration:        150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, width && { width }]}>
      <TouchableOpacity
        onPress={() => onPress(product)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={`View ${product.name}`}
      >
        {/* Image */}
        <View style={[styles.imageContainer, { width: imageSize, aspectRatio: 1 }]}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={product.name}
          />
          {/* Category tag overlay */}
          <View style={styles.categoryBadge}>
            <MonoLabel style={styles.categoryText}>
              {categoryLabel(product.category)}
            </MonoLabel>
          </View>
        </View>

        {/* Meta */}
        <View style={styles.meta}>
          <SerifHeading
            size={FontSizes.lg}
            style={styles.name}
            numberOfLines={2}
          >
            {product.name}
          </SerifHeading>

          <MonoLabel accent medium style={styles.price}>
            {formatCurrency(product.price)}
          </MonoLabel>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
  },
  imageContainer: {
    overflow:        'hidden',
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  image: {
    width:  '100%',
    height: '100%',
  },
  categoryBadge: {
    position:         'absolute',
    top:              Spacing[2],
    left:             Spacing[2],
    backgroundColor:  'rgba(250, 250, 248, 0.92)',
    paddingVertical:  Spacing[0.5],
    paddingHorizontal: Spacing[2],
    borderWidth:      0.5,
    borderColor:      Colors.border,
  },
  categoryText: {
    fontSize: 9,
    color:    Colors.muted,
  },
  meta: {
    paddingTop:  Spacing[3],
    paddingLeft: Spacing[1],
    gap:         Spacing[1.5],
  },
  name: {
    lineHeight: FontSizes.lg * 1.3,
  },
  price: {
    fontSize: FontSizes.xs + 1,
  },
});

export default ProductCard;
