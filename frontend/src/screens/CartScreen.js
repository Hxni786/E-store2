/**
 * screens/CartScreen.js
 *
 * Full cart view with item list, quantity controls, and checkout summary.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { SerifHeading, SansBody, MonoLabel } from '../components/ui/EditorialText';
import GoldButton from '../components/ui/GoldButton';
import { getCart, addToCart, removeFromCart, clearCart } from '../services/storage';
import { formatCurrency } from '../utils/formatters';
import { Colors, Spacing, FontSizes, Shadows } from '../theme/palette';

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refresh cart every time screen is focused
  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        setLoading(true);
        const items = await getCart();
        if (active) {
          setCart(items);
          setLoading(false);
        }
      };
      load();
      return () => { active = false; };
    }, [])
  );

  const handleRemove = useCallback(async (productId) => {
    const updated = await removeFromCart(productId);
    setCart(updated);
  }, []);

  const handleClear = useCallback(() => {
    Alert.alert(
      'Clear Cart',
      'Remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearCart();
            setCart([]);
          },
        },
      ]
    );
  }, []);

  const subtotal = cart.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.quantity;
  }, 0);

  const renderItem = useCallback(({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <SansBody semi numberOfLines={2} style={styles.itemName}>
          {item.name}
        </SansBody>
        <MonoLabel accent medium style={styles.itemPrice}>
          {formatCurrency(item.price)}
        </MonoLabel>
        <View style={styles.qtyRow}>
          <MonoLabel style={styles.qtyLabel}>QTY: {item.quantity}</MonoLabel>
          <TouchableOpacity
            onPress={() => handleRemove(item.id)}
            style={styles.removeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MonoLabel style={styles.removeText}>Remove</MonoLabel>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [handleRemove]);

  // Empty cart
  if (!loading && cart.length === 0) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <SerifHeading size={FontSizes['2xl']} style={styles.title}>
            Your Cart
          </SerifHeading>
        </View>
        <View style={styles.emptyState}>
          <SansBody style={styles.emptyIcon}>🛒</SansBody>
          <SerifHeading size={FontSizes.xl} style={styles.emptyTitle}>
            Your cart is empty
          </SerifHeading>
          <SansBody muted style={styles.emptyBody}>
            Explore our collection and add pieces you love.
          </SansBody>
          <TouchableOpacity
            onPress={() => navigation.navigate('HomeTab')}
            style={styles.shopBtn}
          >
            <MonoLabel style={styles.shopBtnText}>Shop Now</MonoLabel>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <SerifHeading size={FontSizes['2xl']} style={styles.title}>
          Your Cart
        </SerifHeading>
        {cart.length > 0 && (
          <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MonoLabel style={styles.clearText}>Clear All</MonoLabel>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Checkout footer */}
      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <SansBody style={styles.summaryLabel}>Subtotal</SansBody>
          <MonoLabel accent medium style={styles.summaryValue}>
            {formatCurrency(subtotal)}
          </MonoLabel>
        </View>
        <View style={styles.summaryRow}>
          <SansBody muted style={styles.summaryLabel}>Shipping</SansBody>
          <MonoLabel style={styles.summaryShipping}>Complimentary</MonoLabel>
        </View>
        <View style={styles.totalRule} />
        <View style={styles.summaryRow}>
          <SerifHeading size={FontSizes.lg}>Total</SerifHeading>
          <MonoLabel accent medium style={styles.totalValue}>
            {formatCurrency(subtotal)}
          </MonoLabel>
        </View>
        <GoldButton
          label="Proceed to Checkout"
          onPress={() => Alert.alert('Checkout', 'This is a demo — thank you for browsing Hxni!')}
          variant="filled"
          style={{ marginTop: Spacing[3] }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  title: {
    letterSpacing: 1,
  },
  clearText: {
    color: Colors.danger,
    fontSize: FontSizes.xs,
    letterSpacing: 1.5,
  },
  list: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
  },
  cartItem: {
    flexDirection: 'row',
    gap: Spacing[4],
    paddingVertical: Spacing[3],
  },
  itemImage: {
    width: 90,
    height: 90,
    backgroundColor: Colors.surface,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing[1],
  },
  itemName: {
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * 1.3,
  },
  itemPrice: {
    fontSize: FontSizes.sm,
    marginTop: Spacing[0.5],
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing[1],
  },
  qtyLabel: {
    color: Colors.muted,
    fontSize: FontSizes.xs,
    letterSpacing: 1,
  },
  removeBtn: {
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[2],
  },
  removeText: {
    color: Colors.danger,
    fontSize: 10,
    letterSpacing: 1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
  footer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[6],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
    ...Shadows.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing[1],
  },
  summaryLabel: {
    fontSize: FontSizes.base,
  },
  summaryValue: {
    fontSize: FontSizes.base,
  },
  summaryShipping: {
    color: Colors.muted,
    fontSize: FontSizes.xs,
    letterSpacing: 1,
  },
  totalRule: {
    height: 1,
    backgroundColor: Colors.foreground,
    marginVertical: Spacing[2],
  },
  totalValue: {
    fontSize: FontSizes.xl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[5],
    gap: Spacing[3],
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyBody: {
    textAlign: 'center',
    lineHeight: FontSizes.base * 1.7,
  },
  shopBtn: {
    marginTop: Spacing[4],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[8],
    borderWidth: 1,
    borderColor: Colors.foreground,
    backgroundColor: Colors.foreground,
  },
  shopBtnText: {
    color: Colors.white,
    letterSpacing: 2,
    fontSize: FontSizes.xs,
  },
});

export default CartScreen;
