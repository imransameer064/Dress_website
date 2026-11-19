'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { formatPrice } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';

export default function WishlistPage() {
  const { state: { wishlist, products }, dispatch } = useStore();
  const suggested = products.filter((p) => !wishlist.some((w) => w.id === p.id)).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
            <Heart className="w-7 h-7 text-rose-600 fill-rose-600" />
            <span>My Wishlist ({wishlist.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Keep track of your favorite Pakistani designer pieces and move them to your bag anytime.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-sm text-gray-500 mb-6">
              Explore our fresh lawn, bridal, and luxury pret collections and tap the heart icon to save items.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-md transition-colors"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
              {wishlist.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="product-card group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    <Link href={`/product/${product.id}`} className="block w-full h-full">
                      <Image
                        src={product.images[0] || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id })
                      }
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3.5 flex flex-col flex-1 justify-between">
                    <Link
                      href={`/product/${product.id}`}
                      className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 hover:text-rose-600 mb-2 transition-colors"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs sm:text-sm font-bold text-rose-600">
                        {formatPrice(product.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch({
                            type: 'ADD_TO_CART',
                            payload: {
                              product,
                              color: product.colors[0],
                              size: product.sizes[0],
                            },
                          });
                          dispatch({ type: 'SET_CART_OPEN', payload: true });
                        }}
                        className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shadow-sm transition-colors"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {suggested.length > 0 && (
              <div className="pt-8 border-t border-gray-200">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
                  You Might Also Adore
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {suggested.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
