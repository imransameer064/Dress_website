'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { formatPrice } from '@/lib/data';

const FREE_SHIPPING_THRESHOLD = 3000;
const STANDARD_SHIPPING_FEE = 250;

export default function CartPage() {
  const { state, dispatch, cartCount, cartTotal } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number | null>(null);
  const [couponError, setCouponError] = useState('');
  const [orderNote, setOrderNote] = useState('');

  const shippingFee = cartTotal >= FREE_SHIPPING_THRESHOLD || cartTotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const discountAmount = couponDiscount ? Math.round(cartTotal * couponDiscount) : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount + (cartTotal > 0 ? shippingFee : 0));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const freeShippingProgress = Math.min(100, Math.round((cartTotal / FREE_SHIPPING_THRESHOLD) * 100));

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME10') {
      setCouponDiscount(0.1);
    } else if (code === 'ELEGANCE20') {
      setCouponDiscount(0.2);
    } else if (code === 'SUMMERSALE') {
      setCouponDiscount(0.15);
    } else {
      setCouponError('Invalid promo code. Try WELCOME10, ELEGANCE20, or SUMMERSALE');
      setCouponDiscount(null);
    }
  };

  const removeCoupon = () => {
    setCouponDiscount(null);
    setCouponCode('');
    setCouponError('');
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-rose-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </nav>
          <div className="flex items-baseline justify-between">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
              Shopping Cart
            </h1>
            <span className="text-sm sm:text-base text-gray-600 font-medium">
              ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </span>
          </div>
        </div>

        {state.cart.length === 0 ? (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-rose-100/60 p-12 sm:p-20 text-center shadow-sm max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-gray-900 mb-3">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
              Explore our exquisite collection of unstitched fabrics, luxury pret, and bridal wear tailored to perfection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-rose-600 text-white font-medium rounded-full hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all hover:gap-3"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/wishlist"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
              >
                <span>View Wishlist</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items & Free Shipping Banner */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Progress Indicator */}
              <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-5 h-5 text-rose-600" />
                    <span className="text-sm font-medium text-gray-800">
                      {amountNeededForFreeShipping === 0 ? (
                        <strong className="text-emerald-700">Congratulations! You unlocked FREE Shipping across Pakistan!</strong>
                      ) : (
                        <>
                          Add <span className="font-bold text-rose-600">{formatPrice(amountNeededForFreeShipping)}</span> more to qualify for <strong className="text-gray-900">FREE Shipping</strong>!
                        </>
                      )}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">{freeShippingProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${freeShippingProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <span className="col-span-6">Product</span>
                  <span className="col-span-2 text-center">Quantity</span>
                  <span className="col-span-2 text-right">Price</span>
                  <span className="col-span-2 text-right">Subtotal</span>
                </div>

                <div className="divide-y divide-gray-100">
                  <AnimatePresence initial={false}>
                    {state.cart.map((item) => {
                      const itemKey = `${item.product.id}-${item.selectedColor}-${item.selectedSize}`;
                      const itemTotal = item.product.price * item.quantity;

                      return (
                        <motion.div
                          key={itemKey}
                          layout
                          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          transition={{ duration: 0.25 }}
                          className="p-5 sm:px-6 sm:py-6"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            {/* Product Info */}
                            <div className="sm:col-span-6 flex gap-4 items-center">
                              <Link
                                href={`/product/${item.product.id}`}
                                className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 group"
                              >
                                <Image
                                  src={item.product.images[0] || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80'}
                                  alt={item.product.name}
                                  fill
                                  sizes="100px"
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </Link>

                              <div className="min-w-0 flex-1">
                                <Link
                                  href={`/product/${item.product.id}`}
                                  className="text-sm sm:text-base font-semibold text-gray-900 hover:text-rose-600 transition-colors line-clamp-1"
                                >
                                  {item.product.name}
                                </Link>
                                <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                    Color: <strong>{item.selectedColor}</strong>
                                  </span>
                                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                    Size: <strong>{item.selectedSize}</strong>
                                  </span>
                                </div>
                                <div className="mt-2 sm:hidden text-sm font-semibold text-rose-600">
                                  {formatPrice(item.product.price)}
                                </div>
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="sm:col-span-2 flex items-center sm:justify-center">
                              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
                                <button
                                  type="button"
                                  aria-label="Decrease quantity"
                                  onClick={() =>
                                    dispatch({
                                      type: 'UPDATE_CART_QUANTITY',
                                      payload: {
                                        productId: item.product.id,
                                        color: item.selectedColor,
                                        size: item.selectedSize,
                                        quantity: item.quantity - 1,
                                      },
                                    })
                                  }
                                  className="p-1.5 hover:bg-gray-200 text-gray-600 transition-colors"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center text-sm font-semibold text-gray-800">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  aria-label="Increase quantity"
                                  onClick={() =>
                                    dispatch({
                                      type: 'UPDATE_CART_QUANTITY',
                                      payload: {
                                        productId: item.product.id,
                                        color: item.selectedColor,
                                        size: item.selectedSize,
                                        quantity: item.quantity + 1,
                                      },
                                    })
                                  }
                                  className="p-1.5 hover:bg-gray-200 text-gray-600 transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Unit Price */}
                            <div className="hidden sm:block sm:col-span-2 text-right text-sm text-gray-700">
                              {formatPrice(item.product.price)}
                            </div>

                            {/* Line Total & Remove */}
                            <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3">
                              <span className="text-sm font-bold text-gray-900 sm:text-right">
                                {formatPrice(itemTotal)}
                              </span>
                              <button
                                type="button"
                                aria-label="Remove item"
                                onClick={() =>
                                  dispatch({
                                    type: 'REMOVE_FROM_CART',
                                    payload: {
                                      productId: item.product.id,
                                      color: item.selectedColor,
                                      size: item.selectedSize,
                                    },
                                  })
                                }
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Bottom Cart Actions */}
                <div className="p-5 sm:px-6 bg-gray-50/70 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Continue Shopping</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'CLEAR_CART' })}
                    className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors"
                  >
                    Clear Shopping Bag
                  </button>
                </div>
              </div>

              {/* Order Instructions Box */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <label htmlFor="order-note" className="block text-sm font-semibold text-gray-800 mb-2">
                  Special Instructions or Delivery Notes (Optional)
                </label>
                <textarea
                  id="order-note"
                  rows={2}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="e.g. Please deliver after 4 PM, call before arrival, or stitching instructions..."
                  className="w-full text-sm border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none"
                />
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-28">
                <h2 className="text-xl font-serif font-bold text-gray-900 pb-4 border-b border-gray-100">
                  Order Summary
                </h2>

                {/* Promo Code Form */}
                <div className="py-4 border-b border-gray-100">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Have a Promo Code?
                  </label>
                  {couponDiscount ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <span>
                          Code <strong>{couponCode.toUpperCase()}</strong> applied! ({couponDiscount * 100}% off)
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-emerald-700 hover:text-emerald-900 font-bold underline ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={applyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="e.g. WELCOME10"
                          className="w-full pl-9 pr-3 py-2 text-sm uppercase font-medium border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
                </div>

                {/* Cost Breakdown */}
                <div className="py-4 space-y-3 text-sm border-b border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatPrice(cartTotal)}</span>
                  </div>

                  {couponDiscount && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Promo Discount ({couponDiscount * 100}%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <span>Estimated Shipping</span>
                      {shippingFee === 0 && (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          FREE
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400">
                    Taxes and duty included. Standard delivery across Pakistan (3-5 working days).
                  </p>
                </div>

                {/* Final Total */}
                <div className="py-4">
                  <div className="flex justify-between items-baseline mb-6">
                    <div>
                      <span className="text-base font-bold text-gray-900 block">Total Amount</span>
                      <span className="text-xs text-gray-500">PKR (Pakistani Rupees)</span>
                    </div>
                    <span className="text-2xl font-bold text-rose-600">{formatPrice(finalTotal)}</span>
                  </div>

                  {/* Checkout CTA */}
                  <Link
                    href="/checkout"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold rounded-xl shadow-lg shadow-rose-600/25 transition-all text-sm group"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Safe & Secure Checkout | Cash on Delivery Available</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100/60 mt-2 space-y-2.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>100% Genuine Designer Fabrics & Stitching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>Hassle-free 7-Day Returns & Exchanges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>Nationwide Delivery via TCS, Leopards & Call Courier</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
