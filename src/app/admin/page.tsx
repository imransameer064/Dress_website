'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Layers,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Eye,
  X,
  Save,
  ArrowUpRight,
  Shield,
  Truck,
  Filter,
} from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { Product, Category, Order, formatPrice } from '@/lib/data';

export default function AdminDashboardPage() {
  const { state, dispatch } = useStore();
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'inventory'>('products');

  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Success Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Metrics
  const totalRevenue = state.orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const lowStockCount = state.products.filter((p) => p.stock < 15).length;

  // Product Form Initial Data
  const defaultProductData: Partial<Product> = {
    id: '',
    name: '',
    description: '',
    price: 4500,
    originalPrice: 6000,
    category: state.categories[0]?.slug || 'lawn-collection',
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80'],
    colors: ['Powder Blue', 'Rose Pink', 'Emerald Green'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 25,
    rating: 4.8,
    reviews: [],
    tags: ['pakistani', 'lawn', 'new'],
    isNew: true,
    isFeatured: true,
    isSale: false,
    discount: 0,
    fabric: 'Premium Lawn',
    occasion: 'Casual / Semi-Formal',
    brand: 'Elegance',
    createdAt: '2026-01-01',
  };

  const [productFormData, setProductFormData] = useState<Partial<Product>>(defaultProductData);

  // Category Form Initial Data
  const defaultCategoryData: Partial<Category> = {
    id: '',
    name: '',
    slug: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
  };

  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>(defaultCategoryData);

  // Open Add Product Modal
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      ...defaultProductData,
      id: `prod_${Date.now()}`,
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductFormData({ ...prod });
    setIsProductModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name || !productFormData.category) return;

    if (editingProduct) {
      dispatch({
        type: 'UPDATE_PRODUCT',
        payload: productFormData as Product,
      });
      showToast(`Product "${productFormData.name}" updated successfully!`);
    } else {
      dispatch({
        type: 'ADD_PRODUCT',
        payload: productFormData as Product,
      });
      showToast(`New product "${productFormData.name}" added successfully!`);
    }
    setIsProductModalOpen(false);
  };

  // Delete Product
  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
      showToast(`Product "${name}" deleted.`);
    }
  };

  // Open Add Category Modal
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      ...defaultCategoryData,
      id: `cat_${Date.now()}`,
    });
    setIsCategoryModalOpen(true);
  };

  // Open Edit Category Modal
  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryFormData({ ...cat });
    setIsCategoryModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name) return;

    const slug =
      categoryFormData.slug ||
      categoryFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const finalizedCat: Category = {
      ...(categoryFormData as Category),
      slug,
    };

    if (editingCategory) {
      dispatch({ type: 'UPDATE_CATEGORY', payload: finalizedCat });
      showToast(`Category "${finalizedCat.name}" updated!`);
    } else {
      dispatch({ type: 'ADD_CATEGORY', payload: finalizedCat });
      showToast(`Category "${finalizedCat.name}" created!`);
    }
    setIsCategoryModalOpen(false);
  };

  // Delete Category
  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
      showToast(`Category "${name}" deleted.`);
    }
  };

  // Quick adjust stock
  const handleAdjustStock = (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    dispatch({
      type: 'UPDATE_PRODUCT',
      payload: { ...product, stock: newStock },
    });
  };

  // Filtered Products
  const filteredProducts = state.products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory =
      productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = state.orders.filter((o) => {
    return orderStatusFilter === 'all' || o.status === orderStatusFilter;
  });

  return (
    <div className="min-h-screen bg-neutral-100/70 pb-20 pt-8 sm:pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                Admin Control Center
              </span>
              <span className="text-xs text-gray-400">• LocalStorage Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
              E-Commerce Management Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Full CRUD management for Pakistani clothing products, collections, inventory & customer orders
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Reset store back to default demo data? All test additions will be reset.')) {
                  dispatch({ type: 'RESET_DEMO_DATA' });
                  showToast('Store reset to default sample products and categories!');
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span>Reset Demo Data</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
            >
              <span>View Live Store</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-medium border border-gray-700"
            >
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Total Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</div>
            <p className="text-[11px] text-gray-400 mt-1">Across all confirmed customer orders</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Total Products</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{state.products.length}</div>
            <p className="text-[11px] text-gray-400 mt-1">Active items in catalog</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Total Orders</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{state.orders.length}</div>
            <p className="text-[11px] text-gray-400 mt-1">Customer checkouts recorded</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Stock Alerts</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-600">{lowStockCount}</div>
            <p className="text-[11px] text-gray-400 mt-1">Items below 15 units in warehouse</p>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
          {[
            { id: 'products', label: 'Products (CRUD)', count: state.products.length, icon: Package },
            { id: 'categories', label: 'Categories (CRUD)', count: state.categories.length, icon: Layers },
            { id: 'orders', label: 'Orders & Status', count: state.orders.length, icon: ShoppingBag },
            { id: 'inventory', label: 'Inventory Control', count: lowStockCount, icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
            {/* Products Toolbar */}
            <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1 max-w-xl">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products by title or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:border-rose-500"
                >
                  <option value="all">All Categories</option>
                  {state.categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleOpenAddProduct}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dress</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (PKR)</th>
                    <th className="py-3 px-4 text-center">Stock</th>
                    <th className="py-3 px-4 text-center">Rating</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={p.images[0] || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80'}
                              alt={p.name}
                              fill
                              sizes="60px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 block line-clamp-1">{p.name}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {p.isNew && (
                                <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  NEW
                                </span>
                              )}
                              {p.isFeatured && (
                                <span className="bg-rose-50 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  FEATURED
                                </span>
                              )}
                              {p.isSale && (
                                <span className="bg-red-50 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  SALE
                                </span>
                              )}
                              <span className="text-[10px] text-gray-400">{p.fabric}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-gray-900">
                        {formatPrice(p.price)}
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="block text-[11px] text-gray-400 line-through font-normal">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                            p.stock < 10
                              ? 'bg-red-100 text-red-800'
                              : p.stock < 20
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center text-gray-700 font-medium">
                        ★ {p.rating}
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/product/${p.id}`}
                            target="_blank"
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Preview product"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm">No products found matching &quot;{productSearch}&quot;</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CATEGORIES MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden p-6">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Clothing Categories</h3>
                <p className="text-xs text-gray-500">Manage all store collections and fashion departments</p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddCategory}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.categories.map((c) => {
                const count = state.products.filter((p) => p.category === c.slug).length;

                return (
                  <div
                    key={c.id}
                    className="flex flex-col justify-between p-4 rounded-2xl border border-gray-200 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all"
                  >
                    <div className="flex gap-4 items-center mb-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={c.image || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80'}
                          alt={c.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{c.name}</h4>
                        <span className="text-[11px] font-mono text-gray-400 block">{c.slug}</span>
                        <span className="text-xs font-semibold text-rose-600 mt-1 inline-block">
                          {count} {count === 1 ? 'Product' : 'Products'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-4 font-light">
                      {c.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-200/70 pt-3">
                      <Link
                        href={`/category/${c.slug}`}
                        target="_blank"
                        className="text-xs font-semibold text-gray-600 hover:text-gray-900"
                      >
                        Preview &rarr;
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditCategory(c)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit category"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(c.id, c.name)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ORDERS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-100 gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Customer Orders & Fulfillment</h3>
                <p className="text-xs text-gray-500">
                  Update statuses in real-time. Delivery stages sync immediately across user tracking pages.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-rose-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl border border-gray-200 bg-neutral-50/40 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base text-gray-900">{order.id}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-PK')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Customer: <strong>{order.customerInfo.name}</strong> • Phone:{' '}
                        <strong>{order.customerInfo.phone}</strong> • City:{' '}
                        <strong>{order.shippingAddress.city}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as Order['status'];
                            dispatch({
                              type: 'UPDATE_ORDER_STATUS',
                              payload: { orderId: order.id, status: newStatus },
                            });
                            showToast(`Order ${order.id} status changed to "${newStatus}"!`);
                          }}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                            order.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : order.status === 'shipped'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : order.status === 'confirmed'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : order.status === 'cancelled'
                              ? 'bg-red-50 text-red-800 border-red-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete order ${order.id}?`)) {
                            dispatch({ type: 'DELETE_ORDER', payload: order.id });
                            showToast(`Order ${order.id} deleted.`);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200/60 pt-3 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
                    <div>
                      <span>Items: </span>
                      <strong className="text-gray-900">
                        {order.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
                      </strong>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>Method: <strong>{order.paymentMethod}</strong></span>
                      <span className="text-base font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm">No orders matching &quot;{orderStatusFilter}&quot;</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: INVENTORY CONTROL */}
        {/* ========================================================= */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden p-6">
            <div className="pb-6 mb-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Stock & Inventory Quick-Adjust</h3>
              <p className="text-xs text-gray-500">
                Instantly increment or decrement stock counts directly into local database
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.products.map((p) => {
                const isLow = p.stock < 15;
                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isLow ? 'bg-amber-50/40 border-amber-200' : 'bg-neutral-50/50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={p.images[0] || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80'}
                          alt={p.name}
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs text-gray-900 truncate">{p.name}</h4>
                        <span className="text-[11px] text-gray-400 block">{p.category}</span>
                        <span
                          className={`text-xs font-bold ${
                            isLow ? 'text-amber-700' : 'text-emerald-700'
                          }`}
                        >
                          {p.stock} units in stock
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(p, -5)}
                        className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded text-xs font-bold text-gray-700 shadow-sm"
                        title="-5 units"
                      >
                        -5
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(p, -1)}
                        className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded text-xs font-bold text-gray-700 shadow-sm"
                        title="-1 unit"
                      >
                        -1
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(p, +1)}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded text-xs font-bold text-rose-700 shadow-sm"
                        title="+1 unit"
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(p, +5)}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded text-xs font-bold text-rose-700 shadow-sm"
                        title="+5 units"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PRODUCT ADD/EDIT MODAL */}
        {/* ========================================================= */}
        <AnimatePresence>
          {isProductModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl my-8 overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-xl font-serif font-bold text-gray-900">
                    {editingProduct ? 'Edit Clothing Product' : 'Add New Designer Dress'}
                  </h3>
                  <button
                    onClick={() => setIsProductModalOpen(false)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Product Title / Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={productFormData.name || ''}
                        onChange={(e) =>
                          setProductFormData({ ...productFormData, name: e.target.value })
                        }
                        placeholder="e.g. Maria.B Luxury Embroidered Organza Suit"
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        required
                        value={productFormData.category || ''}
                        onChange={(e) =>
                          setProductFormData({ ...productFormData, category: e.target.value })
                        }
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 bg-white"
                      >
                        {state.categories.map((c) => (
                          <option key={c.id} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Fabric Type
                      </label>
                      <input
                        type="text"
                        value={productFormData.fabric || ''}
                        onChange={(e) =>
                          setProductFormData({ ...productFormData, fabric: e.target.value })
                        }
                        placeholder="e.g. Pure Lawn / Chiffon / Velvet"
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Price in PKR *
                      </label>
                      <input
                        type="number"
                        required
                        min="100"
                        value={productFormData.price || ''}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Original Price (for discount)
                      </label>
                      <input
                        type="number"
                        min="100"
                        value={productFormData.originalPrice || ''}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            originalPrice: Number(e.target.value),
                          })
                        }
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={productFormData.stock ?? 20}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            stock: Number(e.target.value),
                          })
                        }
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Occasion
                      </label>
                      <input
                        type="text"
                        value={productFormData.occasion || ''}
                        onChange={(e) =>
                          setProductFormData({ ...productFormData, occasion: e.target.value })
                        }
                        placeholder="e.g. Wedding / Casual / Formal"
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Primary Image URL
                      </label>
                      <input
                        type="url"
                        required
                        value={productFormData.images?.[0] || ''}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            images: [e.target.value, ...(productFormData.images?.slice(1) || [])],
                          })
                        }
                        placeholder="https://images.unsplash.com/..."
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 font-mono text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Detailed Description
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={productFormData.description || ''}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the fabric, embroidery work, dupatta, and trouser..."
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 resize-none"
                      />
                    </div>

                    {/* Flags */}
                    <div className="sm:col-span-2 flex flex-wrap gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(productFormData.isNew)}
                          onChange={(e) =>
                            setProductFormData({
                              ...productFormData,
                              isNew: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-rose-600 rounded"
                        />
                        <span className="text-xs font-semibold text-gray-700">New Arrival</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(productFormData.isFeatured)}
                          onChange={(e) =>
                            setProductFormData({
                              ...productFormData,
                              isFeatured: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-rose-600 rounded"
                        />
                        <span className="text-xs font-semibold text-gray-700">Featured on Home</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(productFormData.isSale)}
                          onChange={(e) =>
                            setProductFormData({
                              ...productFormData,
                              isSale: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-rose-600 rounded"
                        />
                        <span className="text-xs font-semibold text-gray-700">Sale Item</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* CATEGORY ADD/EDIT MODAL */}
        {/* ========================================================= */}
        <AnimatePresence>
          {isCategoryModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg my-8 overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-xl font-serif font-bold text-gray-900">
                    {editingCategory ? 'Edit Category' : 'Create New Fashion Category'}
                  </h3>
                  <button
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryFormData.name || ''}
                      onChange={(e) =>
                        setCategoryFormData({ ...categoryFormData, name: e.target.value })
                      }
                      placeholder="e.g. Chiffon Collection"
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Category Slug (URL Path)
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.slug || ''}
                      onChange={(e) =>
                        setCategoryFormData({ ...categoryFormData, slug: e.target.value })
                      }
                      placeholder="e.g. chiffon-collection"
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Banner Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={categoryFormData.image || ''}
                      onChange={(e) =>
                        setCategoryFormData({ ...categoryFormData, image: e.target.value })
                      }
                      placeholder="https://images.unsplash.com/..."
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={categoryFormData.description || ''}
                      onChange={(e) =>
                        setCategoryFormData({
                          ...categoryFormData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Briefly describe this collection..."
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 resize-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
