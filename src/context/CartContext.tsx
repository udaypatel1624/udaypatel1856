import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  appliedPromo: string | null;
  promoDiscount: number;
  promoError: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  toast: { text: string; type: 'success' | 'info' | 'error'; id: number } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'neonvault_cart_v1';
const PROMO_KEY = 'neonvault_promo_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PROMO_KEY);
    } catch {
      return null;
    }
  });

  const [promoError, setPromoError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error'; id: number } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem(PROMO_KEY, appliedPromo);
      } else {
        localStorage.removeItem(PROMO_KEY);
      }
    } catch (e) {
      console.warn('Could not save promo to localStorage', e);
    }
  }, [appliedPromo]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToast({ text, type, id });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3200);
  };

  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    const chosenVariant = variant || product.variants[0] || 'Default';
    const cartItemId = `${product.id}-${chosenVariant}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          quantity: Math.min(quantity, product.stock),
          variant: chosenVariant,
        },
      ];
    });

    showToast(`Added ${quantity}x "${product.name}" (${chosenVariant}) to cart`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === cartItemId);
      if (item) {
        showToast(`Removed "${item.product.name}" from cart`, 'info');
      }
      return prev.filter((i) => i.id !== cartItemId);
    });
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const clamped = Math.min(newQuantity, item.product.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Promo code validation: NEON20 gives 20% off, CYBER10 gives 10% off
  let promoDiscountPercent = 0;
  if (appliedPromo === 'NEON20') promoDiscountPercent = 0.2;
  else if (appliedPromo === 'CYBER10') promoDiscountPercent = 0.1;
  else if (appliedPromo === 'FREESHIP') promoDiscountPercent = 0.05;

  const promoDiscount = Math.round(subtotal * promoDiscountPercent * 100) / 100;
  const discount = promoDiscount;

  // Free shipping over $150 or if cart is empty
  const shipping = subtotal === 0 ? 0 : subtotal >= 150 ? 0 : 15;

  // Estimated tax 8%
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.08 * 100) / 100;

  const total = Math.max(0, Math.round((taxableAmount + shipping + tax) * 100) / 100);

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'NEON20' || clean === 'CYBER10' || clean === 'FREESHIP') {
      setAppliedPromo(clean);
      setPromoError(null);
      showToast(`Promo code "${clean}" applied successfully!`, 'success');
      return true;
    } else {
      setPromoError('Invalid coupon code. Try "NEON20" for 20% off.');
      showToast('Invalid coupon code', 'error');
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError(null);
    showToast('Promo code removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        appliedPromo,
        promoDiscount,
        promoError,
        applyPromoCode,
        removePromoCode,
        toast,
        showToast,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
