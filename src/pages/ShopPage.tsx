import React, { useState, useMemo } from 'react';
import { FilterState, Product } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  RotateCcw,
  LayoutGrid,
  Check,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShopPageProps {
  onSelectProduct: (product: Product) => void;
  initialCategory?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onSelectProduct,
  initialCategory = 'All',
  searchQuery,
  setSearchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [maxPrice, setMaxPrice] = useState<number>(1200);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating-high' | 'newest'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync if initialCategory changes from parent
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const categoriesList = ['All', ...CATEGORIES.map((c) => c.name)];

  // Filter and sort computation
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesTagline = product.tagline.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesTagline && !matchesDesc) {
          return false;
        }
      }
      // Price range
      if (product.price > maxPrice) {
        return false;
      }
      // Min rating
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }
      // In stock
      if (inStockOnly && product.stock <= 0) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating-high') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, maxPrice, minRating, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(1200);
    setMinRating(0);
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    maxPrice < 1200 ||
    minRating > 0 ||
    inStockOnly ||
    searchQuery.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Cybernetic Hardware Catalog
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse our complete inventory of cutting-edge tech, neural peripherals, and optics.
          </p>
        </div>

        {/* Action / Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 hover:border-cyan-500"
            id="mobile-filters-trigger"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            )}
          </button>

          {/* Sort By Dropdown */}
          <div className="relative flex items-center">
            <label htmlFor="shop-sort-select" className="sr-only">Sort By</label>
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              id="shop-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-9 pr-8 py-2.5 text-xs font-medium rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer font-sans"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating-high">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 p-6 rounded-2xl bg-[#0b0f19] border border-slate-800 sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Filter Specs</span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search Within Filter */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Live Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Category
            </label>
            <div className="space-y-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase tracking-wider text-slate-400">Price Ceiling</span>
              <span className="font-mono font-bold text-cyan-400">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="1200"
              step="20"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>$100</span>
              <span>$600</span>
              <span>$1200+</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2.5 pt-3 border-t border-slate-800">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Minimum Rating
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 4.0, 4.5, 4.8].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setMinRating(rating)}
                  className={`py-1.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1 transition-all ${
                    minRating === rating
                      ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {rating === 0 ? (
                    'All'
                  ) : (
                    <>
                      <span>{rating}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">In-Stock Only</span>
            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                inStockOnly ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                  inStockOnly ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </aside>

        {/* Products Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
              <span className="text-slate-500 font-mono text-[11px] uppercase">Active Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {maxPrice < 1200 && (
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5">
                  Under ${maxPrice}
                  <button onClick={() => setMaxPrice(1200)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {minRating > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300 flex items-center gap-1.5">
                  ★ {minRating}+ Stars
                  <button onClick={() => setMinRating(0)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5">
                  In-Stock
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1.5">
                  &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={resetFilters}
                className="ml-auto text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>SHOWING {filteredProducts.length} OF {PRODUCTS.length} HARDWARE UNITS</span>
          </div>

          {/* Grid View */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center rounded-2xl bg-[#0b0f19] border border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No cyberware matched your criteria</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your price range, clearing your active search filter, or selecting a different hardware category.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md hover:from-cyan-400 hover:to-purple-500"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative ml-auto w-full max-w-xs h-full bg-[#0b0f19] border-l border-slate-800 p-6 overflow-y-auto space-y-6 z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="font-bold text-white text-base">Filter Products</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category List */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-slate-400">Category</label>
                <div className="space-y-1">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        selectedCategory === cat
                          ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-mono">Max Price</span>
                  <span className="text-cyan-400 font-mono font-bold">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1200"
                  step="20"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              {/* Apply / Close buttons */}
              <div className="pt-4 border-t border-slate-800 flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-semibold"
                >
                  Apply ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
