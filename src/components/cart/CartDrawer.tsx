'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { formatPrice } from '@/lib/data';

export default function CartDrawer() {
  const { state: { cart, isCartOpen }, dispatch, cartTotal } = useStore();

  const handleClose = () => dispatch({ type: 'SET_CART_OPEN', payload: false });

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-bold text-gray-900">
                  Shopping Cart ({cart.length})
                </h2>
              </div>
              <button
                id="cart-close-btn"
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 text-sm mb-6">Add some beautiful pieces to get started</p>
                  <Link
                    href="/shop"
                    onClick={handleClose}
                    className="btn-primary px-6 py-3 text-sm"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, idx) => (
                    <motion.div
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-4 p-3 bg-gray-50 rounded-xl"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product.id}`}
                          onClick={handleClose}
                          className="text-sm font-semibold text-gray-900 hover:text-rose-600 line-clamp-2 leading-tight"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex gap-2 mt-1 text-xs text-gray-500">
                          <span>{item.selectedColor}</span>
                          <span>•</span>
                          <span>Size: {item.selectedSize}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-bold text-rose-600">
                            {formatPrice(item.product.price)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => dispatch({
                                type: 'UPDATE_CART_QUANTITY',
                                payload: { productId: item.product.id, color: item.selectedColor, size: item.selectedSize, quantity: item.quantity - 1 }
                              })}
                              className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-rose-400 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => dispatch({
                                type: 'UPDATE_CART_QUANTITY',
                                payload: { productId: item.product.id, color: item.selectedColor, size: item.selectedSize, quantity: item.quantity + 1 }
                              })}
                              className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-rose-400 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => dispatch({
                                type: 'REMOVE_FROM_CART',
                                payload: { productId: item.product.id, color: item.selectedColor, size: item.selectedSize }
                              })}
                              className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-colors ml-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className={cartTotal >= 3000 ? 'text-green-600' : ''}>
                      {cartTotal >= 3000 ? 'FREE' : formatPrice(250)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-2">
                    <span>Total</span>
                    <span className="text-rose-600">
                      {formatPrice(cartTotal >= 3000 ? cartTotal : cartTotal + 250)}
                    </span>
                  </div>
                </div>
                {cartTotal < 3000 && (
                  <p className="text-xs text-center text-gray-500">
                    Add {formatPrice(3000 - cartTotal)} more for free shipping
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/cart"
                    onClick={handleClose}
                    className="btn-secondary py-3 text-sm text-center"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={handleClose}
                    id="checkout-from-cart-btn"
                    className="btn-primary py-3 text-sm flex items-center justify-center gap-2"
                  >
                    Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
