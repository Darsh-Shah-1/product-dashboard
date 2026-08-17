import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, CheckCircle, AlertCircle, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';

export default function ProductModal({ product, onClose, theme, onAddToCart }) {
  const [added, setAdded] = useState(false);
  if (!product) return null;

  const isDark = theme !== 'solar';

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`border-4 rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl overflow-hidden ${
            isDark ? 'bg-slate-900 border-yellow-400 text-white' : 'bg-white border-blue-600 text-slate-900'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-red-600 text-white font-black border-2 border-black hover:bg-red-700 transition z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row gap-6 pt-2">
            <div className="w-full md:w-1/2 h-64 rounded-2xl overflow-hidden relative border-4 border-black bg-black">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 text-[10px] font-black uppercase bg-blue-600 text-white px-2.5 py-1 rounded-lg border-2 border-black">
                {product.category}
              </span>
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between pr-0 md:pr-8">
              <div>
                <div className="flex items-center justify-between pr-10 md:pr-0">
                  <span className="text-xs font-black uppercase text-yellow-400">
                    {product.brand || 'Elite Series'}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-black bg-amber-400/20 border-2 border-amber-400 px-2 py-0.5 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                <h2 className="text-xl font-black mt-2 leading-tight">
                  {product.title}
                </h2>

                <p className="text-xs font-bold leading-relaxed mt-2 text-slate-400">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t-2 border-inherit text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>1 Yr Warranty</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Truck className="w-4 h-4 text-blue-400" />
                    <span>Express Shipping</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-inherit mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 block">Price</span>
                    <span className="text-2xl font-black text-emerald-400">${product.price}</span>
                  </div>

                  <div>
                    {product.stock > 0 ? (
                      <span className="flex items-center gap-1 text-black bg-emerald-500 border-2 border-black px-3 py-1 rounded-xl text-xs font-black">
                        <CheckCircle className="w-3.5 h-3.5" />
                        In Stock ({product.stock})
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-white bg-red-600 border-2 border-black px-3 py-1 rounded-xl text-xs font-black">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={product.stock === 0}
                  className={`w-full py-3 rounded-xl font-black text-xs border-2 border-black transition uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 ${
                    added ? 'bg-emerald-500 text-black' : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
