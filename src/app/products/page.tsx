'use client';

import React, { useState, useMemo } from 'react';
import catalogData from '../../data/vexora-catalog.json';
import { 
  ShoppingBag, 
  Sparkles, 
  Layers, 
  Search, 
  Check, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  ArrowRight,
  Tag,
  Filter
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  alt: string;
}

interface Category {
  id: string;
  name?: string;
  title?: string;
  cover?: string;
  image?: string;
  subcategories?: string[];
  desc?: string;
}

// Utility to optimize image URL query string for instant WebP delivery on slow connections
function optimizeImageUrl(url: string): string {
  if (!url) return '';
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=format&fit=crop&w=400&q=60`;
  }
  return url;
}

// Refactored Product Card with image fallback and aspect-[4/3] to prevent layout shifts on slow networks
interface ProductCardProps {
  product: Product;
  qtyInCart: number;
  onAddToCart: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  formatINR: (amount: number) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  qtyInCart,
  onAddToCart,
  onUpdateQuantity,
  formatINR,
}) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = optimizeImageUrl(product.image);

  return (
    <div className="group relative bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col">
      {/* Image Thumbnail Container - Fixed aspect-[4/3] to prevent layout shift */}
      <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
        {!imgError ? (
          <img
            src={imageUrl}
            alt={product.alt || product.name}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
            <Sparkles className="w-8 h-8 text-blue-400 mb-2" />
            <span className="text-sm font-bold text-white text-center leading-snug drop-shadow-md">
              {product.name}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* ID Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-bold text-slate-300 tracking-wider">
          {product.id.toUpperCase()}
        </div>

        {/* Active Quantity Badge Overlay */}
        {qtyInCart > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-black shadow-lg shadow-blue-500/50 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>{qtyInCart} in cart</span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-white font-display">
              {formatINR(product.price)}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">incl. taxes</span>
          </div>
        </div>

        {/* Interactive Add to Cart Button / Quantity Controller */}
        <div className="pt-3 border-t border-slate-800/80">
          {qtyInCart === 0 ? (
            <button
              onClick={() => onAddToCart(product.id)}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          ) : (
            <div className="flex items-center justify-between p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => onUpdateQuantity(product.id, -1)}
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold text-sm text-white px-2">
                {qtyInCart}
              </span>
              <button
                onClick={() => onUpdateQuantity(product.id, 1)}
                className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all active:scale-90"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Refactored Category Card with image fallback and aspect-[4/3]
interface CategoryCardProps {
  category: Category;
  onBrowse: (categoryName: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onBrowse }) => {
  const [imgError, setImgError] = useState(false);
  const rawCover = category.cover || category.image || '';
  const coverUrl = optimizeImageUrl(rawCover);
  const catName = category.name || category.title || 'Category';
  const subcategories: string[] = category.subcategories || (category.desc ? [category.desc] : []);

  return (
    <div className="group bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 shadow-lg flex flex-col">
      {/* Cover Banner - Fixed aspect-[4/3] to prevent layout shift */}
      <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
        {!imgError && coverUrl ? (
          <img
            src={coverUrl}
            alt={catName}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
            <Layers className="w-8 h-8 text-blue-400 mb-2" />
            <span className="text-sm font-bold text-white text-center leading-snug drop-shadow-md">
              {catName}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white mb-1 tracking-wider uppercase">
              {category.id}
            </span>
            <h3 className="text-xl font-black text-white leading-tight">
              {catName}
            </h3>
          </div>
        </div>
      </div>

      {/* Subcategories List */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-slate-900/40">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-blue-400" />
            Subcategories ({subcategories.length})
          </div>

          <div className="flex flex-wrap gap-1.5">
            {subcategories.map((sub, idx) => (
              <span
                key={idx}
                className="inline-block text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-600/10 cursor-pointer transition-all"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">
            {subcategories.length} subcategories listed
          </span>
          <button
            onClick={() => onBrowse(catName)}
            className="font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
          >
            Browse Items <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function VexoraProductsPage() {
  const [viewMode, setViewMode] = useState<'featured' | 'categories'>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'low-high' | 'high-low'>('default');
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const featuredProducts: Product[] = catalogData.featured_products;
  const categories: Category[] = catalogData.categories as Category[];

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const updated = current + delta;
      if (updated <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: updated };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const cartTotalItems = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const cartTotalPrice = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const prod = featuredProducts.find((p) => p.id === id);
      return sum + (prod ? prod.price * qty : 0);
    }, 0);
  }, [cart, featuredProducts]);

  const filteredProducts = useMemo(() => {
    let result = featuredProducts.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === 'low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-low') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [featuredProducts, searchQuery, sortBy]);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const name = c.name || c.title || '';
      const subcats = c.subcategories || (c.desc ? [c.desc] : []);
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subcats.some((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [categories, searchQuery]);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Banner Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between py-4 sm:h-20 gap-4">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-white tracking-widest text-lg">
                  V
                </div>
              </div>
              <div>
                <span className="text-xl font-black tracking-wider text-white font-display">
                  VEXORA<span className="text-blue-500">.</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Student Catalog
                </span>
              </div>
            </div>

            {/* View Mode Switcher Tabs */}
            <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
              <button
                onClick={() => setViewMode('featured')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  viewMode === 'featured'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Featured Products</span>
                <span className="ml-1 text-[11px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-bold">
                  {featuredProducts.length}
                </span>
              </button>

              <button
                onClick={() => setViewMode('categories')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  viewMode === 'categories'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>All Store Categories</span>
                <span className="ml-1 text-[11px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-bold">
                  {categories.length}
                </span>
              </button>
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white transition-all duration-200 group shadow-md"
            >
              <ShoppingBag className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline font-semibold text-sm">Cart</span>
              {cartTotalItems > 0 && (
                <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/40">
                  {cartTotalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Bar: Search & Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-md">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={
                viewMode === 'featured'
                  ? 'Search featured products...'
                  : 'Search categories or items...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Stats & Filters */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
            <div className="text-xs font-medium text-slate-400">
              Showing{' '}
              <span className="font-bold text-slate-200">
                {viewMode === 'featured'
                  ? filteredProducts.length
                  : filteredCategories.length}
              </span>{' '}
              {viewMode === 'featured' ? 'items' : 'categories'}
            </div>

            {viewMode === 'featured' && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as any)}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="default">Sort by: Default</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* View Mode 1: Featured Products Grid */}
        {viewMode === 'featured' && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  Featured Products
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Hand-picked
                  </span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Tactile study tools, stationery, and DIY kits engineered for campus life.
                </p>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800/50">
                <Search className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                <h3 className="text-lg font-bold text-slate-300">No products found</h3>
                <p className="text-sm text-slate-500 mt-1">Try adjusting your search criteria.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    qtyInCart={cart[product.id] || 0}
                    onAddToCart={addToCart}
                    onUpdateQuantity={updateQuantity}
                    formatINR={formatINR}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* View Mode 2: All Store Categories */}
        {viewMode === 'categories' && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                All Store Categories
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {categories.length} Aisles
                </span>
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Explore every shelf and subcategory available across VEXORA.
              </p>
            </div>

            {filteredCategories.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800/50">
                <Search className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                <h3 className="text-lg font-bold text-slate-300">No categories found</h3>
                <p className="text-sm text-slate-500 mt-1">Try searching for another category.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onBrowse={(name) => {
                      setViewMode('featured');
                      setSearchQuery(name);
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl">
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Your Shopping Cart</h2>
                    <p className="text-xs text-slate-400">
                      {cartTotalItems} {cartTotalItems === 1 ? 'item' : 'items'} selected
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Items */}
              <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-800/80">
                {Object.keys(cart).length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <ShoppingBag className="w-12 h-12 mx-auto text-slate-700 mb-3" />
                    <p className="font-semibold text-slate-400">Your cart is currently empty</p>
                    <p className="text-xs mt-1">Add items from the Featured Products tab.</p>
                  </div>
                ) : (
                  Object.entries(cart).map(([productId, quantity]) => {
                    const product = featuredProducts.find((p) => p.id === productId);
                    if (!product) return null;
                    const imageUrl = optimizeImageUrl(product.image);
                    return (
                      <div key={productId} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-slate-800 flex-shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-sm text-slate-200 leading-tight">
                              {product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(productId)}
                              className="text-slate-500 hover:text-red-400 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-extrabold text-sm text-blue-400 font-display">
                              {formatINR(product.price * quantity)}
                            </span>
                            <div className="flex items-center gap-2 bg-slate-950 rounded-lg p-1 border border-slate-800">
                              <button
                                onClick={() => updateQuantity(productId, -1)}
                                className="w-6 h-6 rounded bg-slate-900 text-slate-300 flex items-center justify-center"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold px-1">{quantity}</span>
                              <button
                                onClick={() => updateQuantity(productId, 1)}
                                className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              {cartTotalItems > 0 && (
                <div className="p-6 border-t border-slate-800 bg-slate-950/60 space-y-4">
                  <div className="flex items-center justify-between text-base">
                    <span className="font-medium text-slate-400">Total Amount:</span>
                    <span className="text-2xl font-black text-white font-display">
                      {formatINR(cartTotalPrice)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(
                        `Hi VEXORA, I would like to place an order for:\n` +
                          Object.entries(cart)
                            .map(([id, qty]) => {
                              const p = featuredProducts.find((item) => item.id === id);
                              return `- ${p?.name} x${qty} (${formatINR((p?.price || 0) * qty)})`;
                            })
                            .join('\n') +
                          `\n\nTotal: ${formatINR(cartTotalPrice)}`
                      );
                      window.open(`https://wa.me/910000000000?text=${text}`, '_blank');
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Proceed to WhatsApp Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
