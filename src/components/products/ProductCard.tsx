'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Product, formatPrice } from '@/lib/data';
import { useStore } from '@/lib/store-context';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
}

export default function ProductCard({ product, showQuickAdd = true }: ProductCardProps) {
  const { dispatch, isInWishlist } = useStore();
  const [addedToCart, setAddedToCart] = useState(false);
  const [hoveredImg, setHoveredImg] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, color: product.colors[0], size: product.sizes[0] },
    });
    dispatch({ type: 'SET_CART_OPEN', payload: true });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="product-card group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100"
    >
      {/* Image Container with Link */}
      <div
        className="relative aspect-[3/4] bg-gray-100 overflow-hidden"
        onMouseEnter={() => setHoveredImg(true)}
        onMouseLeave={() => setHoveredImg(false)}
      >
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={hoveredImg && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none z-10">
          {product.isNew && <span className="badge-new">NEW</span>}
          {product.isSale && product.discount && (
            <span className="badge-sale">-{product.discount}%</span>
          )}
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
          {/* Wishlist */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={handleToggleWishlist}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all duration-200 ${
              inWishlist
                ? 'bg-rose-500 text-white'
                : 'bg-white text-gray-600 hover:bg-rose-50 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
          </motion.button>

          {/* Quick View Link */}
          <Link
            href={`/product/${product.id}`}
            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
            aria-label="View product details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Add to Cart button */}
        {showQuickAdd && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              className={`w-full py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                addedToCart
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white hover:bg-rose-700 shadow-md'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addedToCart ? 'Added to Bag!' : 'Add to Cart'}</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {product.brand && (
            <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider mb-1">
              {product.brand}
            </p>
          )}

          <Link
            href={`/product/${product.id}`}
            className="block text-xs sm:text-sm font-semibold text-gray-900 hover:text-rose-600 transition-colors line-clamp-2 leading-snug mb-1.5"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`w-3 h-3 ${
                  n <= Math.round(product.rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
            <span className="text-[11px] text-gray-400 ml-1">({product.reviews.length})</span>
          </div>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-rose-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Color previews */}
          {product.colors.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap items-center">
              {product.colors.slice(0, 3).map((color) => (
                <span
                  key={color}
                  className="w-3.5 h-3.5 rounded-full border border-gray-200 bg-gray-100"
                  title={color}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[10px] text-gray-400 font-medium">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
