/**
 * theme/palette.js
 *
 * Single source of truth for the Hxni Serif Editorial design system.
 * Import from here everywhere — never hardcode values in components.
 */

'use strict';

// ─── Colour Palette ───────────────────────────────────────────

export const Colors = Object.freeze({
  /** Primary surface background — warm ivory */
  background:  '#FAFAF8',

  /** Primary text — deep, rich black (not pure #000) */
  foreground:  '#1A1A1A',

  /** Accent — antique gold for prices, CTAs, indicators */
  accent:      '#B8860B',

  /** A slightly warmer gold for hover/pressed states */
  accentLight: '#D4A017',

  /** Hairline borders and dividers */
  border:      '#E8E4DF',

  /** Card / elevated surface — just off-background */
  surface:     '#F3F0EC',

  /** Muted text — captions, metadata */
  muted:       '#7A7570',

  /** Danger / error states */
  danger:      '#C0392B',

  /** Pure white — used sparingly for contrast elements */
  white:       '#FFFFFF',
});

// ─── Typography Scale ─────────────────────────────────────────

export const FontFamilies = Object.freeze({
  /** Editorial headings — Use safe generic serif for testing */
  serif:       'serif',
  serifItalic: 'serif',

  /** Body copy */
  sans:        'sans-serif',
  sansSemi:    'sans-serif',

  /** Labels, buttons, tags */
  mono:        'monospace',
  monoMedium:  'monospace',
});

export const FontSizes = Object.freeze({
  /** Monospaced micro-label (category tags, button text) */
  xs:   11,

  /** Caption / metadata */
  sm:   13,

  /** Body copy */
  base: 15,

  /** Lead paragraph */
  lg:   17,

  /** Card titles */
  xl:   20,

  /** Section headings */
  '2xl': 26,

  /** Hero / product title */
  '3xl': 32,

  /** Display / marketing */
  '4xl': 40,
});

export const LineHeights = Object.freeze({
  tight:   1.2,
  snug:    1.35,
  normal:  1.5,
  relaxed: 1.7,
});

// ─── Spacing Scale (4pt grid) ────────────────────────────────

export const Spacing = Object.freeze({
  0:   0,
  0.5: 2,
  1:   4,
  1.5: 6,
  2:   8,
  3:   12,
  4:   16,
  5:   20,
  6:   24,
  7:   28,
  8:   32,
  10:  40,
  12:  48,
  16:  64,
});

// ─── Border Radii ────────────────────────────────────────────

export const Radius = Object.freeze({
  none:  0,
  sm:    4,
  base:  8,
  lg:    12,
  xl:    16,
  full:  9999,
});

// ─── Shadows (iOS + Android compatible) ──────────────────────

export const Shadows = Object.freeze({
  sm: {
    shadowColor:   '#1A1A1A',
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius:  3,
    elevation:     2,
  },
  base: {
    shadowColor:   '#1A1A1A',
    shadowOffset:  { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius:  8,
    elevation:     4,
  },
  lg: {
    shadowColor:   '#1A1A1A',
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius:  16,
    elevation:     8,
  },
});
