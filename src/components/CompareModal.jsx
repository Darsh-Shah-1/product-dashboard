import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, Star, CheckCircle } from 'lucide-react';

export default function CompareModal({ isOpen, onClose, compareItems, onRemove, theme }) {
  if (!isOpen || compareItems.length === 0) return null;

  const isDark = theme !== 'solar';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`border-4 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl ${
            isDark ? 'bg-slate-900 border-purple-500 text-white' : 'bg-white border-blue-600 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between pb-4 mb-6 border-b-4 border-inherit">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-600 text-white font-black border-2 border-black">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-wide">Product Comparison Matrix</h2>
                <p className="text-xs text-slate-400 font-bold">Comparing {compareItems.length} of 3 items side-by-side</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-red-600 text-white font-black border-2 border-black hover:bg-red-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {compareItems.map((item) => (
              <div
                key={item.id}
                className={`border-2 rounded-2xl p-4 flex flex-col justify-between relative ${
                  isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                }`}
              >
                <button
                  onClick={() => onRemove(item)}
                  className="absolute top-3 right-3 p-1.5 rounded-xl bg-red-600 text-white font-black border-2 border-black hover:bg-red-700 transition"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>

                <div>
                  <div className="h-40 rounded-xl overflow-hidden mb-4 border-2 border-black bg-black">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-blue-600 text-white border-2 border-black">
                    {item.category}
                  </span>
                  <h3 className="font-black text-sm mt-2 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1 line-clamp-3 leading-relaxed">{item.description}</p>
                </div>

                <div className="space-y-3 pt-4 mt-4 border-t-2 border-inherit text-xs font-bold">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Price</span>
                    <span className="font-black text-base text-emerald-400">${item.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Rating</span>
                    <span className="flex items-center gap-1 text-amber-400 font-black">
                      <Star className="w-3.5 h-3.5 fill-current" /> {item.rating}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Brand</span>
                    <span className="font-black">{item.brand || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Stock</span>
                    <span className={`font-black flex items-center gap-1 ${item.stock > 5 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      <CheckCircle className="w-3.5 h-3.5" /> {item.stock} units
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
