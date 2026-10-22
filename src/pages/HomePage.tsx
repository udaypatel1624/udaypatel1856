import React, { useState } from 'react';
import { Category, PageView, Product } from '../types';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import {
  Zap,
  ArrowRight,
  Shield,
  Sparkles,
  Layers,
  ChevronRight,
  Sliders,
  Headphones,
  Keyboard,
  Monitor,
  Watch,
  Cpu,
  Star,
  CheckCircle2,
  Mail,
} from 'lucide-react';
import { motion } from 'motion/react';

interface HomePageProps {
  setCurrentPage: (page: PageView) => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categoryName: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentPage,
  onSelectProduct,
  onSelectCategory,
}) => {
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'trending' | 'new'>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Category Icon mapper
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-cyan-400" />;
      case 'Keyboard':
        return <Keyboard className="w-6 h-6 text-purple-400" />;
      case 'Monitor':
        return <Monitor className="w-6 h-6 text-cyan-400" />;
      case 'Watch':
        return <Watch className="w-6 h-6 text-pink-400" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-emerald-400" />;
      default:
        return <Zap className="w-6 h-6 text-cyan-400" />;
    }
  };

  const filteredFeatured = PRODUCTS.filter((p) => {
    if (featuredFilter === 'trending') return p.rating >= 4.8;
    if (featuredFilter === 'new') return p.isNew;
    return p.isFeatured || p.isNew;
  }).slice(0, 8);

  const heroFeaturedProduct = PRODUCTS[0]; // AeroPulse Headphones

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setNewsletterSubmitted(true);
    }
  };

  return (
    <div className="space-y-24 pb-12">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24">
        {/* Background Ambient Glows & Grid */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/15 blur-[130px] rounded-full pointer-events-none" />

        {/* Subtle cyber grid backdrop */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>NEXT-GEN NEURAL HARDWARE DROP 2026</span>
              </motion.div>

              {/* Display Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
              >
                Architected for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200">
                  Peak Velocity
                </span>{' '}
                &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">
                  Total Immersion
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed"
              >
                Equip your workstation with quantum-dot ultrawide optics, analog Hall-effect switches, spatial acoustic monitors, and aerospace titanium wearables.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <button
                  type="button"
                  onClick={() => setCurrentPage('shop')}
                  className="px-7 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] transition-all duration-300 flex items-center gap-2 group active:scale-95"
                  id="hero-explore-catalog-btn"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectProduct(heroFeaturedProduct)}
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-[#0d1220]/80 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white hover:bg-slate-800/60 transition-all duration-300 flex items-center gap-2"
                  id="hero-featured-spotlight-btn"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Featured Flagship</span>
                </button>
              </motion.div>

              {/* Stats Bar */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <p className="text-2xl font-bold font-mono text-cyan-400">0.03ms</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Pixel Response</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-purple-400">8000Hz</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Polling Latency</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-slate-200">100%</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Pure Beryllium</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={() => onSelectProduct(heroFeaturedProduct)}
                className="relative rounded-3xl p-1 bg-gradient-to-b from-cyan-500/40 via-purple-500/20 to-transparent shadow-[0_0_50px_rgba(6,182,212,0.2)] cursor-pointer group"
              >
                <div className="relative rounded-[22px] bg-[#0c101d] overflow-hidden border border-slate-800/90 p-6 space-y-5">
                  {/* Floating Tag */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      FLAGSHIP HARDWARE
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>4.9 / 5.0</span>
                    </div>
                  </div>

                  {/* Main Product Image */}
                  <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-950">
                    <img
                      src={heroFeaturedProduct.image}
                      alt={heroFeaturedProduct.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Info block */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {heroFeaturedProduct.name}
                      </h3>
                      <span className="text-xl font-bold font-mono text-cyan-400">
                        ${heroFeaturedProduct.price}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {heroFeaturedProduct.description}
                    </p>
                  </div>

                  {/* Action preview pill */}
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-300 font-medium border-t border-slate-800">
                    <span className="text-cyan-400 group-hover:underline flex items-center gap-1">
                      Inspect Product Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-slate-500 font-mono">In Stock ({heroFeaturedProduct.stock} left)</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Hardware Infrastructure</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Curated Cyberware Categories
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCurrentPage('shop')}
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group self-start md:self-auto"
          >
            <span>Browse all gear</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 5 Categories Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.name)}
              className="group relative rounded-2xl bg-[#0d1220]/90 border border-slate-800/90 hover:border-cyan-500/50 p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] hover:-translate-y-1"
              id={`cat-card-${category.id}`}
            >
              {/* Background ambient image glow */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                style={{ backgroundImage: `url(${category.image})` }}
              />

              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/40 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all">
                  {renderCategoryIcon(category.iconName)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {category.tagline}
                  </p>
                </div>
              </div>

              <div className="relative z-10 pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500">{category.itemCount} items</span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                  Enter <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Hardware</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Battlestation Upgrades
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFeaturedFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                featuredFilter === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Drops
            </button>
            <button
              type="button"
              onClick={() => setFeaturedFilter('trending')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                featuredFilter === 'trending'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Top Rated
            </button>
            <button
              type="button"
              onClick={() => setFeaturedFilter('new')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                featuredFilter === 'new'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFeatured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setCurrentPage('shop')}
            className="px-8 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-300 transition-all duration-300 shadow-md inline-flex items-center gap-2 group"
          >
            <span>View All {PRODUCTS.length} Cybernetic Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 4. Promotional Interactive Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-purple-500/30 bg-gradient-to-br from-[#120f26] via-[#0b0e1a] to-[#071622] shadow-[0_0_50px_rgba(168,85,247,0.15)]">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-cyan-500/15 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-5">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              SPECIAL PROMOTION
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Upgrade Your Battlestation with Instant 20% Discount
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Use code <strong className="text-cyan-300 font-mono font-bold">NEON20</strong> during checkout to receive 20% off all gaming optics, acoustic interfaces, and hall-effect keyboards. Plus free international priority shipping.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setCurrentPage('shop')}
                className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-400 hover:to-cyan-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
              >
                Claim Discount in Store
              </button>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Expires in 48 hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Home Newsletter Section (explicitly required) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-10 bg-[#0c101d] border border-cyan-500/30 text-center relative overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.1)]">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6" />
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">
            Join the NeonVault Neural Network
          </h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
            Get instant notifications on limited-run cyberware drops, secret prototype giveaways, and member-only discounts.
          </p>

          {newsletterSubmitted ? (
            <div className="p-4 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 text-sm max-w-md mx-auto flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>You&apos;re plugged in! Check your inbox for your 15% welcome code.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3 rounded-xl bg-[#080b14] border border-slate-700 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
                id="home-newsletter-input"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all shrink-0"
                id="home-newsletter-btn"
              >
                Sign Up
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
