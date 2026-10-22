import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Toast: React.FC = () => {
  const { toast } = useCart();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border glass-panel shadow-2xl backdrop-blur-xl max-w-md"
          style={{
            borderColor:
              toast.type === 'error'
                ? 'rgba(239, 68, 68, 0.4)'
                : toast.type === 'info'
                ? 'rgba(6, 182, 212, 0.4)'
                : 'rgba(168, 85, 247, 0.4)',
            boxShadow:
              toast.type === 'error'
                ? '0 0 20px rgba(239, 68, 68, 0.25)'
                : '0 0 25px rgba(6, 182, 212, 0.25)',
          }}
          id="system-notification-toast"
        >
          {toast.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-5 h-5 text-cyan-400 shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-cyan-300 shrink-0" />
          )}
          <span className="text-sm font-medium text-slate-100">{toast.text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
