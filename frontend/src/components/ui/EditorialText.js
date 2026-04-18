/**
 * components/ui/EditorialText.js
 *
 * Typography wrapper components that enforce the Hxni design system.
 * Using named exports so consumers can import exactly what they need:
 *
 *   import { SerifHeading, SansBody, MonoLabel } from '../ui/EditorialText';
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors, FontFamilies, FontSizes, LineHeights } from '../../theme/palette';

// ─── Serif Heading ────────────────────────────────────────────

/**
 * Large editorial heading — Playfair Display Bold.
 * Use for: product names, section titles, screen headers.
 *
 * Props:
 *   size    {number}   font size override (default FontSizes['3xl'])
 *   color   {string}   text colour override
 *   italic  {boolean}  use italic variant
 *   style   {object}   additional style overrides
 */
export const SerifHeading = ({ children, size, color, italic = false, style, ...rest }) => (
  <Text
    style={[
      styles.serifHeading,
      size   && { fontSize:   size  },
      color  && { color:      color },
      italic && { fontFamily: FontFamilies.serifItalic },
      style,
    ]}
    {...rest}
  >
    {children}
  </Text>
);

// ─── Sans Body ────────────────────────────────────────────────

/**
 * Readable body copy — Source Sans 3 Regular.
 * Use for: descriptions, paragraphs, secondary info.
 *
 * Props:
 *   size    {number}   font size override (default FontSizes.base)
 *   semi    {boolean}  use SemiBold variant
 *   muted   {boolean}  render in muted colour
 *   style   {object}
 */
export const SansBody = ({ children, size, semi = false, muted = false, style, ...rest }) => (
  <Text
    style={[
      styles.sansBody,
      size  && { fontSize:   size },
      semi  && { fontFamily: FontFamilies.sansSemi },
      muted && { color:      Colors.muted },
      style,
    ]}
    {...rest}
  >
    {children}
  </Text>
);

// ─── Mono Label ───────────────────────────────────────────────

/**
 * Monospaced utility label — IBM Plex Mono.
 * Use for: category tags, reference codes, button text, prices.
 *
 * Props:
 *   size    {number}
 *   medium  {boolean}  use Medium weight
 *   accent  {boolean}  render in gold accent colour
 *   style   {object}
 */
export const MonoLabel = ({ children, size, medium = false, accent = false, style, ...rest }) => (
  <Text
    style={[
      styles.monoLabel,
      size   && { fontSize:   size   },
      medium && { fontFamily: FontFamilies.monoMedium },
      accent && { color:      Colors.accent },
      style,
    ]}
    {...rest}
  >
    {children}
  </Text>
);

// ─── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  serifHeading: {
    fontFamily:  FontFamilies.serif,
    fontSize:    FontSizes['3xl'],
    lineHeight:  FontSizes['3xl'] * LineHeights.tight,
    color:       Colors.foreground,
    letterSpacing: -0.5,
  },
  sansBody: {
    fontFamily:  FontFamilies.sans,
    fontSize:    FontSizes.base,
    lineHeight:  FontSizes.base * LineHeights.relaxed,
    color:       Colors.foreground,
  },
  monoLabel: {
    fontFamily:  FontFamilies.mono,
    fontSize:    FontSizes.xs,
    lineHeight:  FontSizes.xs * LineHeights.normal,
    color:       Colors.foreground,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
