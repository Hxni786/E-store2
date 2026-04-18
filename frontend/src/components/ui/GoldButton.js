/**
 * components/ui/GoldButton.js
 *
 * Primary call-to-action button for the Hxni design system.
 * Two visual variants:
 *   "filled"   — rich black background, ivory text (default)
 *   "outline"  — transparent background, gold border + text
 *
 * Provides visual press feedback via opacity animation and
 * delegates haptic feedback to the parent (via onPress).
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  View,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { MonoLabel } from './EditorialText';
import { Colors, Spacing, Radius, FontSizes } from '../../theme/palette';

const GoldButton = ({
  label        = 'Add to Cart',
  onPress,
  variant      = 'filled',   // 'filled' | 'outline'
  loading      = false,
  disabled     = false,
  fullWidth    = true,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue:         0.97,
      useNativeDriver: true,
      speed:           50,
      bounciness:      0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue:         1,
      useNativeDriver: true,
      speed:           50,
      bounciness:      0,
    }).start();
  };

  const isFilled  = variant === 'filled';
  const isDisabled = disabled || loading;

  return (
    <Animated.View
      style={[
        fullWidth && styles.fullWidth,
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[
          styles.button,
          isFilled  ? styles.filled  : styles.outline,
          isDisabled && styles.disabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={isFilled ? Colors.white : Colors.accent}
          />
        ) : (
          <View style={styles.row}>
            <MonoLabel
              medium
              style={[
                styles.label,
                isFilled ? styles.labelFilled : styles.labelOutline,
                isDisabled && styles.labelDisabled,
              ]}
            >
              {label}
            </MonoLabel>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  button: {
    paddingVertical:   Spacing[4],
    paddingHorizontal: Spacing[6],
    borderRadius:      Radius.none, // intentionally sharp — editorial aesthetic
    alignItems:        'center',
    justifyContent:    'center',
    minHeight:         52,
  },
  filled: {
    backgroundColor: Colors.foreground,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth:      1,
    borderColor:      Colors.accent,
  },
  disabled: {
    opacity: 0.45,
  },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing[2],
  },
  label: {
    fontSize:      FontSizes.xs,
    letterSpacing: 2,
  },
  labelFilled: {
    color: Colors.white,
  },
  labelOutline: {
    color: Colors.accent,
  },
  labelDisabled: {
    color: Colors.muted,
  },
});

export default GoldButton;
