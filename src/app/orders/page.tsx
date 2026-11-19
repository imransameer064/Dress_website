'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Search,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Printer,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { formatPrice } from '@/lib/data';

function OrdersContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id') || '';
  const { state } = useStore();

  const [searchTerm, setSearchTerm] = useState(queryId);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(queryId || null);

  useEffect(() => {
    if (queryId) {
      setSearchTerm(queryId);
      setExpandedOrderId(queryId);
    }
  }, [queryId]);

  const filteredOrders = state.orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.phone.includes(searchTerm);

    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">Pending Confirmation</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">Order Confirmed</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800 border border-purple-200">In Transit (Shipped)</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border border-red-200">Cancelled</span>;
      default:
        return null;
    }
  };

  const getTrackingSteps = (status: string) => {
    const steps = [
      { key: 'pending', label: 'Order Placed' },
      { key: 'confirmed', label: 'Processing' },
      { key: 'shipped', label: 'Dispatched (TCS)' },
      { key: 'delivered', label: 'Delivered' },
    ];

    const currentIdx =
      status === 'delivered' ? 3 : status === 'shipped' ? 2 : status === 'confirmed' ? 1 : 0;

    return { steps, currentIdx };
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-rose-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/account" className="hover:text-rose-600 transition-colors">
              Account
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Order History & Tracking</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
                Order History & Live Tracking
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Real-time tracking and delivery updates across Pakistan
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 px-5 py-2.5 rounded-full transition-colors self-start sm:self-auto"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by Order ID (e.g. ORD-98241) or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'confirmed', 'shipped', 'delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                    selectedStatus === st
                      ? 'bg-rose-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Orders Found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              We couldn&apos;t find any orders matching your criteria. Place a new order with Cash on Delivery!
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 bg-rose-600 text-white rounded-full text-xs font-semibold hover:bg-rose-700 shadow-md"
            >
              Shop New Arrivals
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const { steps, currentIdx } = getTrackingSteps(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="p-5 sm:p-6 cursor-pointer hover:bg-neutral-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-mono font-bold text-xs">
                        #
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-gray-900">{order.id}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <span className="text-xs text-gray-400 mt-0.5 block">
                          Placed on{' '}
                          {new Date(order.createdAt).toLocaleDateString('en-PK', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-left sm:text-right">
                        <span className="block text-xs text-gray-400">Total Amount</span>
                        <span className="text-base font-bold text-gray-900">
                          {formatPrice(order.total)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-100 p-5 sm:p-8 bg-neutral-50/30"
                      >
                        {/* Live Delivery Progress Tracker */}
                        <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-100">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">
                            Live Delivery Status (Nationwide Logistics)
                          </h4>

                          <div className="relative flex items-center justify-between">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 w-full z-0" />
                            <div
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-rose-600 transition-all duration-500 z-0"
                              style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
                            />

                            {steps.map((st, idx) => {
                              const isCompleted = idx <= currentIdx;
                              return (
                                <div key={st.key} className="relative z-10 flex flex-col items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                                      isCompleted
                                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                                        : 'bg-gray-100 text-gray-400 border-2 border-white'
                                    }`}
                                  >
                                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                                  </div>
                                  <span
                                    className={`text-[11px] font-semibold mt-2 text-center ${
                                      isCompleted ? 'text-gray-900' : 'text-gray-400'
                                    }`}
                                  >
                                    {st.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                          {/* Items List */}
                          <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                              Order Items ({order.items.length})
                            </h4>
                            <div className="space-y-3">
                              {order.items.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100"
                                >
                                  <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    <Image
                                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80'}
                                      alt={item.product.name}
                                      fill
                                      sizes="80px"
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-xs font-semibold text-gray-900 truncate">
                                      {item.product.name}
                                    </h5>
                                    <p className="text-[11px] text-gray-500">
                                      {item.selectedColor} • {item.selectedSize} • Qty: {item.quantity}
                                    </p>
                                    <span className="text-xs font-bold text-rose-600">
                                      {formatPrice(item.product.price * item.quantity)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping and Payment Info */}
                          <div className="space-y-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-100">
                              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Delivery Address
                              </h4>
                              <p className="text-xs font-semibold text-gray-900">
                                {order.customerInfo.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                                {order.shippingAddress.province}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Phone: {order.customerInfo.phone}
                              </p>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-100">
                              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Payment Method
                              </h4>
                              <p className="text-xs font-medium text-gray-800">
                                {order.paymentMethod}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-1">
                                All payments verified and recorded in Pakistani Rupees (PKR)
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white border border-gray-200 px-4 py-2 rounded-xl transition-colors shadow-sm"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print Receipt</span>
                          </button>

                          <a
                            href={`https://wa.me/923001234567?text=${encodeURIComponent(
                              `Hi Elegance Pakistan! I would like to inquire about my Order #${order.id}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Inquire via WhatsApp</span>
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-12 text-center text-gray-500">Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
