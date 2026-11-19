'use client';

import { useState, use, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  Truck,
  RefreshCw,
  Shield,
  Share2,
  Check,
  Plus,
  Minus,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { formatPrice, Review, Product } from '@/lib/data';
import ProductCard from '@/components/products/ProductCard';

function ProductContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state, dispatch, isInWishlist } = useStore();

  // Find product from store state (supports newly added/edited products in Admin)
  const product = state.products.find((p) => p.id === id);

  if (!product) notFound();

  // Related products from state
  const related = state.products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const inWishlist = isInWishlist(product.id);

  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Default');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');

  // Review Form States
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState(state.user?.name || '');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product: { ...product },
        color: selectedColor,
        size: selectedSize,
        quantity,
      },
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      userId: state.user?.id || `user_${Date.now()}`,
      userName: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toISOString(),
    };

    dispatch({
      type: 'ADD_REVIEW',
      payload: {
        productId: product.id,
        review: newReview,
      },
    });

    setReviewComment('');
    setIsReviewFormOpen(false);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Elegance Pakistan!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs sm:text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-rose-600 transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/category/${product.category}`}
            className="hover:text-rose-600 capitalize transition-colors"
          >
            {product.category.replace(/-/g, ' ')}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* ===== IMAGE GALLERY ===== */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-neutral-100 rounded-3xl overflow-hidden group shadow-sm border border-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.images[activeImage] || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80'}
                    alt={`${product.name} - image ${activeImage + 1}`}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImage(
                        (i) => (i - 1 + product.images.length) % product.images.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-gray-800"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImage((i) => (i + 1) % product.images.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-gray-800"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-[11px] font-bold shadow-sm">
                    NEW ARRIVAL
                  </span>
                )}
                {product.isSale && (
                  <span className="px-3 py-1 bg-rose-600 text-white rounded-full text-[11px] font-bold shadow-sm">
                    SALE {product.discount ? `-${product.discount}%` : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === i
                        ? 'border-rose-600 scale-95 shadow-md'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== PRODUCT DETAILS ===== */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                  {product.category.replace(/-/g, ' ')}
                </span>

                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews Count */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(product.rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-gray-900 ml-1.5">{product.rating}</span>
                </div>
                <span className="text-gray-300">•</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  {product.reviews.length} Customer {product.reviews.length === 1 ? 'Review' : 'Reviews'}
                </button>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  In Stock ({product.stock} available)
                </span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 py-3 border-y border-gray-100">
              <span className="text-3xl font-bold text-rose-600 font-sans">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Save {product.discount}%
                </span>
              )}
              <span className="text-xs text-gray-400 ml-auto">All prices in Pakistani Rupees (PKR)</span>
            </div>

            {/* Colors Selection */}
            {product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Color Shade: <span className="text-gray-900">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        selectedColor === color
                          ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Selected Size: <span className="text-gray-900">{selectedSize}</span>
                  </label>
                  <span className="text-[11px] text-gray-400">Pakistani Standard Stitching</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[42px] px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedSize === size
                          ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/70 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all ${
                    addedToCart
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Shopping Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag • {formatPrice(product.price * quantity)}</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`p-3.5 rounded-xl border transition-all ${
                    inWishlist
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>
              </div>

              {/* Direct Checkout CTA */}
              <Link
                href="/cart"
                className="w-full inline-flex items-center justify-center py-3 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors"
              >
                View Bag & Proceed to Checkout
              </Link>
            </div>

            {/* Delivery & Care Badges */}
            <div className="bg-neutral-50/70 rounded-2xl p-4 border border-gray-100 space-y-2.5 text-xs text-gray-600">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>
                  <strong>Cash on Delivery (COD)</strong> available nationwide across Pakistan
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>
                  <strong>7-Day Returns & Exchanges</strong> with doorstep courier pickup
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>
                  <strong>100% Genuine Fabrics</strong> & guaranteed designer stitching
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== TABS SECTION (Description, Details, Reviews) ===== */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex border-b border-gray-200">
            {(['description', 'details', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-bold capitalize border-b-2 transition-all ${
                  activeTab === tab
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab} {tab === 'reviews' ? `(${product.reviews.length})` : ''}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="max-w-3xl space-y-4">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {product.description}
                </p>
                <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100/60 text-xs text-gray-700">
                  <h4 className="font-bold text-rose-900 mb-1">Fabric & Wash Care Instructions:</h4>
                  <p>
                    Dry clean recommended for heavily embellished and luxury embroidered suits.
                    For lawn fabrics, gentle hand wash in cold water with mild detergent. Do not bleach or tumble dry in direct harsh sunlight.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                {[
                  ['Category', product.category.replace(/-/g, ' ')],
                  ['Fabric Material', product.fabric || 'Premium Textile'],
                  ['Occasion', product.occasion || 'Festive / Casual'],
                  ['Brand Collection', product.brand || 'Elegance Pakistan'],
                  ['Available Stock', `${product.stock} units in warehouse`],
                  ['Available Colors', product.colors.join(', ')],
                  ['Sizes Available', product.sizes.join(', ')],
                ].map(([k, v]) => (
                  <div key={String(k)} className="flex gap-3 bg-neutral-50 rounded-xl p-4 border border-gray-100">
                    <span className="text-xs text-gray-400 w-32 flex-shrink-0 font-medium">{k}</span>
                    <span className="text-xs font-bold text-gray-900 capitalize">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-3xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Customer Reviews ({product.reviews.length})
                    </h3>
                    <p className="text-xs text-gray-500">
                      Average rating: ★ {product.rating} / 5.0
                    </p>
                  </div>

                  <button
                    onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{isReviewFormOpen ? 'Cancel' : 'Write a Review'}</span>
                  </button>
                </div>

                {reviewSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Your review was published successfully! Thank you for sharing your feedback.</span>
                  </div>
                )}

                {/* Review Form Drawer */}
                <AnimatePresence>
                  {isReviewFormOpen && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddReview}
                      className="p-5 bg-neutral-50 rounded-2xl border border-gray-200 space-y-4"
                    >
                      <h4 className="font-bold text-sm text-gray-900">Share Your Experience</h4>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Rating (Stars)
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewRating(star)}
                              className="p-1 text-2xl transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= reviewRating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="e.g. Fatima Tariq"
                          className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Review Comments *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Tell other shoppers about the fabric quality, stitching, and fit..."
                          className="w-full text-xs border border-gray-200 rounded-xl p-3 bg-white focus:outline-none focus:border-rose-500 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                      >
                        Submit Review
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Reviews List */}
                {product.reviews.length === 0 ? (
                  <p className="text-gray-500 text-xs py-4">
                    No reviews yet. Be the first to share your thoughts on this ensemble!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {product.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-neutral-50/70 border border-gray-100 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center">
                              {rev.userName[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <span className="font-semibold text-xs text-gray-900 block">
                                {rev.userName}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(rev.date).toLocaleDateString('en-PK', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= rev.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ===== RELATED PRODUCTS ===== */}
        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900">
                  You May Also Adore
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  More matching styles from our {product.category.replace(/-/g, ' ')} collection
                </p>
              </div>

              <Link
                href={`/category/${product.category}`}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                View Collection &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-rose-500 font-medium">Loading product...</div></div>}>
      <ProductContent params={params} />
    </Suspense>
  );
}
