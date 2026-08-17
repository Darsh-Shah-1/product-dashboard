import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, CheckCircle, CreditCard } from 'lucide-react';

export default function CartModal({ isOpen, onClose, cart, onUpdateQuantity, onRemove, onClearCart, theme }) {
  const [checkedOut, setCheckedOut] = useState(false);

  if (!isOpen) return null;

  const isDark = theme !== 'solar';

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const handleCheckout = () => {
    setCheckedOut(true);
    setTimeout(() => {
      setCheckedOut(false);
      onClearCart();
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`border-4 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col relative shadow-2xl ${
            isDark ? 'bg-slate-900 border-blue-500 text-white' : 'bg-white border-blue-600 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b-4 border-inherit flex items-center justify-between bg-blue-600 text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-yellow-400 text-black font-black border-2 border-black">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-wide">Shopping Cart</h2>
                <p className="text-xs text-blue-100 font-bold">{cart.reduce((a, c) => a + c.quantity, 0)} items in bag</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-red-600 text-white font-black border-2 border-black hover:bg-red-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {checkedOut ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500 text-black rounded-full flex items-center justify-center mx-auto border-4 border-black">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-emerald-400 uppercase">Order Placed Successfully!</h3>
                <p className="text-xs text-slate-400 font-bold">Thank you for your purchase. Your items are being prepared.</p>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <ShoppingBag className="w-16 h-16 text-slate-500 mx-auto stroke-2" />
                <p className="text-lg font-black uppercase text-slate-400">Your cart is empty</p>
                <p className="text-xs text-slate-500 font-bold">Add items from the catalog to start shopping.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className={`border-2 rounded-2xl p-4 flex items-center gap-4 ${
                    isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded-xl border-2 border-black shrink-0 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-sm truncate">{item.product.title}</h4>
                    <p className="text-xs text-emerald-400 font-black mt-0.5">${item.product.price} each</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-yellow-400 text-black font-black border-2 border-black flex items-center justify-center hover:bg-yellow-500 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-yellow-400 text-black font-black border-2 border-black flex items-center justify-center hover:bg-yellow-500 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemove(item.product.id)}
                    className="p-2 rounded-xl bg-red-600 text-white font-black border-2 border-black hover:bg-red-700 transition shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {!checkedOut && cart.length > 0 && (
            <div className={`p-6 border-t-4 border-inherit space-y-4 ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
              <div className="space-y-1.5 text-xs font-bold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black pt-2 border-t-2 border-dashed border-slate-600">
                  <span>Total</span>
                  <span className="text-emerald-400">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClearCart}
                  className="px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs border-2 border-black transition uppercase tracking-wider"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-sm border-2 border-black transition uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <CreditCard className="w-4 h-4" /> Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
