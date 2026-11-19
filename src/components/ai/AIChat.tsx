'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  Loader2,
  Sparkles,
  Minimize2,
  Maximize2,
  Trash2,
  ShoppingBag,
  ExternalLink,
  Check,
  ChevronDown,
  CreditCard,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { Product, formatPrice } from '@/lib/data';
import { parseShoppingQuery, searchCatalog } from '@/lib/search-engine';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  productIds?: string[];
  quickReplies?: string[];
  isCartSummary?: boolean;
  timestamp: string;
}

const INITIAL_WELCOME_TEXT = `Hello! Welcome to Elegance. I'm your AI Shopping Assistant. I can help you find your favorite outfits, explore collections, compare prices, and shop for your perfect look. What are you looking for today?`;

const DEFAULT_QUICK_ACTIONS = [
  '👗 Find a Product',
  '🗂️ Shop by Category',
  '💰 Find Products by Budget',
  '👰 Explore Bridal Collection',
  '🔥 View Sale Products',
];

export default function AIChat() {
  const router = useRouter();
  const { state, dispatch, cartCount, cartTotal } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [cardSelections, setCardSelections] = useState<Record<string, { color: string; size: string }>>({});
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);
  const [visibleProductCounts, setVisibleProductCounts] = useState<Record<string, number>>({});

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize messages on client mount safely to prevent Next.js prerender errors
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: INITIAL_WELCOME_TEXT,
          quickReplies: DEFAULT_QUICK_ACTIONS,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [messages.length]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // Clear chat
  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: INITIAL_WELCOME_TEXT,
        quickReplies: DEFAULT_QUICK_ACTIONS,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Get selection for a product card
  const getCardSelection = (product: Product) => {
    const existing = cardSelections[product.id];
    if (existing) return existing;
    return {
      color: product.colors[0] || 'Default',
      size: product.sizes[0] || 'Standard',
    };
  };

  const updateCardSelection = (productId: string, field: 'color' | 'size', value: string) => {
    setCardSelections(prev => {
      const current = prev[productId] || { color: '', size: '' };
      return {
        ...prev,
        [productId]: {
          ...current,
          [field]: value,
        },
      };
    });
  };

  // Add product to actual cart
  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const selection = getCardSelection(product);
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product,
        color: selection.color || product.colors[0] || 'Default',
        size: selection.size || product.sizes[0] || 'Standard',
        quantity: 1,
      },
    });

    setAddedSuccessId(product.id);
    setTimeout(() => setAddedSuccessId(null), 2000);
  };

  // Buy Now: Add to cart & route to /checkout
  const handleBuyNow = (product: Product, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleAddToCart(product);
    setIsOpen(false);
    router.push('/checkout');
  };

  // View Product details
  const handleViewProduct = (productId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(false);
    router.push(`/product/${productId}`);
  };

  // Send message to assistant
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Prepare catalog & cart context to send to API
    const cartContext = {
      itemCount: cartCount,
      total: cartTotal,
      items: state.cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        color: item.selectedColor,
        size: item.selectedSize,
      })),
    };

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          catalog: state.products,
          categories: state.categories,
          cartContext,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      // Handle server action if any
      if (data.action === 'CLEAR_CART') {
        dispatch({ type: 'CLEAR_CART' });
      } else if (data.action === 'ADD_TO_CART' && data.actionPayload?.productId) {
        const prod = state.products.find(p => p.id === data.actionPayload.productId);
        if (prod) {
          dispatch({
            type: 'ADD_TO_CART',
            payload: {
              product: prod,
              color: data.actionPayload.color || prod.colors[0],
              size: data.actionPayload.size || prod.sizes[0],
              quantity: data.actionPayload.quantity || 1,
            },
          });
        }
      } else if (data.action === 'CHECKOUT') {
        setTimeout(() => {
          setIsOpen(false);
          router.push('/checkout');
        }, 1200);
      }

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Here is what I found for you!',
        productIds: data.productIds || [],
        quickReplies: data.quickReplies || DEFAULT_QUICK_ACTIONS,
        isCartSummary: data.action === 'VIEW_CART',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.warn('API call encountered an issue, running client-side intelligent engine fallback:', err);
      // Client-side fallback so chatbot NEVER breaks
      const parsed = parseShoppingQuery(query, state.categories);
      const searchRes = searchCatalog(state.products, parsed, state.categories);

      let fallbackReply = '';
      let isCart = false;

      if (parsed.intent === 'VIEW_CART') {
        isCart = true;
        fallbackReply = cartCount === 0
          ? `Your shopping bag is currently empty! 🛍️ Explore our lawn and bridal collections below:`
          : `You have **${cartCount} items** in your shopping cart (Total: ${formatPrice(cartTotal)}).`;
      } else if (parsed.intent === 'CHECKOUT') {
        if (cartCount > 0) {
          fallbackReply = `Redirecting you to checkout... 🚚`;
          setTimeout(() => {
            setIsOpen(false);
            router.push('/checkout');
          }, 800);
        } else {
          fallbackReply = `Your cart is empty! Please choose an outfit first. 🌸`;
        }
      } else if (searchRes.products.length > 0) {
        fallbackReply = `Here are matching options from our catalog for "${query}":`;
      } else {
        fallbackReply = `I couldn't find an exact match for "${query}", but here are our most popular dresses you might love:`;
      }

      const fallbackMsg: ChatMessage = {
        id: `fallback-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        productIds: (searchRes.products.length > 0 ? searchRes.products : state.products.slice(0, 3)).map(p => p.id),
        quickReplies: DEFAULT_QUICK_ACTIONS,
        isCartSummary: isCart,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper to load more products for a specific message
  const getVisibleCount = (msgId: string, total: number) => {
    return visibleProductCounts[msgId] || Math.min(3, total);
  };

  const showMoreProducts = (msgId: string, total: number) => {
    setVisibleProductCounts(prev => ({
      ...prev,
      [msgId]: Math.min(total, (prev[msgId] || 3) + 3),
    }));
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-24 right-6 z-40 flex items-center gap-3"
          >
            {/* Quick helper pill */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full shadow-lg border border-rose-100 text-xs font-medium text-gray-700 cursor-pointer hover:border-rose-300 transition-colors"
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-600 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Ask AI Shopping Assistant</span>
            </motion.div>

            <motion.button
              id="ai-chat-toggle-btn"
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 via-rose-700 to-rose-800 text-white shadow-xl shadow-rose-900/20 flex items-center justify-center border-2 border-white focus:outline-none focus:ring-4 focus:ring-rose-200"
              aria-label="Open AI Shopping Assistant"
            >
              <Bot className="w-6 h-6" />
              {/* Online pulse indicator */}
              <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className={`fixed z-50 bg-white shadow-2xl flex flex-col overflow-hidden border border-rose-100 ${
              isExpanded
                ? 'inset-4 md:inset-12 rounded-3xl max-w-4xl mx-auto'
                : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] rounded-2xl max-h-[90vh]'
            }`}
            style={{
              height: isMinimized ? '64px' : isExpanded ? 'calc(100vh - 6rem)' : '650px',
              transition: 'height 0.25s ease, width 0.25s ease',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-rose-700 via-rose-800 to-rose-900 text-white flex-shrink-0 select-none shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-rose-100" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-rose-900" />
                </div>
                <div>
                  <div className="font-semibold text-sm tracking-wide flex items-center gap-1.5">
                    <span>Elegance AI Assistant</span>
                    <span className="text-[10px] bg-rose-500/50 text-rose-100 px-1.5 py-0.5 rounded font-normal">
                      Smart Shopping
                    </span>
                  </div>
                  <div className="text-rose-200 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span>Online & Ready to Help</span>
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Clear chat history"
                  className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-white/15 transition-colors"
                  aria-label="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Restore size' : 'Expand window'}
                  className="hidden sm:block p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-white/15 transition-colors"
                  aria-label={isExpanded ? 'Restore size' : 'Expand window'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Expand chat' : 'Minimize chat'}
                  className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-white/15 transition-colors"
                  aria-label={isMinimized ? 'Expand' : 'Minimize'}
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
                </button>

                <button
                  id="ai-chat-close-btn"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-white/15 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            {!isMinimized && (
              <>
                {/* Scrollable Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`flex items-start gap-2 max-w-[90%] sm:max-w-[85%]`}>
                        {msg.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-600 to-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm text-white">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                            msg.role === 'user'
                              ? 'bg-rose-700 text-white rounded-br-xs'
                              : 'bg-white text-gray-800 border border-gray-100 rounded-bl-xs'
                          }`}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: msg.content
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/\n/g, '<br>'),
                            }}
                          />
                        </div>
                      </div>

                      {/* Cart Summary Card if requested */}
                      {msg.isCartSummary && (
                        <div className="w-full mt-3 bg-white rounded-xl p-3.5 border border-rose-100 shadow-sm">
                          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <span className="font-semibold text-xs text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                              <ShoppingBag className="w-3.5 h-3.5 text-rose-600" />
                              Shopping Bag Summary
                            </span>
                            <span className="text-xs font-bold text-rose-700">
                              {cartCount} {cartCount === 1 ? 'item' : 'items'}
                            </span>
                          </div>

                          {state.cart.length > 0 ? (
                            <div className="divide-y divide-gray-50 my-2 max-h-48 overflow-y-auto">
                              {state.cart.map((cItem, idx) => (
                                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    {cItem.product.images[0] && (
                                      <div className="relative w-8 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                        <Image
                                          src={cItem.product.images[0]}
                                          alt={cItem.product.name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-medium text-gray-900 line-clamp-1">{cItem.product.name}</div>
                                      <div className="text-gray-500 text-[11px]">
                                        {cItem.selectedColor} • {cItem.selectedSize} • Qty: {cItem.quantity}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="font-semibold text-gray-900">
                                    {formatPrice(cItem.product.price * cItem.quantity)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-4 text-center text-xs text-gray-500">
                              No items in your bag yet.
                            </div>
                          )}

                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                            <div>
                              <div className="text-[11px] text-gray-500">Subtotal:</div>
                              <div className="font-bold text-sm text-gray-900">{formatPrice(cartTotal)}</div>
                            </div>
                            <button
                              onClick={() => {
                                setIsOpen(false);
                                router.push('/checkout');
                              }}
                              disabled={cartCount === 0}
                              className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <span>Checkout</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Matching Product Cards Stack */}
                      {msg.productIds && msg.productIds.length > 0 && (
                        <div className="w-full mt-3 space-y-3 pl-8">
                          {(() => {
                            // Lookup products from current store state
                            const matchedProds = msg.productIds
                              .map(id => state.products.find(p => p.id === id))
                              .filter((p): p is Product => Boolean(p));

                            const totalMatched = matchedProds.length;
                            const visibleCount = getVisibleCount(msg.id, totalMatched);
                            const visibleProds = matchedProds.slice(0, visibleCount);

                            return (
                              <>
                                <div className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider flex items-center justify-between">
                                  <span>Recommended Products ({totalMatched})</span>
                                  {totalMatched > visibleCount && (
                                    <span className="text-gray-500 font-normal">
                                      Showing 1-{visibleCount} of {totalMatched}
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                  {visibleProds.map(product => {
                                    const selection = getCardSelection(product);
                                    const isAdded = addedSuccessId === product.id;
                                    const hasDiscount = product.originalPrice && product.originalPrice > product.price;

                                    return (
                                      <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                      >
                                        <div className="flex p-3 gap-3">
                                          {/* Thumbnail with Sale Badge */}
                                          <div
                                            className="relative w-24 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer group"
                                            onClick={() => handleViewProduct(product.id)}
                                          >
                                            <Image
                                              src={product.images[0] || '/one.jpeg'}
                                              alt={product.name}
                                              fill
                                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                                              sizes="100px"
                                            />
                                            {hasDiscount && (
                                              <span className="absolute top-1 left-1 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                                {product.discount ? `-${product.discount}%` : 'SALE'}
                                              </span>
                                            )}
                                            {product.isNew && (
                                              <span className="absolute bottom-1 left-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                                NEW
                                              </span>
                                            )}
                                          </div>

                                          {/* Product Info & Selectors */}
                                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                              {/* Category & Rating */}
                                              <div className="flex items-center justify-between gap-1 text-[11px] text-gray-500 mb-0.5">
                                                <span className="truncate text-rose-700 font-medium">
                                                  {product.brand || 'Elegance'}
                                                </span>
                                                <span className="flex items-center gap-0.5 text-amber-600 font-semibold flex-shrink-0">
                                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                                  {product.rating}
                                                </span>
                                              </div>

                                              {/* Product Name */}
                                              <h4
                                                onClick={() => handleViewProduct(product.id)}
                                                className="text-xs font-semibold text-gray-900 line-clamp-1 hover:text-rose-700 cursor-pointer"
                                                title={product.name}
                                              >
                                                {product.name}
                                              </h4>

                                              {/* Price in PKR */}
                                              <div className="flex items-baseline gap-1.5 mt-1">
                                                <span className="text-sm font-bold text-rose-700">
                                                  {formatPrice(product.price)}
                                                </span>
                                                {hasDiscount && (
                                                  <span className="text-[11px] text-gray-400 line-through">
                                                    {formatPrice(product.originalPrice!)}
                                                  </span>
                                                )}
                                              </div>

                                              {/* Fabric & Stock Badge */}
                                              <div className="flex items-center gap-2 mt-1 text-[10px]">
                                                {product.fabric && (
                                                  <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                                    {product.fabric}
                                                  </span>
                                                )}
                                                <span
                                                  className={`font-medium ${
                                                    product.stock > 10
                                                      ? 'text-emerald-700'
                                                      : product.stock > 0
                                                      ? 'text-amber-700'
                                                      : 'text-red-600'
                                                  }`}
                                                >
                                                  {product.stock > 10
                                                    ? `✓ In Stock`
                                                    : product.stock > 0
                                                    ? `Only ${product.stock} left!`
                                                    : 'Out of Stock'}
                                                </span>
                                              </div>
                                            </div>

                                            {/* Variations Selectors (Colors & Sizes) */}
                                            <div className="mt-2 space-y-1.5 pt-1.5 border-t border-gray-100">
                                              {/* Sizes */}
                                              {product.sizes && product.sizes.length > 0 && (
                                                <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
                                                  <span className="text-[10px] text-gray-500 mr-1 flex-shrink-0">Size:</span>
                                                  {product.sizes.map(size => (
                                                    <button
                                                      key={size}
                                                      type="button"
                                                      onClick={() => updateCardSelection(product.id, 'size', size)}
                                                      className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors flex-shrink-0 ${
                                                        selection.size === size
                                                          ? 'bg-rose-700 text-white border-rose-700 font-medium'
                                                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                                                      }`}
                                                    >
                                                      {size}
                                                    </button>
                                                  ))}
                                                </div>
                                              )}

                                              {/* Colors */}
                                              {product.colors && product.colors.length > 0 && (
                                                <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
                                                  <span className="text-[10px] text-gray-500 mr-1 flex-shrink-0">Color:</span>
                                                  {product.colors.slice(0, 3).map(color => (
                                                    <button
                                                      key={color}
                                                      type="button"
                                                      onClick={() => updateCardSelection(product.id, 'color', color)}
                                                      className={`text-[9px] px-1.5 py-0.5 rounded-full border truncate max-w-[80px] transition-colors ${
                                                        selection.color === color
                                                          ? 'bg-rose-50 border-rose-600 text-rose-700 font-medium ring-1 ring-rose-600'
                                                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                      }`}
                                                    >
                                                      {color}
                                                    </button>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Action Buttons Row */}
                                        <div className="px-3 pb-3 pt-1 flex items-center gap-1.5 bg-gray-50/50 border-t border-gray-100">
                                          {/* View Details */}
                                          <button
                                            type="button"
                                            onClick={e => handleViewProduct(product.id, e)}
                                            className="flex-1 py-1.5 px-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                                          >
                                            <ExternalLink className="w-3 h-3 text-gray-500" />
                                            <span>View</span>
                                          </button>

                                          {/* Add to Cart */}
                                          <button
                                            type="button"
                                            onClick={e => handleAddToCart(product, e)}
                                            disabled={product.stock <= 0}
                                            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1 shadow-xs ${
                                              isAdded
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                                            }`}
                                          >
                                            {isAdded ? (
                                              <>
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Added!</span>
                                              </>
                                            ) : (
                                              <>
                                                <ShoppingBag className="w-3 h-3 text-rose-700" />
                                                <span>Add to Cart</span>
                                              </>
                                            )}
                                          </button>

                                          {/* Buy Now */}
                                          <button
                                            type="button"
                                            onClick={e => handleBuyNow(product, e)}
                                            disabled={product.stock <= 0}
                                            className="flex-1 py-1.5 px-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
                                          >
                                            <CreditCard className="w-3 h-3 text-rose-200" />
                                            <span>Buy Now</span>
                                          </button>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>

                                {/* Show More / Pagination */}
                                {totalMatched > visibleCount && (
                                  <button
                                    onClick={() => showMoreProducts(msg.id, totalMatched)}
                                    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                                  >
                                    <span>Show {Math.min(3, totalMatched - visibleCount)} More Products ({totalMatched - visibleCount} remaining)</span>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}

                      <span className="text-[10px] text-gray-400 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}

                  {/* Typing / Loading indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-rose-700 flex items-center justify-center flex-shrink-0 text-white">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-xs shadow-sm border border-gray-100 flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">Finding perfect outfits</span>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={bottomRef} />
                </div>

                {/* Quick Suggestion Chips */}
                {messages[messages.length - 1]?.quickReplies && (
                  <div className="px-3 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {messages[messages.length - 1].quickReplies!.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip)}
                        className="text-xs px-2.5 py-1 bg-rose-50/80 hover:bg-rose-100 text-rose-700 rounded-full border border-rose-200/60 whitespace-nowrap transition-colors flex-shrink-0 font-medium"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                {/* Chat Input Bar */}
                <div className="p-3 bg-white border-t border-gray-100">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="relative flex-1">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search dresses, budget (e.g. under 5k), bridal..."
                        disabled={isLoading}
                        className="w-full pl-3.5 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-600 focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all"
                      />
                      {input && (
                        <button
                          type="button"
                          onClick={() => setInput('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <button
                      id="ai-chat-send-btn"
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="w-10 h-10 rounded-xl bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-800 hover:to-rose-900 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex-shrink-0"
                      aria-label="Send message"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </form>
                  <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-gray-400">
                    <span>Ask in English or Roman Urdu</span>
                    <span>PKR Catalog Search Active</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
