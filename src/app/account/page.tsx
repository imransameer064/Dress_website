'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  ShoppingBag,
  Heart,
  Package,
  MapPin,
  Phone,
  Mail,
  Shield,
  Edit2,
  Check,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { formatPrice } from '@/lib/data';

export default function AccountPage() {
  const { state, dispatch, cartCount } = useStore();
  const user = state.user;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Ayesha Khan',
    email: user?.email || 'ayesha.khan@example.com',
    phone: user?.phone || '03001234567',
    address: user?.address || 'House 42, Street 8, F-7/2',
    city: user?.city || 'Islamabad',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'SET_USER',
      payload: {
        id: user?.id || 'u001',
        ...formData,
      },
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const recentOrders = state.orders.slice(0, 3);

  return (
    <div className="min-h-screen bg-neutral-50/50 py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-rose-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">My Account</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
                Customer Account
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your profile, shipping addresses, and review your order status
              </p>
            </div>

            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm self-start sm:self-auto"
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>Go to Admin Panel</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">{state.orders.length}</span>
              <p className="text-xs text-gray-500 font-medium">Total Orders</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">{state.wishlist.length}</span>
              <p className="text-xs text-gray-500 font-medium">Wishlist Items</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">{cartCount}</span>
              <p className="text-xs text-gray-500 font-medium">Items in Cart</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-0.5">
                Verified
              </span>
              <p className="text-xs text-gray-500 font-medium">VIP Member</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Profile Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-rose-600 text-white font-serif font-bold text-xl flex items-center justify-center shadow-md shadow-rose-500/20">
                  {formData.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{formData.name}</h2>
                  <span className="text-xs text-rose-600 font-medium">Valued Customer</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel' : 'Edit Info'}</span>
              </button>
            </div>

            {savedSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Profile information updated successfully!</span>
              </motion.div>
            )}

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number (PK)</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block text-xs text-gray-400">Email Address</span>
                    <span className="font-medium text-gray-900">{formData.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block text-xs text-gray-400">Phone Number</span>
                    <span className="font-medium text-gray-900">{formData.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block text-xs text-gray-400">Default Shipping Address</span>
                    <span className="font-medium text-gray-900">
                      {formData.address}, {formData.city}, Pakistan
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Orders Overview */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                <p className="text-xs text-gray-500">Track and view your recent Pakistani dress purchases</p>
              </div>

              <Link
                href="/orders"
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                <span>View All ({state.orders.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-sm">You haven&apos;t placed any orders yet.</p>
                <Link
                  href="/shop"
                  className="mt-4 inline-block px-5 py-2 bg-rose-600 text-white rounded-full text-xs font-semibold hover:bg-rose-700"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const statusColors: Record<string, string> = {
                    pending: 'bg-amber-100 text-amber-800 border-amber-200',
                    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
                    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
                    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    cancelled: 'bg-red-100 text-red-800 border-red-200',
                  };

                  return (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl border border-gray-100 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-gray-900">{order.id}</span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              statusColors[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-PK', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600 border-t border-gray-200/60 pt-3">
                        <span>
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'} •{' '}
                          {order.paymentMethod}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900 text-sm">
                            {formatPrice(order.total)}
                          </span>
                          <Link
                            href={`/orders?id=${order.id}`}
                            className="text-rose-600 hover:text-rose-700 font-semibold"
                          >
                            Track & Details &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
