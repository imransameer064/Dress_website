'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Sparkles, Layers } from 'lucide-react';
import { useStore } from '@/lib/store-context';

export default function CategoriesPage() {
  const { state } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = state.categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      {/* Category Hero Banner */}
      <section className="relative bg-gradient-to-br from-rose-950 via-rose-900 to-gray-950 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs sm:text-sm font-medium mb-4 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Timeless Pakistani Couture & Modern Pret</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-4">
              Explore Collections & Categories
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              From hand-embroidered bridal masterworks to breezy summer lawn suits and chic ready-to-wear kurtis, discover attire crafted for royalty.
            </p>

            {/* Quick Filter Search */}
            <div className="mt-8 max-w-md mx-auto relative">
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories (e.g. Lawn, Bridal, Formal)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 backdrop-blur-md rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Categories Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-rose-950/5 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-gray-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
                  All Fashion Collections
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Showing {filteredCategories.length} curated categories
                </p>
              </div>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCategories.map((cat, idx) => {
              const productCount = state.products.filter((p) => {
                if (cat.slug === 'new-arrivals') return p.isNew;
                if (cat.slug === 'sale') return p.isSale;
                return p.category === cat.slug;
              }).length;

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="group relative bg-neutral-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-end min-h-[340px]"
                >
                  {/* Background Image */}
                  <Image
                    src={cat.image || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80'}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-75 group-hover:opacity-85"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent group-hover:via-gray-950/40 transition-all duration-300" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold text-gray-900 shadow-sm">
                      {productCount} {productCount === 1 ? 'Design' : 'Designs'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-6 flex flex-col">
                    <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed font-light">
                      {cat.description}
                    </p>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/category/${cat.slug}`}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 px-4 py-2.5 rounded-full transition-colors shadow-md"
                      >
                        <span>View Category</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        className="inline-flex items-center text-xs font-medium text-gray-300 hover:text-white px-3 py-2 rounded-full hover:bg-white/10 transition-colors"
                      >
                        <span>Quick Shop</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-base mb-4">No categories found matching &quot;{searchQuery}&quot;</p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-2 bg-rose-600 text-white rounded-full text-sm font-medium hover:bg-rose-700"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
