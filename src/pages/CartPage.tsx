import React, { useState } from 'react';
import { PageView, Product } from '../types';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle,
  X,
} from 'lucide-react';

interface CartPageProps {
  setCurrentPage: (page: PageView) => void;
  onSelectProduct: (product: Product) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ setCurrentPage, onSelectProduct }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    appliedPromo,
    promoError,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyPromoCode(couponInput);
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Your Cart is Currently Empty
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Looks like you haven&apos;t loaded any neural hardware or cybernetic peripherals into your staging terminal yet.
        </p>
        <button
          type="button"
          onClick={() => setCurrentPage('shop')}
          className="px-8 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all inline-flex items-center gap-2 group"
          id="cart-empty-shop-btn"
        >
          <span>Explore Cyber Catalog</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Review Your Cyberware Cart
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review selected hardware specifications and prepare for deployment.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCurrentPage('shop')}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 rounded-2xl bg-[#0b0f19] border border-cyan-500/20 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-cyan-400" />
            {amountNeededForFreeShipping > 0
              ? `Add $${amountNeededForFreeShipping.toFixed(2)} more for FREE Quantum Shipping`
              : 'You have unlocked FREE Quantum Shipping!'}
          </span>
          <span className="text-cyan-400 font-bold">{progressToFreeShipping}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
            style={{ width: `${progressToFreeShipping}%` }}
          />
        </div>
      </div>

      {/* Cart Grid: Items List (Left) + Order Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl bg-[#0b0f19] border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-900/30 transition-colors"
                id={`cart-item-${item.id}`}
              >
                {/* Product Thumbnail & Details */}
                <div
                  onClick={() => onSelectProduct(item.product)}
                  className="flex items-center gap-4 cursor-pointer group flex-1 min-w-0"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0 group-hover:border-cyan-500/40 transition-colors"
                  />
                  <div className="space-y-1 min-w-0">
                    <span className="text-[11px] font-mono text-cyan-400 uppercase">
                      {item.product.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Finish: <span className="text-slate-200">{item.variant}</span>
                    </p>
                    <p className="text-xs font-mono font-bold text-slate-300 sm:hidden">
                      ${item.product.price} each
                    </p>
                  </div>
                </div>

                {/* Right controls: Stepper, Item Total & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                  {/* Quantity Stepper (Required) */}
                  <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      title="Decrease"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-xs text-slate-200">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      title="Increase"
                    >
                      +
                    </button>
                  </div>

                  {/* Total price for line */}
                  <div className="text-right min-w-[80px]">
                    <span className="font-mono font-bold text-sm text-slate-100 block">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        ${item.product.price} / ea
                      </span>
                    )}
                  </div>

                  {/* Remove Button (Required) */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove from Cart"
                    id={`remove-item-${item.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Prices include applicable export duties.</span>
            <button
              type="button"
              onClick={clearCart}
              className="text-slate-400 hover:text-rose-400 underline transition-colors"
            >
              Clear Entire Cart
            </button>
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-[#0b0f19] border border-slate-800 p-6 space-y-5 sticky top-24 shadow-xl">
            <h2 className="text-lg font-bold text-white tracking-tight border-b border-slate-800 pb-3">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Coupon or Access Code</span>
              </label>

              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono text-cyan-300">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CODE: {appliedPromo} (-${discount.toFixed(2)})</span>
                  </div>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="p-1 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter NEON20"
                    className="flex-1 px-3 py-2 text-xs uppercase font-mono rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoError && (
                <p className="text-[11px] text-rose-400 font-mono">{promoError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-200">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-cyan-400">
                  <span>Cyber Promo Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? <strong className="text-emerald-400 font-bold">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Estimated Tax (8%)</span>
                <span className="text-slate-200">${tax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between text-base font-bold text-white">
                <span>Grand Total</span>
                <span className="text-cyan-400 font-extrabold font-mono text-xl">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout CTA Button (Required) */}
            <button
              type="button"
              onClick={() => setCurrentPage('checkout')}
              className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2 group active:scale-98"
              id="cart-proceed-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Security Guarantee */}
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400 space-y-1 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>256-Bit Encrypted Quantum Checkout</span>
              </div>
              <p>Hardware packaged with tamper-evident seal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
