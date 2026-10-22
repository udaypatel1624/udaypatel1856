import React, { useState } from 'react';
import { PageView, ShippingAddress, UserOrder } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Truck,
  Zap,
  Coins,
  Wallet,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

interface CheckoutPageProps {
  setCurrentPage: (page: PageView) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ setCurrentPage }) => {
  const { cart, subtotal, discount, shipping, tax, total, clearCart } = useCart();
  const { user, addOrder } = useAuth();

  // Form State
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.fullName || 'Alex Vance',
    email: user?.email || 'alex.vance@neonvault.io',
    phone: user?.phone || '+1 (555) 839-2041',
    streetAddress: user?.defaultAddress?.streetAddress || '742 Evergreen Cyber Way',
    aptSuite: user?.defaultAddress?.aptSuite || 'Suite 404',
    city: user?.defaultAddress?.city || 'Neo Tokyo',
    state: user?.defaultAddress?.state || 'CA',
    postalCode: user?.defaultAddress?.postalCode || '94107',
    country: user?.defaultAddress?.country || 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'crypto'>('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 •••• •••• 8829',
    cardHolder: user?.fullName || 'Alex Vance',
    expiry: '08/29',
    cvc: '742',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<UserOrder | null>(null);

  // If cart is empty and no order completed yet
  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <h2 className="text-2xl font-bold text-white">No Items to Check Out</h2>
        <p className="text-sm text-slate-400">
          Your shopping terminal is empty. Please select products from the catalog first.
        </p>
        <button
          type="button"
          onClick={() => setCurrentPage('shop')}
          className="px-6 py-3 rounded-xl font-semibold text-xs bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Form Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!shippingAddress.fullName.trim()) errs.fullName = 'Full legal name is required';
    if (!shippingAddress.email.trim() || !shippingAddress.email.includes('@')) {
      errs.email = 'Valid contact email is required';
    }
    if (!shippingAddress.phone.trim()) errs.phone = 'Phone contact is required for courier';
    if (!shippingAddress.streetAddress.trim()) errs.streetAddress = 'Delivery street address is required';
    if (!shippingAddress.city.trim()) errs.city = 'City is required';
    if (!shippingAddress.state.trim()) errs.state = 'State / Province is required';
    if (!shippingAddress.postalCode.trim()) errs.postalCode = 'Postal / Zip code is required';

    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber.trim()) errs.cardNumber = 'Card number is required';
      if (!cardDetails.expiry.trim()) errs.expiry = 'MM/YY required';
      if (!cardDetails.cvc.trim() || cardDetails.cvc.length < 3) errs.cvc = 'Valid CVC required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate cyber payment processing
    setTimeout(() => {
      const placedOrder = addOrder({
        status: 'Processing',
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
          variant: item.variant,
        })),
        subtotal,
        discount,
        shipping: shippingMethod === 'express' ? shipping + 25 : shipping,
        tax,
        total: shippingMethod === 'express' ? total + 25 : total,
        shippingAddress,
        paymentMethod:
          paymentMethod === 'card'
            ? `CyberCard (•••• ${cardDetails.cardNumber.slice(-4) || '8829'})`
            : paymentMethod === 'applepay'
            ? 'Apple Pay'
            : 'Crypto Web3 (USDC Sol)',
      });

      setCompletedOrder(placedOrder);
      clearCart();
      setIsSubmitting(false);
    }, 1200);
  };

  // Order Confirmation Screen
  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-[#0c101d] border border-cyan-500/40 p-8 text-center space-y-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              PAYMENT VERIFIED & ORDER QUEUED
            </span>
            <h2 className="text-3xl font-extrabold text-white">Order Confirmed!</h2>
            <p className="text-sm text-slate-300">
              Thank you, <strong className="text-white">{completedOrder.shippingAddress.fullName}</strong>. Your hardware consignment has been initialized.
            </p>
          </div>

          {/* Details Box */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Order Reference:</span>
              <span className="text-cyan-400 font-bold">{completedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Carrier Tracking:</span>
              <span className="text-purple-300 font-bold">{completedOrder.trackingNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Destination:</span>
              <span className="text-slate-200">
                {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Charged:</span>
              <span className="text-emerald-400 font-bold text-sm">${completedOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Order Items Preview */}
          <div className="text-left space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400">Dispatched Units ({completedOrder.items.length})</span>
            <div className="space-y-2">
              {completedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/30 border border-slate-800/80">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-950" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">Qty: {item.quantity} • {item.variant}</p>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentPage('account')}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-500 hover:to-cyan-500 transition-all"
            >
              View in Account Orders
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('shop')}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-200"
            >
              Back to Catalog
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Checkout Terminal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Provide delivery coordinates and complete authorized payment.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCurrentPage('cart')}
          className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </button>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Forms (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Shipping Coordinates Form */}
          <div className="rounded-2xl bg-[#0b0f19] border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs flex items-center justify-center font-bold border border-cyan-500/40">
                1
              </span>
              <h2 className="text-base font-bold text-white">Shipping & Consignment Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Full Legal Name *</label>
                <input
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  placeholder="Alex Vance"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs text-slate-200 focus:outline-none ${
                    errors.fullName ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                  }`}
                  id="checkout-fullname-input"
                />
                {errors.fullName && <p className="text-[10px] text-rose-400">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Contact Email *</label>
                <input
                  type="email"
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                  placeholder="alex.vance@neonvault.io"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs text-slate-200 focus:outline-none ${
                    errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                  }`}
                  id="checkout-email-input"
                />
                {errors.email && <p className="text-[10px] text-rose-400">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-mono text-slate-400">Phone for Courier Tracking *</label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs text-slate-200 focus:outline-none ${
                    errors.phone ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                  }`}
                  id="checkout-phone-input"
                />
                {errors.phone && <p className="text-[10px] text-rose-400">{errors.phone}</p>}
              </div>

              {/* Street Address */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-mono text-slate-400">Street Address *</label>
                <input
                  type="text"
                  value={shippingAddress.streetAddress}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                  placeholder="742 Evergreen Cyber Way"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs text-slate-200 focus:outline-none ${
                    errors.streetAddress ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                  }`}
                  id="checkout-address-input"
                />
                {errors.streetAddress && <p className="text-[10px] text-rose-400">{errors.streetAddress}</p>}
              </div>

              {/* Apt / Suite */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Apt / Suite / Unit (Optional)</label>
                <input
                  type="text"
                  value={shippingAddress.aptSuite}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, aptSuite: e.target.value })}
                  placeholder="Suite 404"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">City *</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  placeholder="Neo Tokyo"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs text-slate-200 focus:outline-none ${
                    errors.city ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                  }`}
                />
                {errors.city && <p className="text-[10px] text-rose-400">{errors.city}</p>}
              </div>

              {/* State & Postal Code */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">State / Region *</label>
                <input
                  type="text"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  placeholder="CA"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs text-slate-200 focus:outline-none ${
                    errors.state ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                  }`}
                />
                {errors.state && <p className="text-[10px] text-rose-400">{errors.state}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Postal / Zip Code *</label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  placeholder="94107"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs text-slate-200 focus:outline-none ${
                    errors.postalCode ? 'border-rose-500' : 'border-slate-800 focus:border-cyan-500'
                  }`}
                />
                {errors.postalCode && <p className="text-[10px] text-rose-400">{errors.postalCode}</p>}
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Speed */}
          <div className="rounded-2xl bg-[#0b0f19] border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs flex items-center justify-center font-bold border border-cyan-500/40">
                2
              </span>
              <h2 className="text-base font-bold text-white">Consignment Priority</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setShippingMethod('standard')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                  shippingMethod === 'standard'
                    ? 'bg-cyan-950/40 border-cyan-400 text-slate-100 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <p className="font-semibold text-xs text-white">Quantum Standard</p>
                  <p className="text-[11px] text-slate-400">3–5 Business Days</p>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div
                onClick={() => setShippingMethod('express')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                  shippingMethod === 'express'
                    ? 'bg-purple-950/40 border-purple-400 text-slate-100 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <p className="font-semibold text-xs text-white">Overnight Cyber Express</p>
                  <p className="text-[11px] text-slate-400">Next Business Morning Delivery</p>
                </div>
                <span className="text-xs font-mono font-bold text-purple-300">+$25.00</span>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method Selection (Mock) */}
          <div className="rounded-2xl bg-[#0b0f19] border border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs flex items-center justify-center font-bold border border-cyan-500/40">
                3
              </span>
              <h2 className="text-base font-bold text-white">Payment Method (Mock Authorization)</h2>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('applepay')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'applepay'
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Apple / Google Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'crypto'
                    ? 'bg-purple-950/60 border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>Web3 Crypto</span>
              </button>
            </div>

            {/* Credit Card Input Sub-form */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400">Card Number</label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                    placeholder="4242 •••• •••• 4242"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  {errors.cardNumber && <p className="text-[10px] text-rose-400">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Expiry</label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">CVC Code</label>
                    <input
                      type="text"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                      placeholder="CVC"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'applepay' && (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-300">
                <p>Biometric Touch ID / Face ID prompt will trigger upon clicking Authorize Order.</p>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-purple-300">Direct USDC / Solana Cyber Transaction</p>
                <p className="text-slate-400">Escrow smart contract address will lock the exact rate with zero slippage.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-[#0b0f19] border border-slate-800 p-6 space-y-5 sticky top-24 shadow-xl">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Summary ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
            </h2>

            {/* Preview Mini List */}
            <div className="max-h-52 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-800/60">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 pt-2">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-11 h-11 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-semibold text-slate-200 truncate">{item.product.name}</p>
                    <p className="text-slate-400 text-[11px] font-mono">
                      Qty: {item.quantity} • {item.variant}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-cyan-400">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Shipping ({shippingMethod})</span>
                <span>
                  {shippingMethod === 'express'
                    ? `$${(shipping + 25).toFixed(2)}`
                    : shipping === 0
                    ? 'FREE'
                    : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between text-lg font-bold text-white">
                <span>Total Due</span>
                <span className="text-cyan-400 font-extrabold font-mono">
                  ${(shippingMethod === 'express' ? total + 25 : total).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
              id="checkout-submit-order-btn"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Cyber Settlement...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Place Order</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulated sandbox checkout • No actual charge</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
