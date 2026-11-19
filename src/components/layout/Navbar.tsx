'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Shield,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/lib/store-context';

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/categories', hasDropdown: true },
  { label: 'New Arrivals', href: '/category/new-arrivals' },
  { label: 'Sale', href: '/category/sale' },
  { label: 'Bridal', href: '/category/bridal-collection' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, state, dispatch } = useStore();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40">
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium border-b border-rose-800/40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="hidden md:flex items-center gap-4 text-rose-200">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> FREE Shipping Over PKR 3,000
              </span>
              <span>•</span>
              <span>Cash on Delivery Across Pakistan</span>
            </div>
            <div className="mx-auto md:mx-0 flex items-center gap-2">
              <span className="text-amber-300 font-bold">✨ SUMMER COUTURE DROP:</span>
              <span>Use Code <strong>WELCOME10</strong> for 10% Off</span>
            </div>
            <div className="hidden lg:flex items-center gap-4 text-rose-200">
              <Link href="/orders" className="hover:text-white transition-colors">
                Track Order
              </Link>
              <span>•</span>
              <Link href="/admin" className="hover:text-white flex items-center gap-1 transition-colors">
                <Shield className="w-3 h-3 text-rose-400" />
                <span>Admin Panel</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div
          className={`transition-all duration-300 ${
            isScrolled ? 'bg-white shadow-md py-2.5' : 'bg-white/95 backdrop-blur-md py-3.5'
          } border-b border-gray-100`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-md shadow-rose-600/20 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-serif font-bold text-gray-900 leading-none tracking-tight">
                    Zeen Apparels
                  </div>
                  <div className="text-[10px] text-rose-600 font-bold leading-none tracking-widest uppercase mt-0.5">
                    Pakistan
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-7">
                {NAV_LINKS.map((link) =>
                  link.hasDropdown ? (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                      onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                    >
                      <Link
                        href="/categories"
                        className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-rose-600 ${
                          pathname.startsWith('/categor') ? 'text-rose-600' : 'text-gray-700'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </Link>

                      <AnimatePresence>
                        {isCategoryDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 max-h-[420px] overflow-y-auto"
                          >
                            <Link
                              href="/categories"
                              className="flex items-center justify-between px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border-b border-gray-100 mb-1 transition-colors"
                            >
                              <span>Explore All Categories</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>

                            {state.categories.map((cat) => (
                              <Link
                                key={cat.id}
                                href={`/category/${cat.slug}`}
                                className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              >
                                {cat.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`text-sm font-semibold transition-colors hover:text-rose-600 ${
                        pathname === link.href ? 'text-rose-600' : 'text-gray-700'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>

              {/* Right Action Icons */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Search */}
                <button
                  id="navbar-search-btn"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-700 hover:text-rose-600"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  id="navbar-wishlist-btn"
                  className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-700 hover:text-rose-600"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {state.wishlist.length > 0 && (
                    <span className="absolute 1.5 top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {state.wishlist.length}
                    </span>
                  )}
                </Link>

                {/* Cart Drawer or Direct Link */}
                <button
                  id="navbar-cart-btn"
                  onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                  className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-700 hover:text-rose-600"
                  aria-label="Cart Drawer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute 1.5 top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </button>

                {/* Account */}
                <Link
                  href="/account"
                  id="navbar-account-btn"
                  className="hidden sm:flex p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-700 hover:text-rose-600"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                  id="mobile-menu-btn"
                  className="lg:hidden p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search lawn suits, bridal lehengas, kurtis, fabrics..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-900 text-sm font-medium"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-2xl transition-colors shadow-md"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-3 rounded-2xl hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>

              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-400 font-medium">Popular:</span>
                {[
                  'Lawn 3-Piece',
                  'Bridal Lehenga',
                  'Luxury Pret',
                  'Velvet',
                  'Party Wear',
                  'Kurti',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setSearchQuery(q);
                      router.push(`/shop?search=${encodeURIComponent(q)}`);
                      setIsSearchOpen(false);
                    }}
                    className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-medium hover:bg-rose-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-0 z-50 bg-white pt-20 overflow-y-auto lg:hidden flex flex-col justify-between"
          >
            <div className="px-6 py-4 space-y-2">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-2">
                <span className="font-serif font-bold text-lg text-gray-900">Store Navigation</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block py-2.5 text-base font-medium text-gray-800 border-b border-gray-100 hover:text-rose-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Fashion Categories
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {state.categories.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="block py-1.5 text-xs text-gray-600 hover:text-rose-600 truncate transition-colors"
                    >
                      • {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-neutral-50 border-t border-gray-100 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  className="py-3 px-4 bg-rose-600 text-white rounded-xl text-xs font-semibold text-center shadow-md"
                >
                  Cart ({cartCount})
                </Link>
                <Link
                  href="/account"
                  className="py-3 px-4 bg-neutral-900 text-white rounded-xl text-xs font-semibold text-center"
                >
                  My Account
                </Link>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                <Link href="/orders" className="hover:text-rose-600">
                  Track Order
                </Link>
                <span>•</span>
                <Link href="/contact" className="hover:text-rose-600">
                  Contact Support
                </Link>
                <span>•</span>
                <Link href="/admin" className="text-rose-700 font-bold hover:underline">
                  Admin Panel
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-[96px] sm:h-[104px]" />
    </>
  );
}
