'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, X, Search, ChevronDown, Sparkles } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { useStore } from '@/lib/store-context';
import { formatPrice } from '@/lib/data';
import type { Product } from '@/lib/data';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const { state } = useStore();

  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : []);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (categoryParam) setSelectedCategories([categoryParam]);
    if (searchParam) setSearchQuery(searchParam);
  }, [categoryParam, searchParam]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSortBy('featured');
    setPriceRange([0, 100000]);
    setSearchQuery('');
  };

  // Filtered products calculated dynamically from store state
  const filtered = useMemo(() => {
    let result = state.products;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.fabric && p.fabric.toLowerCase().includes(q)) ||
          p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => {
        return selectedCategories.some(cat => {
          if (cat === 'new-arrivals') return p.isNew;
          if (cat === 'sale') return p.isSale;
          return p.category === cat;
        });
      });
    }

    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...result].sort((a, b) => b.rating - a.rating);
      case 'newest':
        return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return result;
    }
  }, [state.products, selectedCategories, sortBy, priceRange, searchQuery]);

  const currentCategory = state.categories.find(c => c.slug === categoryParam);

  const FilterSidebar = () => (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Categories */}
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Collections & Categories</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {state.categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                  className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-400"
                />
                <span className="text-xs sm:text-sm text-gray-700 group-hover:text-rose-600 transition-colors">
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Price Range (PKR)</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[11px] text-gray-400">Min</label>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-rose-400"
                />
              </div>
              <div className="flex-1">
                <label className="text-[11px] text-gray-400">Max</label>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50">
          <button
            onClick={clearFilters}
            className="w-full py-2 text-xs font-semibold text-gray-600 hover:text-rose-600 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-neutral-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <nav className="text-xs sm:text-sm text-gray-500 mb-2 flex items-center gap-2">
            <a href="/" className="hover:text-rose-600">Home</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {currentCategory ? currentCategory.name : 'Shop All'}
            </span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900">
                {currentCategory ? currentCategory.name : 'All Women\'s Clothing'}
              </h1>
              {currentCategory && (
                <p className="text-sm text-gray-500 mt-1 max-w-xl">{currentCategory.description}</p>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Showing <strong className="text-gray-900">{filtered.length}</strong> designs
            </p>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          {/* Main Area */}
          <div className="flex-1 min-w-0">
            {/* Search & Mobile Filter Toggle */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dresses, fabrics (lawn, chiffon), or styles..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-rose-400 bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {selectedCategories.length > 0 && (
                    <span className="w-5 h-5 bg-rose-500 text-white rounded-full text-xs flex items-center justify-center">
                      {selectedCategories.length}
                    </span>
                  )}
                </button>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-rose-400 bg-white text-gray-700 font-medium"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategories.map(cat => {
                  const c = state.categories.find(c => c.slug === cat);
                  return (
                    <span key={cat} className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs sm:text-sm border border-rose-100 font-medium">
                      {c?.name || cat}
                      <button onClick={() => toggleCategory(cat)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                <button onClick={clearFilters} className="text-xs sm:text-sm text-gray-500 hover:text-rose-600 font-medium">
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-sm text-gray-500 mb-6">Try adjusting your filters, price range, or search keyword</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-md transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filtered.map(product => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-white overflow-y-auto lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-rose-500">Loading products...</div></div>}>
      <ShopContent />
    </Suspense>
  );
}
