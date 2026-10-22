import React, { createContext, useContext, useEffect, useState } from 'react';
import { ShippingAddress, UserOrder, UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  orders: UserOrder[];
  login: (email: string, name?: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  addOrder: (orderData: Omit<UserOrder, 'id' | 'orderNumber' | 'createdAt'>) => UserOrder;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_neon_091',
  fullName: 'Alex Vance',
  email: 'alex.vance@neonvault.io',
  phone: '+1 (555) 839-2041',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  joinedDate: 'November 2025',
  defaultAddress: {
    fullName: 'Alex Vance',
    email: 'alex.vance@neonvault.io',
    phone: '+1 (555) 839-2041',
    streetAddress: '742 Evergreen Cyber Way',
    aptSuite: 'Suite 404',
    city: 'Neo Tokyo',
    state: 'CA',
    postalCode: '94107',
    country: 'United States',
  },
};

const INITIAL_ORDERS: UserOrder[] = [
  {
    id: 'ord_9841',
    orderNumber: 'NV-2026-9841',
    createdAt: 'March 10, 2026',
    status: 'Delivered',
    items: [
      {
        productId: 'prod-1',
        name: 'AeroPulse ANC Cyber Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
        price: 349,
        quantity: 1,
        variant: 'Cyber Black / Neon Cyan',
      },
      {
        productId: 'prod-6',
        name: 'ChromaGlide Wireless Optical Mouse',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=400&q=80',
        price: 129,
        quantity: 1,
        variant: 'Electric Cyan',
      },
    ],
    subtotal: 478,
    discount: 95.6,
    shipping: 0,
    tax: 30.59,
    total: 412.99,
    shippingAddress: {
      fullName: 'Alex Vance',
      email: 'alex.vance@neonvault.io',
      phone: '+1 (555) 839-2041',
      streetAddress: '742 Evergreen Cyber Way',
      aptSuite: 'Suite 404',
      city: 'Neo Tokyo',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
    },
    paymentMethod: 'NeonPay Cyber Card (•••• 8829)',
    trackingNumber: 'NV-TRK-7740291-EXP',
  },
  {
    id: 'ord_8392',
    orderNumber: 'NV-2026-8392',
    createdAt: 'February 18, 2026',
    status: 'Delivered',
    items: [
      {
        productId: 'prod-2',
        name: 'Vortex-75 Hall-Effect Mechanical Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80',
        price: 219,
        quantity: 1,
        variant: 'Cyberpunk Purple',
      },
    ],
    subtotal: 219,
    discount: 0,
    shipping: 0,
    tax: 17.52,
    total: 236.52,
    shippingAddress: {
      fullName: 'Alex Vance',
      email: 'alex.vance@neonvault.io',
      phone: '+1 (555) 839-2041',
      streetAddress: '742 Evergreen Cyber Way',
      aptSuite: 'Suite 404',
      city: 'Neo Tokyo',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
    },
    paymentMethod: 'Apple Pay',
    trackingNumber: 'NV-TRK-6102834-STD',
  },
];

const AUTH_STORAGE_KEY = 'neonvault_user_v1';
const ORDERS_STORAGE_KEY = 'neonvault_orders_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [orders, setOrders] = useState<UserOrder[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed saving user to storage', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed saving orders to storage', e);
    }
  }, [orders]);

  const login = (email: string, name?: string) => {
    const newUser: UserProfile = {
      ...DEFAULT_PROFILE,
      email,
      fullName: name || email.split('@')[0].toUpperCase(),
    };
    setUser(newUser);
  };

  const signup = (email: string, name: string) => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName: name,
      email,
      phone: '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      joinedDate: 'Just now',
      defaultAddress: {
        fullName: name,
        email,
        phone: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States',
      },
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const addOrder = (orderData: Omit<UserOrder, 'id' | 'orderNumber' | 'createdAt'>): UserOrder => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: UserOrder = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber: `NV-2026-${randomSuffix}`,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      trackingNumber: `NV-TRK-${Math.floor(1000000 + Math.random() * 9000000)}-EXP`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        orders,
        login,
        signup,
        logout,
        updateProfile,
        addOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
