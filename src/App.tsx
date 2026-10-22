import React, { useState, useEffect } from 'react';
import { PageView, Product } from './types';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { PRODUCTS } from './data/products';
import { motion, AnimatePresence } from 'motion/react';

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentPage('shop');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onSelectProduct={handleSelectProduct}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (currentPage === 'product-detail' ? `-${selectedProduct.id}` : '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {currentPage === 'home' && (
              <HomePage
                setCurrentPage={setCurrentPage}
                onSelectProduct={handleSelectProduct}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {currentPage === 'shop' && (
              <ShopPage
                onSelectProduct={handleSelectProduct}
                initialCategory={selectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {currentPage === 'product-detail' && (
              <ProductDetailPage
                product={selectedProduct}
                onSelectProduct={handleSelectProduct}
                setCurrentPage={setCurrentPage}
              />
            )}

            {currentPage === 'cart' && (
              <CartPage
                setCurrentPage={setCurrentPage}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentPage === 'checkout' && (
              <CheckoutPage
                setCurrentPage={setCurrentPage}
              />
            )}

            {currentPage === 'account' && (
              <AccountPage
                setCurrentPage={setCurrentPage}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Notification Toast */}
      <Toast />

      {/* Page Footer */}
      <Footer
        setCurrentPage={setCurrentPage}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
