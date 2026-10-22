import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Star, ShoppingBag, Eye, Heart, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.variants[0]);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col rounded-2xl bg-[#0d121f]/90 border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_10px_35px_rgba(6,182,212,0.18)]"
      id={`product-card-${product.id}`}
    >
      {/* Neon Glow accent top bar */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-[#111827] to-[#0a0e1a]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
          loading="lazy"
        />

        {/* Gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d121f] via-transparent to-black/20 opacity-80" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick action buttons on hover */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all duration-200 border ${
              isLiked
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-black/40 border-white/10 text-slate-300 hover:text-white hover:bg-black/60'
            }`}
            title="Add to Wishlist"
            id={`wishlist-btn-${product.id}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="p-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-black/70 backdrop-blur-md transition-all duration-200"
            title="Inspect Details"
            id={`view-btn-${product.id}`}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Category tag bottom left */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-medium tracking-wide text-slate-400/90 uppercase px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm border border-white/5">
            {product.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Rating and Reviews */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="font-semibold text-slate-200">{product.rating}</span>
            <span className="text-slate-500">({product.reviewsCount})</span>
          </div>
          <span className={`text-[11px] font-medium ${product.stock < 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}
          </span>
        </div>

        {/* Title and Tagline */}
        <div className="space-y-1">
          <h3 className="font-semibold text-base text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-100 font-mono">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through font-mono">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">VAT included</span>
          </div>

          {/* Quick Add to Cart button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 ${
              justAdded
                ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95'
            }`}
            id={`add-to-cart-${product.id}`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
