/**
 * services/storage.js
 *
 * Thin wrapper around @react-native-async-storage/async-storage
 * for cart persistence.  All keys are namespaced to avoid collisions
 * with other AsyncStorage consumers in the app.
 *
 * Cart shape stored under KEYS.CART:
 *   Array<CartItem>  where CartItem = { ...Product, quantity: number, addedAt: string }
 */

'use strict';

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Storage Keys ─────────────────────────────────────────────

const KEYS = Object.freeze({
  CART: '@hxni/cart',
});

// ─── Internal helpers ─────────────────────────────────────────

/** Safely parse JSON; returns fallback on any error. */
const safeParseJSON = (raw, fallback = null) => {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

// ─── Cart Operations ──────────────────────────────────────────

/**
 * Read the full cart array from storage.
 * Always resolves — returns [] if storage is empty or corrupt.
 *
 * @returns {Promise<CartItem[]>}
 */
export const getCart = async () => {
  try {
    const raw = await AsyncStorage.getItem(KEYS.CART);
    return raw ? safeParseJSON(raw, []) : [];
  } catch (err) {
    console.warn('[storage] getCart failed:', err.message);
    return [];
  }
};

/**
 * Add a product to the cart.
 *
 * - If the product already exists, increment its quantity.
 * - If it's new, append it with quantity = 1.
 *
 * @param {Product} product
 * @returns {Promise<CartItem[]>} Updated cart
 */
export const addToCart = async (product) => {
  try {
    const current = await getCart();
    const existing = current.find((item) => item.id === product.id);

    let updated;

    if (existing) {
      updated = current.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updated = [
        ...current,
        { ...product, quantity: 1, addedAt: new Date().toISOString() },
      ];
    }

    await AsyncStorage.setItem(KEYS.CART, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('[storage] addToCart failed:', err.message);
    throw err; // re-throw so the UI can surface an error toast
  }
};

/**
 * Add a product with an explicit quantity.
 *
 * @param {Product} product
 * @param {number} quantity
 * @returns {Promise<CartItem[]>} Updated cart
 */
export const addToCartQuantity = async (product, quantity = 1) => {
  const amount = Math.max(1, Number(quantity) || 1);
  try {
    const current = await getCart();
    const existing = current.find((item) => item.id === product.id);

    let updated;
    if (existing) {
      updated = current.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + amount }
          : item
      );
    } else {
      updated = [
        ...current,
        { ...product, quantity: amount, addedAt: new Date().toISOString() },
      ];
    }

    await AsyncStorage.setItem(KEYS.CART, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('[storage] addToCartQuantity failed:', err.message);
    throw err;
  }
};

/**
 * Remove a product entirely from the cart by id.
 *
 * @param {number} productId
 * @returns {Promise<CartItem[]>} Updated cart
 */
export const removeFromCart = async (productId) => {
  try {
    const current = await getCart();
    const updated  = current.filter((item) => item.id !== productId);
    await AsyncStorage.setItem(KEYS.CART, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('[storage] removeFromCart failed:', err.message);
    throw err;
  }
};

/**
 * Wipe the entire cart — used on order confirmation.
 *
 * @returns {Promise<void>}
 */
export const clearCart = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.CART);
  } catch (err) {
    console.warn('[storage] clearCart failed:', err.message);
    throw err;
  }
};

/**
 * Return the total number of individual items in the cart
 * (sum of all quantities, not unique products).
 *
 * @returns {Promise<number>}
 */
export const getCartCount = async () => {
  const cart = await getCart();
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};
