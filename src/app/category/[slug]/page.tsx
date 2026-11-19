'use client';

import { use, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/lib/store-context';
import ProductCard from '@/components/products/ProductCard';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'New Arrivals' },
];

function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { state } = useStore();
  const [sortBy, setSortBy] = useState('featured');
  const [priceMax, setPriceMax] = useState<number>(100000);

  // Find the category from dynamic state
  const category = state.categories.find((c) => c.slug === slug);

  // If not found in categories, check if it's new-arrivals or sale
  const isSpecialCategory = slug === 'new-arrivals' || slug === 'sale';

  const categoryTitle = category
    ? category.name
    : slug === 'new-arrivals'
    ? 'New Arrivals'
    : slug === 'sale'
    ? 'Sale & Discounts'
    : null;

  if (!categoryTitle && !category) {
    notFound();
  }

  const categoryDescription = category?.description || (
    slug === 'new-arrivals'
      ? 'Explore our freshest arrivals of unstitched fabrics, luxury pret, and modern kurtis straight from the design studio.'
      : 'Special discounted luxury ensembles and ready-to-wear dresses at unbeatable Pakistani Rupee rates.'
  );

  const categoryImage = category?.image || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1200&q=80';

  // Filter products matching this category
  const categoryProducts = useMemo(() => {
    let prods = state.products.filter((p) => {
      if (slug === 'new-arrivals') return p.isNew;
      if (slug === 'sale') return p.isSale;
      return p.category === slug;
    });

    // Price filtering
    prods = prods.filter((p) => p.price <= priceMax);

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        return [...prods].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...prods].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...prods].sort((a, b) => b.rating - a.rating);
      case 'newest':
        return [...prods].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return prods;
    }
  }, [state.products, slug, sortBy, priceMax]);

  // Other categories for footer recommendations
  const otherCategories = state.categories.filter((c) => c.slug !== slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      {/* Category Banner */}
      <section className="relative h-[280px] sm:h-[360px] bg-neutral-900 overflow-hidden flex items-end">
        <Image
          src={categoryImage}
          alt={categoryTitle || 'Category'}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 w-full">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 mb-3">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-white transition-colors">
              Categories
            </Link>
            <span>/</span>
            <span className="text-rose-300 font-medium">{categoryTitle}</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-2">
              {categoryTitle}
            </h1>
            <p className="text-sm sm:text-base text-gray-200 line-clamp-2 font-light">
              {categoryDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Product Grid and Controls */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
          {/* Top Bar Filter & Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-100 gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Showing <strong className="text-gray-900">{categoryProducts.length}</strong> luxurious designs
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Price Filter slider */}
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-600">
                <span>Max Price:</span>
                <span className="font-bold text-rose-600">PKR {priceMax.toLocaleString()}</span>
                <input
                  type="range"
                  min="2000"
                  max="100000"
                  step="1000"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-20 sm:w-28 accent-rose-600 cursor-pointer"
                />
              </div>

              {/* Sort selector */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-800 text-xs sm:text-sm font-medium rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 pointer-events-none text-gray-500" />
              </div>
            </div>
          </div>

          {/* Product Cards */}
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">
                No items match your selected filters
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                Try increasing your price range or check back soon for our fresh seasonal drops.
              </p>
              <button
                onClick={() => setPriceMax(100000)}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold"
              >
                Reset Price Filter
              </button>
            </div>
          )}
        </div>

        {/* Explore Other Collections Bar */}
        <div className="mt-12 bg-rose-50/60 rounded-3xl p-8 border border-rose-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-900">
                Explore More Collections
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                You might also adore these curated traditional and modern styles
              </p>
            </div>
            <Link
              href="/categories"
              className="text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
            >
              <span>All Collections</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {otherCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative h-28 rounded-2xl overflow-hidden shadow-sm flex items-end p-3"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="200px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                <span className="relative z-10 text-xs sm:text-sm font-semibold text-white group-hover:text-rose-300 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-rose-500 font-medium">Loading category...</div></div>}>
      <CategoryContent params={params} />
    </Suspense>
  );
}
