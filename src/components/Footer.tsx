import React, { useState } from 'react';
import { PageView } from '../types';
import {
  Zap,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Cpu,
  ArrowRight,
  CheckCircle,
  Github,
  Twitter,
  Disc,
} from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: PageView) => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, onSelectCategory }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#05070c] relative overflow-hidden text-slate-400 mt-20">
      {/* Subtle top neon ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

      {/* Trust & Guarantee Banner */}
      <div className="border-b border-slate-800/60 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Global Quantum Express</h4>
              <p className="text-xs text-slate-400 mt-0.5">Free expedited shipping on orders over $150</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">2-Year Titan Warranty</h4>
              <p className="text-xs text-slate-400 mt-0.5">Instant zero-friction hardware replacements</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">30-Day Risk-Free Trial</h4>
              <p className="text-xs text-slate-400 mt-0.5">Prepaid return labels on all cyberware</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Neural Support Terminal</h4>
              <p className="text-xs text-slate-400 mt-0.5">24/7 technical telemetry & engineer dispatch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="tracking-wider text-xl font-extrabold leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">NEON</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">VAULT</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Curating tomorrow&apos;s cybernetic hardware, spatial audio instruments, tactile inputs, and quantum-grade peripherals for engineers, gamers, and digital nomads.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#twitter"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                title="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#github"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#discord"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                title="Discord"
              >
                <Disc className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-200">
              Hardware Sectors
            </h4>
            <ul className="space-y-2 text-sm">
              {['Audio & Sound', 'Keyboards & Inputs', 'Displays & Optics', 'Wearables & Gear', 'Power & Storage'].map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat)}
                    className="hover:text-cyan-300 transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-200">
              Operations
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentPage('shop')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Full Catalog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentPage('cart')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Shopping Cart
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentPage('account')}
                  className="hover:text-purple-300 transition-colors"
                >
                  User Portal & Orders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentPage('checkout')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Express Checkout
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-200">
              Cyber Dispatch
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe for early drops, secret firmware releases, and VIP discount coupons.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Encrypted transmission confirmed. Welcome to the Vault.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2" id="newsletter-form">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@cybernet.io"
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                    id="newsletter-email-input"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 transition-all shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    title="Subscribe"
                    id="newsletter-submit-btn"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {error && <p className="text-[11px] text-rose-400 font-mono">{error}</p>}
                <p className="text-[11px] text-slate-500">
                  Zero spam. Unsubscribe anytime via one-click terminal signal.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright & payment security */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© 2026 NeonVault Technologies Corp. All neural rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Protocol Privacy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Cert</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
