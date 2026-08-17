import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Scale } from 'lucide-react';

export default function ProductCard({ 
  product, onClick, darkMode, isWishlisted, onToggleWishlist, isCompared, onToggleCompare 
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`group border rounded-xl overflow-hidden transition-colors duration-200 flex flex-col justify-between relative ${
        darkMode 
          ? 'bg-slate-950 border-slate-800 hover:border-slate-700' 
          : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
      }`}
    >
      {/* Top Action Buttons (Wishlist & Compare) */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleCompare(product); }}
          className={`p-1.5 rounded-full border backdrop-blur-md transition ${
            isCompared 
              ? 'bg-indigo-600 border-indigo-600 text-white' 
              : darkMode 
                ? 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white' 
                : 'bg-white/90 border-slate-200 text-slate-500 hover:text-slate-900'
          }`}
          title="Compare Product"
        >
          <Scale className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
          className={`p-1.5 rounded-full border backdrop-blur-md transition ${
            isWishlisted 
              ? 'bg-rose-500 border-rose-500 text-white' 
              : darkMode 
                ? 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white' 
                : 'bg-white/90 border-slate-200 text-slate-500 hover:text-slate-900'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div onClick={() => onClick(product)} className="cursor-pointer">
        <div className={`h-48 overflow-hidden relative border-b ${
          darkMode ? 'bg-slate-900/50 border-slate-800/80' : 'bg-slate-100 border-slate-100'
        }`}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className={`absolute top-3 left-3 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border backdrop-blur-md ${
            darkMode 
              ? 'bg-slate-950/80 border-slate-800 text-slate-300' 
              : 'bg-white/90 border-slate-200 text-slate-700'
          }`}>
            {product.category}
          </span>
        </div>

        <div className="p-4">
          <h3 className={`font-medium text-sm line-clamp-1 transition-colors ${
            darkMode ? 'text-slate-100 group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'
          }`}>
            {product.title}
          </h3>
          <p className={`text-xs line-clamp-2 mt-1 leading-relaxed ${
            darkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {product.description}
          </p>
        </div>
      </div>

      <div className={`px-4 pb-4 pt-0 flex items-center justify-between border-t mt-2 ${
        darkMode ? 'border-slate-900/60' : 'border-slate-100'
      }`}>
        <span className={`text-base font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          ${product.price}
        </span>
        <div className="flex items-center gap-1 text-amber-400 text-xs font-medium bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md">
          <Star className="w-3 h-3 fill-current" />
          <span>{product.rating}</span>
        </div>
      </div>
    </motion.div>
  );
}