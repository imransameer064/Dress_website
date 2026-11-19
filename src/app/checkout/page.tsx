'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, CreditCard, Smartphone, Banknote, Truck } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { formatPrice } from '@/lib/data';
import type { Order, CustomerInfo, ShippingAddress } from '@/lib/data';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when your order arrives', isDemo: false },
  { id: 'jazzcash', label: 'JazzCash', icon: Smartphone, desc: 'Pay via JazzCash mobile wallet', isDemo: true },
  { id: 'easypaisa', label: 'Easypaisa', icon: Smartphone, desc: 'Pay via Easypaisa mobile wallet', isDemo: true },
  { id: 'bank', label: 'Bank Transfer', icon: CreditCard, desc: 'Transfer to our bank account', isDemo: true },
];

const CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan',
  'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Bahawalpur', 'Other'
];

const PROVINCES = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Azad Kashmir', 'Gilgit-Baltistan'];

export default function CheckoutPage() {
  const { state: { cart }, dispatch, cartTotal } = useStore();
  const [step, setStep] = useState<'info' | 'shipping' | 'payment' | 'success'>('info');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderId, setOrderId] = useState('');

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: '', email: '', phone: '' });
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({ street: '', city: '', province: 'Punjab', postalCode: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = cartTotal >= 3000 ? 0 : 250;
  const total = cartTotal + shipping;

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛍️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products before checking out</p>
          <Link href="/shop" className="btn-primary px-6 py-3 text-sm">Shop Now</Link>
        </div>
      </div>
    );
  }

  const validateStep = () => {
    const errs: Record<string, string> = {};
    if (step === 'info') {
      if (!customerInfo.name.trim()) errs.name = 'Full name is required';
      if (!customerInfo.email.trim() || !/\S+@\S+\.\S+/.test(customerInfo.email)) errs.email = 'Valid email is required';
      if (!customerInfo.phone.trim() || customerInfo.phone.length < 10) errs.phone = 'Valid phone number is required';
    }
    if (step === 'shipping') {
      if (!shippingAddress.street.trim()) errs.street = 'Street address is required';
      if (!shippingAddress.city.trim()) errs.city = 'City is required';
      if (!shippingAddress.postalCode.trim()) errs.postalCode = 'Postal code is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step === 'info') setStep('shipping');
    else if (step === 'shipping') setStep('payment');
    else if (step === 'payment') placeOrder();
  };

  const placeOrder = () => {
    const newOrderId = 'EP' + Date.now().toString().slice(-8).toUpperCase();
    const order: Order = {
      id: newOrderId,
      items: [...cart],
      total,
      status: 'pending',
      customerInfo,
      shippingAddress,
      paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_ORDER', payload: order });
    dispatch({ type: 'CLEAR_CART' });
    setOrderId(newOrderId);
    setStep('success');
  };

  const STEPS = [
    { id: 'info', label: 'Contact Info' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
  ];

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-gray-900 focus:outline-none focus:ring-2 transition-all ${
      errors[field] ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-rose-400 focus:border-transparent'
    }`;

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-4">
            Your order <strong className="text-rose-600">#{orderId}</strong> has been placed successfully.
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estimated Delivery</span>
              <span className="font-medium">3-5 Business Days</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
              <span>Total Paid</span>
              <span className="text-rose-600">{formatPrice(total)}</span>
            </div>
          </div>
          {paymentMethod === 'cod' && (
            <div className="flex items-start gap-3 bg-amber-50 text-amber-800 rounded-xl p-4 mb-6 text-sm text-left">
              <Truck className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>Your package will be delivered within 3-5 business days. Payment will be collected upon delivery.</p>
            </div>
          )}
          <div className="flex flex-col gap-2.5">
            <Link
              href={`/orders?id=${orderId}`}
              className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery Status</span>
            </Link>
            <div className="flex gap-2">
              <Link href="/account" className="flex-1 btn-secondary py-2.5 text-xs text-center">My Account</Link>
              <Link href="/shop" className="flex-1 btn-secondary py-2.5 text-xs text-center">Continue Shopping</Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex flex-col items-center ${i > 0 ? 'ml-2' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step === s.id ? 'bg-rose-600 text-white' :
                  STEPS.findIndex(x => x.id === step) > i ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {STEPS.findIndex(x => x.id === step) > i ? '✓' : i + 1}
                </div>
                <span className="text-xs text-gray-500 mt-1 whitespace-nowrap">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-12 sm:w-20 mx-2 mb-4 ${
                  STEPS.findIndex(x => x.id === step) > i ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {/* Contact Info Step */}
              {step === 'info' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={e => setCustomerInfo(p => ({ ...p, name: e.target.value }))}
                      placeholder="Your full name"
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={e => setCustomerInfo(p => ({ ...p, email: e.target.value }))}
                      placeholder="your@email.com"
                      className={inputClass('email')}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={e => setCustomerInfo(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+92 300 0000000"
                      className={inputClass('phone')}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              )}

              {/* Shipping Step */}
              {step === 'shipping' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={e => setShippingAddress(p => ({ ...p, street: e.target.value }))}
                      placeholder="House/Flat number, Street name, Area"
                      className={inputClass('street')}
                    />
                    {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <select
                        value={shippingAddress.city}
                        onChange={e => setShippingAddress(p => ({ ...p, city: e.target.value }))}
                        className={inputClass('city')}
                      >
                        <option value="">Select city</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                      <select
                        value={shippingAddress.province}
                        onChange={e => setShippingAddress(p => ({ ...p, province: e.target.value }))}
                        className={inputClass('province')}
                      >
                        {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={e => setShippingAddress(p => ({ ...p, postalCode: e.target.value }))}
                      placeholder="e.g. 54000"
                      className={inputClass('postalCode')}
                    />
                    {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {step === 'payment' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map(method => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === method.id ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="text-rose-600 focus:ring-rose-400"
                        />
                        <method.icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{method.label}</span>
                            {method.isDemo && (
                              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">DEMO</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {paymentMethod !== 'cod' && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-xl text-sm text-amber-800">
                      ⚠️ This is a demo store. Only <strong>Cash on Delivery</strong> is functional. Other payment methods are displayed for demonstration purposes only.
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {step !== 'info' && (
                  <button
                    onClick={() => setStep(step === 'payment' ? 'shipping' : 'info')}
                    className="btn-secondary px-6 py-3 text-sm"
                  >
                    Back
                  </button>
                )}
                <button
                  id="checkout-next-btn"
                  onClick={handleNext}
                  className="flex-1 btn-primary py-3 text-sm flex items-center justify-center gap-2"
                >
                  {step === 'payment' ? 'Place Order' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary ({cart.length} items)</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {cart.map(item => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="48px" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.selectedColor} / {item.selectedSize}</p>
                      <p className="text-xs font-bold text-rose-600">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-gray-100 pt-2">
                  <span>Total</span>
                  <span className="text-rose-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
