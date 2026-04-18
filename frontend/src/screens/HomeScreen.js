/**
 * screens/HomeScreen.js
 *
 * Professional product feed with branded header, search, category filters,
 * and 2-column editorial grid.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import CircularLogo from '../components/ui/CircularLogo';
import { SerifHeading, SansBody, MonoLabel } from '../components/ui/EditorialText';
import ProductCard from '../components/product/ProductCard';

import { fetchProducts } from '../services/api';
import { getCartCount } from '../services/storage';
import { Colors, Spacing, FontSizes, Shadows } from '../theme/palette';

// ─── Constants ────────────────────────────────────────────────

const COLUMN_COUNT = 2;
const COLUMN_GAP = Spacing[4];
const H_PADDING = Spacing[5];
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - COLUMN_GAP) / COLUMN_COUNT;

// ─── Header ───────────────────────────────────────────────────

const Header = ({ cartCount, onCartPress }) => (
  <View style={styles.header}>
    {/* Top bar: logo + brand + cart */}
    <View style={styles.topBar}>
      <CircularLogo size={48} />
      <View style={styles.brandGroup}>
        <SerifHeading size={FontSizes.xl} style={styles.storeName}>
          Hxni
        </SerifHeading>
        <MonoLabel style={styles.tagline}>Considered Essentials</MonoLabel>
      </View>
      <TouchableOpacity
        onPress={onCartPress}
        style={styles.cartBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.cartIcon}>🛒</Text>
        {cartCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>
              {cartCount > 9 ? '9+' : cartCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
    <View style={styles.rule} />
  </View>
);

// ─── States ───────────────────────────────────────────────────

const LoadingState = () => (
  <View style={styles.centeredState}>
    <ActivityIndicator size="large" color={Colors.accent} />
    <MonoLabel style={styles.loadingText}>Loading Collection…</MonoLabel>
  </View>
);

const ErrorState = ({ message, onRetry }) => (
  <View style={styles.centeredState}>
    <MonoLabel style={styles.errorLabel}>Connection Error</MonoLabel>
    <SansBody style={styles.errorMessage}>{message}</SansBody>
    <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
      <MonoLabel style={styles.retryText}>Try Again</MonoLabel>
    </TouchableOpacity>
  </View>
);

const EmptyState = () => (
  <View style={styles.centeredState}>
    <SerifHeading size={FontSizes.xl} italic style={styles.emptyHeading}>
      Collection Coming Soon
    </SerifHeading>
    <SansBody muted style={styles.emptyBody}>
      Our curators are assembling the next edit.{'\n'}
      Check back shortly.
    </SansBody>
  </View>
);

const NoResultsState = () => (
  <View style={styles.centeredState}>
    <MonoLabel style={styles.errorLabel}>No Matches</MonoLabel>
    <SansBody style={styles.errorMessage}>
      Try a different keyword or category filter.
    </SansBody>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────

const HomeScreen = ({ navigation }) => {
  const parentNav = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartCount, setCartCount] = useState(0);

  // ── Data fetching ──────────────────────────────────────────

  const loadProducts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const { data } = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const refreshCartCount = useCallback(async () => {
    const count = await getCartCount();
    setCartCount(count);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshCartCount();
    }, [refreshCartCount])
  );

  // ── Handlers ───────────────────────────────────────────────

  const handleProductPress = useCallback((product) => {
    navigation.navigate('Details', { productId: product.id });
  }, [navigation]);

  const handleRefresh = useCallback(() => loadProducts(true), [loadProducts]);

  const handleCartPress = useCallback(() => {
    parentNav.navigate('CartTab');
  }, [parentNav]);

  // ── Filtering ──────────────────────────────────────────────

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((item) => item.category).filter(Boolean))];
    return ['All', ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesQuery =
        query.length === 0 ||
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [products, activeCategory, searchQuery]);

  // ── Renderers ──────────────────────────────────────────────

  const renderItem = useCallback(({ item, index }) => {
    const isRightCol = index % COLUMN_COUNT !== 0;
    return (
      <View style={[styles.cardWrapper, isRightCol && styles.cardRight]}>
        <ProductCard
          product={item}
          onPress={handleProductPress}
          width={CARD_WIDTH}
        />
      </View>
    );
  }, [handleProductPress]);

  const renderBody = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} onRetry={() => loadProducts()} />;
    if (products.length === 0) return <EmptyState />;

    return (
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
        ListEmptyComponent={<NoResultsState />}
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={4}
        windowSize={5}
      />
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <Header cartCount={cartCount} onCartPress={handleCartPress} />

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search pieces..."
            placeholderTextColor={Colors.muted}
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => setActiveCategory(category)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <MonoLabel style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {category}
                </MonoLabel>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {renderBody()}
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    paddingHorizontal: H_PADDING,
    paddingTop: Spacing[3],
    paddingBottom: Spacing[2],
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  brandGroup: {
    flex: 1,
  },
  storeName: {
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  tagline: {
    color: Colors.muted,
    letterSpacing: 2,
    fontSize: 9,
    marginTop: 1,
  },
  cartBtn: {
    position: 'relative',
    padding: Spacing[2],
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: -2,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  rule: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginTop: Spacing[3],
  },

  // Filters
  filtersContainer: {
    paddingHorizontal: H_PADDING,
    paddingTop: Spacing[3],
    paddingBottom: Spacing[2],
    gap: Spacing[3],
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing[3],
  },
  searchIcon: {
    fontSize: 14,
    marginRight: Spacing[2],
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing[2],
    color: Colors.foreground,
    fontSize: FontSizes.sm,
  },
  categoriesRow: {
    gap: Spacing[2],
    paddingBottom: Spacing[1],
  },
  chip: {
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing[1.5],
    paddingHorizontal: Spacing[3],
    backgroundColor: Colors.background,
  },
  chipActive: {
    backgroundColor: Colors.foreground,
    borderColor: Colors.foreground,
  },
  chipText: {
    color: Colors.muted,
    letterSpacing: 1.5,
  },
  chipTextActive: {
    color: Colors.white,
  },

  // Grid
  grid: {
    paddingHorizontal: H_PADDING,
    paddingTop: Spacing[4],
    paddingBottom: Spacing[12],
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing[8],
  },
  cardWrapper: {},
  cardRight: {},

  // States
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: H_PADDING,
    gap: Spacing[3],
  },
  loadingText: {
    color: Colors.muted,
    marginTop: Spacing[3],
  },
  errorLabel: {
    color: Colors.danger,
    marginBottom: Spacing[1],
  },
  errorMessage: {
    textAlign: 'center',
    color: Colors.muted,
  },
  retryButton: {
    marginTop: Spacing[4],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    borderWidth: 1,
    borderColor: Colors.foreground,
  },
  retryText: {
    letterSpacing: 2,
  },
  emptyHeading: {
    textAlign: 'center',
  },
  emptyBody: {
    textAlign: 'center',
    lineHeight: FontSizes.base * 1.8,
  },
});

export default HomeScreen;
