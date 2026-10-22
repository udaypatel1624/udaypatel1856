import React, { useState, useRef, useEffect } from 'react';
import { PageView, Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PRODUCTS } from '../data/products';
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Zap,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categoryName: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  onSelectProduct,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const { totalItems, setIsDrawerOpen } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Live filter results for search dropdown
  const filteredSuggestions = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (product: Product) => {
    onSelectProduct(product);
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
    setCurrentPage('shop');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090e]/85 backdrop-blur-xl transition-all duration-200">
      {/* Top micro announcement banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-purple-950/60 to-cyan-950/60 border-b border-cyan-500/10 py-1.5 px-4 text-center text-xs text-slate-300 font-mono flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>CYBER WEEK PROMO: USE CODE <strong className="text-cyan-300 font-bold tracking-wider">NEON20</strong> FOR 20% OFF ALL HARDWARE</span>
        <span className="hidden sm:inline text-slate-500">•</span>
        <span className="hidden sm:inline text-purple-300">FREE QUANTUM SHIPPING OVER $150</span>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          id="brand-logo-btn"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300">
            <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 group-hover:text-purple-300 transition-colors transform group-hover:scale-110" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center tracking-wider text-xl font-extrabold leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">NEON</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">VAULT</span>
            </div>
            <span className="text-[10px] text-slate-400 tracking-widest font-mono uppercase mt-0.5">CYBERWARE EST. 2026</span>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              currentPage === 'home'
                ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
            id="nav-link-home"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage('shop')}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              currentPage === 'shop'
                ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
            id="nav-link-shop"
          >
            Products
          </button>
          <div className="relative group/cat">
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 flex items-center gap-1 transition-all duration-200"
              id="nav-link-categories"
            >
              <span>Categories</span>
              <ChevronRight className="w-3.5 h-3.5 rotate-90 text-slate-400 group-hover/cat:text-cyan-300 transition-colors" />
            </button>
            {/* Hover dropdown categories */}
            <div className="absolute top-full left-0 mt-1 w-56 p-2 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-2xl opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-50">
              {['Audio & Sound', 'Keyboards & Inputs', 'Displays & Optics', 'Wearables & Gear', 'Power & Storage'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60 rounded-xl transition-all flex items-center justify-between"
                >
                  <span>{cat}</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Live Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search keyboards, neural audio, displays..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-[#0d1220] border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all font-sans"
              id="navbar-search-input"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Search suggestions dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-[#0c101d] border border-slate-800/90 shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
              >
                <div className="px-3 py-1.5 text-[11px] font-mono uppercase text-slate-400 tracking-wider flex justify-between">
                  <span>Found {filteredSuggestions.length} products</span>
                  <button
                    onClick={() => {
                      setIsSearchFocused(false);
                      setCurrentPage('shop');
                    }}
                    className="text-cyan-400 hover:underline"
                  >
                    View all in Catalog
                  </button>
                </div>
                {filteredSuggestions.length > 0 ? (
                  <div className="divide-y divide-slate-800/60">
                    {filteredSuggestions.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSuggestionClick(item)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors group"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{item.category}</p>
                        </div>
                        <div className="text-xs font-mono font-bold text-cyan-400 shrink-0">
                          ${item.price}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No cyberware matches &quot;{searchQuery}&quot;. Press Enter to explore catalog.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Controls: User Account & Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Account Button */}
          <button
            type="button"
            onClick={() => setCurrentPage('account')}
            className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center gap-2 ${
              currentPage === 'account'
                ? 'bg-purple-950/40 border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                : 'bg-[#0d1220] border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            title={isLoggedIn ? `Account: ${user?.fullName}` : 'Login / Register'}
            id="nav-account-btn"
          >
            {isLoggedIn && user ? (
              <div className="flex items-center gap-2">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-5 h-5 rounded-full object-cover border border-purple-400/50"
                />
                <span className="hidden lg:inline text-xs font-medium max-w-[100px] truncate">
                  {user.fullName.split(' ')[0]}
                </span>
              </div>
            ) : (
              <User className="w-4 h-4 text-slate-300" />
            )}
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={() => setCurrentPage('cart')}
            className={`relative p-2.5 rounded-xl border transition-all duration-200 flex items-center gap-2.5 ${
              currentPage === 'cart'
                ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                : 'bg-[#0d1220] border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
            }`}
            id="nav-cart-btn"
          >
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline text-xs font-semibold">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 min-w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-[#0d1220] border border-slate-800 text-slate-300 hover:text-white"
            id="nav-mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-800 bg-[#090d16] px-4 py-5 space-y-4"
          >
            {/* Mobile Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#0f1422] border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            {/* Mobile Links */}
            <div className="flex flex-col gap-1.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                  currentPage === 'home' ? 'bg-cyan-950/40 text-cyan-300' : 'text-slate-300'
                }`}
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('shop');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                  currentPage === 'shop' ? 'bg-cyan-950/40 text-cyan-300' : 'text-slate-300'
                }`}
              >
                Catalog & Filters
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('cart');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between ${
                  currentPage === 'cart' ? 'bg-cyan-950/40 text-cyan-300' : 'text-slate-300'
                }`}
              >
                <span>Shopping Cart</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {totalItems} items
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('account');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                  currentPage === 'account' ? 'bg-purple-950/40 text-purple-300' : 'text-slate-300'
                }`}
              >
                {isLoggedIn ? `Account (${user?.fullName})` : 'Sign In / Register'}
              </button>
            </div>

            {/* Mobile Category Fast Links */}
            <div className="pt-3 border-t border-slate-800">
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
                Fast Categories
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['Audio & Sound', 'Keyboards & Inputs', 'Displays & Optics', 'Wearables & Gear'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
