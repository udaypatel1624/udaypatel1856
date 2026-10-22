import React, { useState } from 'react';
import { PageView, Product } from '../types';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import {
  Star,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProductDetailPageProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  setCurrentPage: (page: PageView) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onSelectProduct,
  setCurrentPage,
}) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedVariant, setSelectedVariant] = useState<string>(product.variants[0] || 'Default');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'features' | 'specs' | 'shipping'>('features');
  const [isFavorited, setIsFavorited] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync state if product changes
  React.useEffect(() => {
    setSelectedImage(product.image);
    setSelectedVariant(product.variants[0] || 'Default');
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Related products from same category or fallback
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.rating >= 4.8)
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    setCurrentPage('checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage('home')}
            className="hover:text-cyan-300 transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <button
            onClick={() => setCurrentPage('shop')}
            className="hover:text-cyan-300 transition-colors"
          >
            Catalog
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-500">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-cyan-300 font-medium truncate max-w-xs">{product.name}</span>
        </div>

        <button
          onClick={() => setCurrentPage('shop')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back to Products</span>
        </button>
      </div>

      {/* Main Detail Grid: Gallery & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left: Image Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Visual Stage */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#111624] to-[#0a0d18] border border-slate-800 shadow-2xl p-4 flex items-center justify-center group">
            <img
              src={selectedImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badge && (
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
                  {product.badge}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 backdrop-blur-md">
                  SAVE {discountPercent}%
                </span>
              )}
            </div>

            {/* Share / Favorite overlay buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 backdrop-blur-md transition-all"
                title="Copy Product Link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsFavorited(!isFavorited)}
                className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
                  isFavorited
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden bg-slate-900 border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Purchasing & Specifications (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Rating */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
              <span>{product.category}</span>
              <span>•</span>
              <span className="text-slate-400">SKU: NV-{product.id.toUpperCase()}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {product.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium">
              {product.tagline}
            </p>

            {/* Rating Stars & Reviews */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-200">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewsCount} verified customer reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-[#0b0f19] border border-slate-800 flex items-baseline gap-4">
            <span className="text-3xl font-extrabold font-mono text-cyan-400">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-lg font-mono text-slate-500 line-through">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-xs font-mono text-emerald-400 ml-auto flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>In Stock ({product.stock} units remaining)</span>
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Size / Variant Selector (Required) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase tracking-wider">Select Chassis / Finish:</span>
              <span className="text-cyan-300 font-bold">{selectedVariant}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.variants.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                    selectedVariant === v
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-mono font-bold text-sm text-slate-200">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button (Required) */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(168,85,247,0.45)] transition-all flex items-center justify-center gap-2 group active:scale-95"
                id="pdp-add-to-cart-btn"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
              </button>
            </div>

            {/* Instant Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2"
              id="pdp-buy-now-btn"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Instant Checkout</span>
            </button>
          </div>

          {/* Quick Perks */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-center">
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs">
              <Truck className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="font-semibold text-slate-200">Express Post</p>
              <p className="text-[10px] text-slate-400">1-2 business days</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs">
              <ShieldCheck className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <p className="font-semibold text-slate-200">2-Yr Warranty</p>
              <p className="text-[10px] text-slate-400">Full zero-friction</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs">
              <RotateCcw className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="font-semibold text-slate-200">Free Returns</p>
              <p className="text-[10px] text-slate-400">30-day window</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Features, Specs, Shipping */}
      <div className="space-y-6 pt-8 border-t border-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('features')}
            className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'features'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Core Features
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'specs'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Technical Specifications
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'shipping'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Shipping & Return Policy
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 rounded-2xl bg-[#0b0f19] border border-slate-800 text-sm">
          {activeTab === 'features' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-white mb-2">Engineered Capabilities</h3>
              <ul className="space-y-2.5">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
                  <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-sm font-medium text-slate-200">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                All orders are packaged in electrostatic ESD-shielded shock-absorbent containers and dispatched within 24 hours from our automated silicon distribution hubs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-cyan-400 font-bold">Standard Ground</p>
                  <p className="text-slate-400">3-5 Business Days • Free over $150 ($15 otherwise)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-purple-400 font-bold">Quantum Cyber Express</p>
                  <p className="text-slate-400">1-2 Business Days • Insured Signature Delivery</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Grid (Required) */}
      <div className="space-y-6 pt-10 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Related Cyber Gear
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Peripherals and accessories matched to complete your battlestation.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentPage('shop')}
            className="text-xs font-semibold text-cyan-400 hover:underline"
          >
            Explore all in {product.category}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relProd) => (
            <ProductCard
              key={relProd.id}
              product={relProd}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
