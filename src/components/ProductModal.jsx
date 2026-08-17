import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProductModal({ product, onClose, darkMode }) {
  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`border rounded-2xl max-w-xl w-full p-6 relative shadow-2xl overflow-hidden ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1.5 rounded-lg border transition ${
              darkMode 
                ? 'text-slate-400 hover:text-slate-100 bg-slate-800/50 border-slate-700' 
                : 'text-slate-500 hover:text-slate-900 bg-slate-100 border-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row gap-6">
            <div className={`w-full md:w-1/2 h-56 border rounded-xl overflow-hidden ${
              darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {product.brand || 'Generic'}
                  </span>
                </div>

                <h2 className={`text-lg font-semibold mt-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {product.title}
                </h2>

                <div className="flex items-center gap-1 mt-1 text-amber-400 text-xs font-medium">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                </div>

                <p className={`text-xs leading-relaxed mt-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {product.description}
                </p>
              </div>

              <div className={`pt-4 border-t flex items-center justify-between mt-4 ${
                darkMode ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div>
                  <span className={`text-[10px] uppercase tracking-wider block ${
                    darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Price
                  </span>
                  <span className={`text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                    ${product.price}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  {product.stock > 0 ? (
                    <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                      <CheckCircle className="w-3.5 h-3.5" />
                      In Stock ({product.stock})
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-md">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}