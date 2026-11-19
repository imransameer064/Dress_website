'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, Category, Review, SAMPLE_PRODUCTS, CATEGORIES } from '@/lib/data';

// ============================================================
// State Types
// ============================================================

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  avatar?: string;
}

export interface StoreState {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  user: UserProfile | null;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
}

export type StoreAction =
  | { type: 'HYDRATE'; payload: Partial<StoreState> }
  | { type: 'ADD_TO_CART'; payload: { product: Product; color: string; size: string; quantity?: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string; color: string; size: string } }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; color: string; size: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'TOGGLE_CART' }
  | { type: 'TOGGLE_WISHLIST' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'DELETE_ORDER'; payload: string }
  | { type: 'SET_USER'; payload: UserProfile | null }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_REVIEW'; payload: { productId: string; review: Review } }
  | { type: 'RESET_DEMO_DATA' };

// ============================================================
// Initial State
// ============================================================

const initialState: StoreState = {
  products: SAMPLE_PRODUCTS,
  categories: CATEGORIES,
  cart: [],
  wishlist: [],
  orders: [
    {
      id: 'ORD-98241',
      items: [
        {
          product: SAMPLE_PRODUCTS[0],
          quantity: 1,
          selectedColor: 'Powder Blue',
          selectedSize: 'M',
        },
      ],
      total: 4500,
      status: 'delivered',
      customerInfo: {
        name: 'Ayesha Khan',
        email: 'ayesha.khan@example.com',
        phone: '03001234567',
      },
      shippingAddress: {
        street: 'House 42, Street 8, F-7/2',
        city: 'Islamabad',
        province: 'Federal',
        postalCode: '44000',
      },
      paymentMethod: 'Cash on Delivery (COD)',
      createdAt: '2026-10-25T14:30:00.000Z',
      updatedAt: '2026-10-28T10:00:00.000Z',
    },
    {
      id: 'ORD-98242',
      items: [
        {
          product: SAMPLE_PRODUCTS[2],
          quantity: 1,
          selectedColor: 'Emerald Green',
          selectedSize: 'S',
        },
      ],
      total: 22000,
      status: 'shipped',
      customerInfo: {
        name: 'Ayesha Khan',
        email: 'ayesha.khan@example.com',
        phone: '03001234567',
      },
      shippingAddress: {
        street: 'House 42, Street 8, F-7/2',
        city: 'Islamabad',
        province: 'Federal',
        postalCode: '44000',
      },
      paymentMethod: 'Bank Transfer (IBFT)',
      createdAt: '2026-10-31T09:15:00.000Z',
      updatedAt: '2026-11-01T16:20:00.000Z',
    },
  ],
  user: {
    id: 'u001',
    name: 'Ayesha Khan',
    email: 'ayesha.khan@example.com',
    phone: '03001234567',
    address: 'House 42, Street 8, F-7/2',
    city: 'Islamabad',
  },
  isCartOpen: false,
  isWishlistOpen: false,
};

// ============================================================
// Reducer
// ============================================================

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        ...action.payload,
        products: action.payload.products && action.payload.products.length > 0 ? action.payload.products : state.products,
        categories: action.payload.categories && action.payload.categories.length > 0 ? action.payload.categories : state.categories,
        orders: action.payload.orders && action.payload.orders.length > 0 ? action.payload.orders : state.orders,
        user: action.payload.user ?? state.user,
      };

    case 'ADD_TO_CART': {
      const { product, color, size, quantity = 1 } = action.payload;
      const key = `${product.id}-${color}-${size}`;
      const existingIdx = state.cart.findIndex(
        item => `${item.product.id}-${item.selectedColor}-${item.selectedSize}` === key
      );
      if (existingIdx >= 0) {
        const newCart = [...state.cart];
        newCart[existingIdx] = {
          ...newCart[existingIdx],
          quantity: newCart[existingIdx].quantity + quantity,
        };
        return { ...state, cart: newCart, isCartOpen: true };
      }
      return {
        ...state,
        cart: [...state.cart, { product, quantity, selectedColor: color, selectedSize: size }],
        isCartOpen: true,
      };
    }

    case 'REMOVE_FROM_CART': {
      const { productId, color, size } = action.payload;
      return {
        ...state,
        cart: state.cart.filter(
          item => !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)
        ),
      };
    }

    case 'UPDATE_CART_QUANTITY': {
      const { productId, color, size, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(
            item => !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)
          ),
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === productId && item.selectedColor === color && item.selectedSize === size
            ? { ...item, quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'ADD_TO_WISHLIST': {
      const exists = state.wishlist.some(p => p.id === action.payload.id);
      if (exists) return state;
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    }

    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter(p => p.id !== action.payload) };

    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };

    case 'TOGGLE_WISHLIST':
      return { ...state, isWishlistOpen: !state.isWishlistOpen };

    case 'SET_CART_OPEN':
      return { ...state, isCartOpen: action.payload };

    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.orderId
            ? { ...o, status: action.payload.status, updatedAt: new Date().toISOString() }
            : o
        ),
      };

    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(o => o.id !== action.payload),
      };

    case 'SET_USER':
      return { ...state, user: action.payload };

    // --- Product CRUD ---
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [action.payload, ...state.products],
      };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => (p.id === action.payload.id ? action.payload : p)),
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
        wishlist: state.wishlist.filter(p => p.id !== action.payload),
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };

    // --- Category CRUD ---
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };

    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c => (c.id === action.payload.id ? action.payload : c)),
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      };

    // --- Reviews ---
    case 'ADD_REVIEW': {
      const { productId, review } = action.payload;
      return {
        ...state,
        products: state.products.map(p => {
          if (p.id !== productId) return p;
          const updatedReviews = [review, ...(p.reviews || [])];
          const avgRating = Number(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...p,
            reviews: updatedReviews,
            rating: avgRating,
          };
        }),
      };
    }

    case 'RESET_DEMO_DATA':
      return {
        ...state,
        products: SAMPLE_PRODUCTS,
        categories: CATEGORIES,
      };

    default:
      return state;
  }
}

// ============================================================
// Context
// ============================================================

interface StoreContextType {
  state: StoreState;
  dispatch: React.Dispatch<StoreAction>;
  cartCount: number;
  cartTotal: number;
  isInWishlist: (id: string) => boolean;
  isInCart: (productId: string, color: string, size: string) => boolean;
  getProductById: (id: string) => Product | undefined;
}

const StoreContext = createContext<StoreContextType | null>(null);

// ============================================================
// Provider
// ============================================================

const STORAGE_KEY = 'elegance_pk_store_v2';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<StoreState>;
        dispatch({
          type: 'HYDRATE',
          payload: {
            products: parsed.products,
            categories: parsed.categories,
            cart: parsed.cart ?? [],
            wishlist: parsed.wishlist ?? [],
            orders: parsed.orders,
            user: parsed.user ?? initialState.user,
          },
        });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage on state changes
  useEffect(() => {
    try {
      const toSave = {
        products: state.products,
        categories: state.categories,
        cart: state.cart,
        wishlist: state.wishlist,
        orders: state.orders,
        user: state.user,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // ignore quota errors
    }
  }, [state.products, state.categories, state.cart, state.wishlist, state.orders, state.user]);

  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isInWishlist = (id: string) => state.wishlist.some(p => p.id === id);
  const isInCart = (productId: string, color: string, size: string) =>
    state.cart.some(
      item => item.product.id === productId && item.selectedColor === color && item.selectedSize === size
    );
  const getProductById = (id: string) => state.products.find(p => p.id === id);

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatch,
        cartCount,
        cartTotal,
        isInWishlist,
        isInCart,
        getProductById,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
