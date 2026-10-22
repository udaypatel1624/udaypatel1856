export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: 'Audio & Sound' | 'Keyboards & Inputs' | 'Displays & Optics' | 'Wearables & Gear' | 'Power & Storage';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  specs: {
    connectivity?: string;
    battery?: string;
    dimensions?: string;
    weight?: string;
    material?: string;
    warranty?: string;
    [key: string]: string | undefined;
  };
  variants: string[];
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  badge?: string;
}

export interface Category {
  id: string;
  name: 'Audio & Sound' | 'Keyboards & Inputs' | 'Displays & Optics' | 'Wearables & Gear' | 'Power & Storage';
  tagline: string;
  iconName: string;
  image: string;
  itemCount: number;
}

export interface CartItem {
  id: string; // composite id: `${productId}-${variant}`
  productId: string;
  product: Product;
  quantity: number;
  variant: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  aptSuite?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  items: {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    variant: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  trackingNumber?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  joinedDate: string;
  defaultAddress: ShippingAddress;
}

export interface FilterState {
  category: string;
  searchQuery: string;
  priceRange: [number, number];
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating-high' | 'newest';
}

export type PageView = 'home' | 'shop' | 'product-detail' | 'cart' | 'checkout' | 'account';
