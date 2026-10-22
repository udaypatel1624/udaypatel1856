import React, { useState } from 'react';
import { PageView, UserOrder, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  User,
  Package,
  Settings,
  LogOut,
  LogIn,
  CheckCircle2,
  Clock,
  Truck,
  ChevronRight,
  Shield,
  Save,
  Eye,
  KeyRound,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AccountPageProps {
  setCurrentPage: (page: PageView) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ setCurrentPage }) => {
  const { user, isLoggedIn, orders, login, signup, logout, updateProfile } = useAuth();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState<UserOrder | null>(null);

  // Login / Signup Form State
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Profile Form State
  const [profileForm, setProfileForm] = useState<UserProfile>(
    user || {
      id: 'demo',
      fullName: '',
      email: '',
      phone: '',
      avatarUrl: '',
      joinedDate: '2026',
      defaultAddress: {
        fullName: '',
        email: '',
        phone: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States',
      },
    }
  );

  React.useEffect(() => {
    if (user) {
      setProfileForm(user);
    }
  }, [user]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    if (authMode === 'login') {
      login(emailInput);
      showToast(`Welcome back, ${emailInput.split('@')[0]}!`, 'success');
    } else {
      signup(emailInput, nameInput || 'Cyber User');
      showToast(`Account created for ${nameInput || emailInput}!`, 'success');
    }
  };

  const handleDemoLogin = () => {
    login('alex.vance@neonvault.io', 'Alex Vance');
    showToast('Signed in as Alex Vance (Verified Cyberware Collector)', 'success');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: profileForm.fullName,
      email: profileForm.email,
      phone: profileForm.phone,
      defaultAddress: profileForm.defaultAddress,
    });
    showToast('Profile coordinates updated successfully', 'success');
  };

  // If not logged in, render the Login / Signup panel
  if (!isLoggedIn || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="rounded-3xl bg-[#0c101d] border border-cyan-500/30 p-8 space-y-6 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px] mx-auto">
              <div className="w-full h-full bg-[#090d16] rounded-[15px] flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              {authMode === 'login' ? 'Access Cyber Terminal' : 'Join NeonVault'}
            </h1>
            <p className="text-xs text-slate-400">
              {authMode === 'login'
                ? 'Sign in to access order logs, warranty certificates, and tracking.'
                : 'Create an encrypted profile for rapid orders and VIP pricing.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Email Address</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="user@cyberware.io"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Security Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              {authMode === 'login' ? 'Sign In to Account' : 'Initialize New Account'}
            </button>
          </form>

          {/* Switch mode */}
          <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4 space-y-3">
            <p>
              {authMode === 'login' ? "Don't have an account yet?" : 'Already verified?'}
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="ml-2 text-cyan-400 font-semibold hover:underline"
              >
                {authMode === 'login' ? 'Create one now' : 'Sign in here'}
              </button>
            </p>

            {/* Quick 1-Click Demo Login Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-cyan-500/50 bg-cyan-950/20 text-cyan-300 text-xs font-mono hover:bg-cyan-950/40 transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>1-Click Test Login (Alex Vance)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Account Profile Header Bar */}
      <div className="p-6 rounded-2xl bg-[#0b0f19] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-4">
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{user.fullName}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PRO OPERATOR
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{user.email}</p>
            <p className="text-[11px] text-slate-500">Member since {user.joinedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setCurrentPage('shop')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300"
          >
            Visit Shop
          </button>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-rose-500 text-rose-400 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Order History vs Profile Settings) */}
      <div className="flex items-center gap-3 border-b border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'profile'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* Tab 1: Order History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0b0f19] border border-slate-800 space-y-3">
              <Package className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Order Transmissions Found</h3>
              <p className="text-xs text-slate-400">
                You haven&apos;t completed any equipment purchases yet.
              </p>
              <button
                type="button"
                onClick={() => setCurrentPage('shop')}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-600 text-white hover:bg-cyan-500"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl bg-[#0b0f19] border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-cyan-400 text-sm">
                      {order.orderNumber}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{order.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {order.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedOrderReceipt(order)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>

                {/* Items preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-950 shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-semibold text-slate-200 truncate">{item.name}</p>
                        <p className="text-slate-400 text-[11px] font-mono">
                          Qty {item.quantity} • {item.variant}
                        </p>
                        <p className="font-mono text-cyan-300 font-bold mt-0.5">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer details */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Tracking: {order.trackingNumber || 'NV-TRK-PENDING'}</span>
                  </div>
                  <div>
                    <span>Total: </span>
                    <strong className="text-white text-sm font-bold">${order.total.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Profile Settings */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6 max-w-3xl">
          <div className="rounded-2xl bg-[#0b0f19] border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Personal Information & Contacts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Full Legal Name</label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Contact Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-mono text-slate-400">Courier Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Default Shipping Address */}
          <div className="rounded-2xl bg-[#0b0f19] border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Default Consignment Destination
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-mono text-slate-400">Street Address</label>
                <input
                  type="text"
                  value={profileForm.defaultAddress.streetAddress}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      defaultAddress: { ...profileForm.defaultAddress, streetAddress: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">City</label>
                <input
                  type="text"
                  value={profileForm.defaultAddress.city}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      defaultAddress: { ...profileForm.defaultAddress, city: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">State / Region</label>
                <input
                  type="text"
                  value={profileForm.defaultAddress.state}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      defaultAddress: { ...profileForm.defaultAddress, state: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Postal / Zip Code</label>
                <input
                  type="text"
                  value={profileForm.defaultAddress.postalCode}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      defaultAddress: { ...profileForm.defaultAddress, postalCode: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400">Country</label>
                <input
                  type="text"
                  value={profileForm.defaultAddress.country}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      defaultAddress: { ...profileForm.defaultAddress, country: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Coordinates</span>
          </button>
        </form>
      )}

      {/* Receipt Modal */}
      <AnimatePresence>
        {selectedOrderReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderReceipt(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#0c101d] border border-cyan-500/40 p-6 space-y-5 z-10 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-white text-base">
                  Consignment #{selectedOrderReceipt.orderNumber}
                </span>
                <button
                  onClick={() => setSelectedOrderReceipt(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order Date:</span>
                  <span className="text-slate-200">{selectedOrderReceipt.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-cyan-300 font-bold">{selectedOrderReceipt.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Carrier Waybill:</span>
                  <span className="text-purple-300">{selectedOrderReceipt.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Settlement Method:</span>
                  <span className="text-slate-200">{selectedOrderReceipt.paymentMethod}</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 border-t border-slate-800 pt-3">
                <span className="text-xs font-mono text-slate-400 uppercase">Purchased Items:</span>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {selectedOrderReceipt.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60">
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">Qty: {item.quantity} • {item.variant}</p>
                      </div>
                      <span className="font-mono font-bold text-cyan-400">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total breakdown */}
              <div className="border-t border-slate-800 pt-3 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span>${selectedOrderReceipt.subtotal.toFixed(2)}</span>
                </div>
                {selectedOrderReceipt.discount > 0 && (
                  <div className="flex justify-between text-cyan-400">
                    <span>Discount:</span>
                    <span>-${selectedOrderReceipt.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Shipping:</span>
                  <span>{selectedOrderReceipt.shipping === 0 ? 'FREE' : `$${selectedOrderReceipt.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax:</span>
                  <span>${selectedOrderReceipt.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Final Total:</span>
                  <span className="text-cyan-400 font-extrabold">${selectedOrderReceipt.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrderReceipt(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white"
              >
                Close Receipt
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
