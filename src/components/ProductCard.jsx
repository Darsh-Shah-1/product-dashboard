import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Scale, Eye, ShoppingCart, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ProductCard({ 
  product, onClick, theme, isWishlisted, onToggleWishlist, isCompared, onToggleCompare, viewMode, onAddToCart 
}) {
  const isDark = theme !== 'solar';

  const themeCardStyles = {
    obsidian: 'bg-black border-2 border-slate-700 hover:border-yellow-400',
    emerald: 'bg-[#021008] border-2 border-emerald-800 hover:border-yellow-400',
    crimson: 'bg-[#120408] border-2 border-rose-900 hover:border-yellow-400',
    solar: 'bg-white border-2 border-slate-300 hover:border-blue-600'
  };

  const currentCardStyle = themeCardStyles[theme] || themeCardStyles.obsidian;

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        className={`group rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 relative ${currentCardStyle}`}
      >
        <div className="w-full sm:w-40 h-32 rounded-xl overflow-hidden relative shrink-0 bg-slate-900 border-2 border-black">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-2 left-2 text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-600 text-white border-2 border-black">
            {product.category}
          </span>
        </div>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onClick(product)}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-yellow-400 font-black uppercase">{product.brand || 'Elite'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-amber-400 font-black flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current" /> {product.rating}
            </span>
          </div>
          <h3 className={`font-black text-base truncate ${isDark ? 'text-white group-hover:text-yellow-400' : 'text-black group-hover:text-blue-600'}`}>
            {product.title}
          </h3>
          <p className="text-xs mt-1.5 line-clamp-2 leading-relaxed text-slate-400 font-bold">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mt-3">
            <span className="text-lg font-black text-emerald-400">${product.price}</span>
            <span className={`text-xs px-2.5 py-1 rounded-lg font-black border-2 border-black flex items-center gap-1 ${
              product.stock > 5 ? 'bg-emerald-500 text-black' : 'bg-amber-400 text-black'
            }`}>
              {product.stock > 5 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {product.stock} in stock
            </span>
          </div>
        </div>

        <div className="flex sm:flex-col items-center gap-2 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="p-2.5 rounded-xl bg-blue-600 text-white font-black border-2 border-black hover:bg-blue-700 transition"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCompare(product); }}
            className={`p-2.5 rounded-xl font-black border-2 border-black transition ${
              isCompared ? 'bg-purple-600 text-white' : 'bg-yellow-400 text-black hover:bg-yellow-500'
            }`}
            title="Compare"
          >
            <Scale className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
            className={`p-2.5 rounded-xl font-black border-2 border-black transition ${
              isWishlisted ? 'bg-pink-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between relative ${currentCardStyle}`}
    >
      {/* Top Action Buttons */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleCompare(product); }}
          className={`p-2 rounded-xl font-black border-2 border-black transition shadow-md ${
            isCompared ? 'bg-purple-600 text-white' : 'bg-yellow-400 text-black hover:bg-yellow-500'
          }`}
          title="Compare"
        >
          <Scale className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
          className={`p-2 rounded-xl font-black border-2 border-black transition shadow-md ${
            isWishlisted ? 'bg-pink-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
          title="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div onClick={() => onClick(product)} className="cursor-pointer">
        <div className="h-48 overflow-hidden relative border-b-2 border-black bg-slate-950">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-600 text-white border-2 border-black">
            {product.category}
          </span>

          <div className="absolute bottom-3 left-3">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border-2 border-black ${
              product.stock > 5 ? 'bg-emerald-500 text-black' : 'bg-yellow-400 text-black'
            }`}>
              {product.stock > 5 ? `${product.stock} in stock` : `Only ${product.stock} left`}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-yellow-400 font-black uppercase">{product.brand || 'Elite'}</span>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-black bg-amber-400/20 border-2 border-amber-400 px-2 py-0.5 rounded-lg">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 className={`font-black text-base line-clamp-1 ${isDark ? 'text-white group-hover:text-yellow-400' : 'text-black group-hover:text-blue-600'}`}>
            {product.title}
          </h3>

          <p className="text-xs line-clamp-2 mt-1 text-slate-400 font-bold leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 pt-0 flex items-center justify-between border-t-2 border-inherit mt-2">
        <div>
          <span className="text-[10px] uppercase font-black text-slate-500 block">Price</span>
          <span className="text-base font-black text-emerald-400">${product.price}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="px-3 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white border-2 border-black transition flex items-center gap-1 shadow-md"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Buy
          </button>
          <button
            onClick={() => onClick(product)}
            className="px-3 py-2 rounded-xl text-xs font-black bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-black transition flex items-center gap-1 shadow-md"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </button>
        </div>
      </div>
    </motion.div>
  );
}
