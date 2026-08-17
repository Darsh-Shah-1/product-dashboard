import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './components/ProductCard';
import SkeletonCard from './components/SkeletonCard';
import ProductModal from './components/ProductModal';
import CompareModal from './components/CompareModal';
import CartModal from './components/CartModal';
import { 
  Search, SlidersHorizontal, PackageX, 
  ArrowUpDown, Scale, LayoutGrid, List,
  ShoppingBag, Zap, DollarSign, Star, Shield, CheckCircle2
} from 'lucide-react';

const LIMIT = 12;
const BASE_URL = 'https://dummyjson.com/products';

const NON_VEG_KEYWORDS = [
  'pork', 'beef', 'chicken', 'fish', 'meat', 'seafood', 'bacon', 
  'sausage', 'lamb', 'steak', 'turkey', 'tuna', 'salmon', 'shrimp',
  'crab', 'lobster', 'anchovy', 'pepperoni', 'salami', 'ham', 'mutton'
];

const KEYWORD_MAP = {
  groceries: ['groceries', 'food', 'snack', 'drink', 'beverage', 'fruit', 'vegetable'],
  tech: ['smartphones', 'laptops', 'mobile-accessories', 'tablets'],
  fashion: ['mens-shirts', 'mens-shoes', 'womens-dresses', 'womens-shoes', 'tops', 'bags'],
  beauty: ['beauty', 'skin-care', 'fragrances']
};

const formatCategoryName = (name) => {
  if (!name) return '';
  return name.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [quickFilter, setQuickFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // UI Customizations (NO GRADIENTS, SOLID COLORS)
  const [theme, setTheme] = useState('obsidian'); // obsidian, emerald, crimson, solar
  const [gridCols, setGridCols] = useState(4);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // LocalStorage Wishlist & Cart
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('app_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('app_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Comparison State (Max 3 items)
  const [compareItems, setCompareItems] = useState([]);

  useEffect(() => {
    localStorage.setItem('app_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('app_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart Functions
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added "${product.title}" to Cart!`);
    setIsCartOpen(true); // Automatically open cart so user sees it instantly!
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((item) => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast(`Removed item from cart`);
  };

  const clearCart = () => {
    setCart([]);
    showToast(`Cart cleared`);
  };

  // Wishlist & Compare
  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed from Wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Added to Wishlist!`);
    }
  };

  const toggleCompare = (product) => {
    setCompareItems((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        showToast(`Removed from comparison`);
        return prev.filter((item) => item.id !== product.id);
      }
      if (prev.length >= 3) {
        showToast(`Comparison matrix full (Max 3)`);
        return prev;
      }
      showToast(`Added to comparison`);
      return [...prev, product];
    });
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      setError(null);
      try {
        const catRes = await fetch(`${BASE_URL}/categories`);
        if (!catRes.ok) throw new Error('Failed to load categories');
        const catData = await catRes.json();
        const cleanCats = catData.map((c) => (typeof c === 'object' ? c.slug || c.name : c));
        setCategories(cleanCats);

        const prodRes = await fetch(`${BASE_URL}?limit=0`);
        if (!prodRes.ok) throw new Error('Failed to load products');
        const prodData = await prodRes.json();

        const filtered = prodData.products.filter((p) => {
          const textToSearch = `${p.title || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase();
          return !NON_VEG_KEYWORDS.some((kw) => textToSearch.includes(kw));
        });

        setAllProducts(filtered);
      } catch (err) {
        setError(err.message || 'Unable to connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // Filter & Search Logic
  const filteredProducts = allProducts.filter((p) => {
    const q = search.trim().toLowerCase();
    
    let matchesSearch = true;
    if (q) {
      const directMatch = 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      const aliasMatch = Object.entries(KEYWORD_MAP).some(([key, keywords]) => {
        if (q.includes(key) || keywords.some((kw) => kw.includes(q))) {
          return p.category.toLowerCase().includes(key) || keywords.includes(p.category.toLowerCase());
        }
        return false;
      });

      matchesSearch = directMatch || aliasMatch;
    }

    const matchesCategory = category ? p.category.toLowerCase() === category.toLowerCase() : true;

    let matchesQuickFilter = true;
    if (quickFilter === 'under50') matchesQuickFilter = p.price <= 50;
    if (quickFilter === 'topRated') matchesQuickFilter = p.rating >= 4.5;
    if (quickFilter === 'wishlist') matchesQuickFilter = wishlist.some((item) => item.id === p.id);
    if (quickFilter === 'inStock') matchesQuickFilter = p.stock > 5;

    return matchesSearch && matchesCategory && matchesQuickFilter;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / LIMIT) || 1;
  const startIndex = (page - 1) * LIMIT;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + LIMIT);

  const gridColsClass = 
    gridCols === 2 ? 'lg:grid-cols-2' : 
    gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';

  const isDark = theme !== 'solar';

  // Theme Styling Classes (SOLID COLORS, NO GRADIENTS)
  const themeBg = {
    obsidian: 'bg-[#05060a] text-slate-100',
    emerald: 'bg-[#020b08] text-emerald-50',
    crimson: 'bg-[#0d0306] text-rose-50',
    solar: 'bg-slate-100 text-slate-900'
  }[theme];

  const headerBg = {
    obsidian: 'bg-[#0b0e17] border-b-4 border-slate-800',
    emerald: 'bg-[#04130e] border-b-4 border-emerald-900',
    crimson: 'bg-[#14050a] border-b-4 border-rose-950',
    solar: 'bg-white border-b-4 border-slate-300'
  }[theme];

  const avgPrice = allProducts.length ? Math.round(allProducts.reduce((acc, p) => acc + p.price, 0) / allProducts.length) : 0;
  const avgRating = allProducts.length ? (allProducts.reduce((acc, p) => acc + p.rating, 0) / allProducts.length).toFixed(1) : 0;
  const totalStockItems = allProducts.filter(p => p.stock > 0).length;
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className={`min-h-screen font-sans antialiased relative ${themeBg}`}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-yellow-400 text-black px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-black border-2 border-black"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Persistent Cart Button (Guaranteed Access) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white font-black px-5 py-4 rounded-2xl border-4 border-black shadow-2xl flex items-center gap-3 cursor-pointer"
      >
        <ShoppingBag className="w-6 h-6 text-yellow-400" />
        <span className="text-sm uppercase tracking-wide">Cart</span>
        <span className="bg-yellow-400 text-black text-xs px-2.5 py-1 rounded-xl font-black border-2 border-black">
          {totalCartCount}
        </span>
      </motion.button>

      {/* Disclaimer Banner */}
      <div className="bg-yellow-400 text-black text-center text-xs font-black py-2 px-4 border-b-4 border-black uppercase tracking-wider">
        ⚠️ Disclaimer: This is a test site. Nothing real is being sold and no money is being taken.
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-40 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white border-2 border-black shadow-md">
                Ω
              </div>
              <div>
                <span className="font-black text-base tracking-tight block">
                  NEXUS <span className="text-yellow-400">MARKET</span>
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">
                  Solid Color Edition
                </span>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalog... (/)"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className={`w-full border-2 rounded-xl pl-10 pr-4 py-2 text-xs font-bold transition focus:outline-none focus:border-yellow-400 ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full sm:w-44">
              <SlidersHorizontal className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className={`w-full border-2 rounded-xl pl-10 pr-8 py-2 text-xs font-bold appearance-none cursor-pointer transition focus:outline-none focus:border-yellow-400 ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{formatCategoryName(cat)}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-40">
              <ArrowUpDown className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full border-2 rounded-xl pl-10 pr-6 py-2 text-xs font-bold appearance-none cursor-pointer transition focus:outline-none focus:border-yellow-400 ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="default">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>

            {/* Theme Selector Desktop */}
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className={`text-xs px-3 py-2 rounded-xl border-2 cursor-pointer font-black ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="obsidian">⚡ Obsidian</option>
              <option value="emerald">💎 Emerald</option>
              <option value="crimson">🔥 Crimson</option>
              <option value="solar">☀️ Solar</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pills & Compare Button */}
        <div className="max-w-7xl mx-auto px-6 pb-3 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Catalog' },
              { id: 'under50', label: 'Under $50' },
              { id: 'topRated', label: '★ 4.5+ Rated' },
              { id: 'inStock', label: 'In Stock' },
              { id: 'wishlist', label: `❤️ Wishlist (${wishlist.length})` },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => { setQuickFilter(pill.id); setPage(1); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition border-2 border-black ${
                  quickFilter === pill.id
                    ? 'bg-yellow-400 text-black shadow-md'
                    : isDark ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-800 hover:bg-slate-100'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {compareItems.length > 0 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-1.5 rounded-xl text-xs font-black bg-purple-600 text-white border-2 border-black hover:bg-purple-700 transition flex items-center gap-2 whitespace-nowrap shadow-md"
            >
              <Scale className="w-3.5 h-3.5" />
              Compare Matrix ({compareItems.length}/3)
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 pb-32 relative z-10">
        
        {/* Bento KPI Stats Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`border-2 rounded-2xl p-4 flex items-center gap-4 ${
            isDark ? 'bg-black border-slate-800' : 'bg-white border-slate-300 shadow-sm'
          }`}>
            <div className="p-3 rounded-xl bg-blue-600 text-white border-2 border-black">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-slate-400">Total Products</span>
              <p className="text-lg font-black">{allProducts.length}</p>
            </div>
          </div>

          <div className={`border-2 rounded-2xl p-4 flex items-center gap-4 ${
            isDark ? 'bg-black border-slate-800' : 'bg-white border-slate-300 shadow-sm'
          }`}>
            <div className="p-3 rounded-xl bg-emerald-500 text-black border-2 border-black">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-slate-400">Average Price</span>
              <p className="text-lg font-black text-emerald-400">${avgPrice}</p>
            </div>
          </div>

          <div className={`border-2 rounded-2xl p-4 flex items-center gap-4 ${
            isDark ? 'bg-black border-slate-800' : 'bg-white border-slate-300 shadow-sm'
          }`}>
            <div className="p-3 rounded-xl bg-yellow-400 text-black border-2 border-black">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-slate-400">Avg Rating</span>
              <p className="text-lg font-black text-yellow-400">★ {avgRating}</p>
            </div>
          </div>

          <div className={`border-2 rounded-2xl p-4 flex items-center gap-4 ${
            isDark ? 'bg-black border-slate-800' : 'bg-white border-slate-300 shadow-sm'
          }`}>
            <div className="p-3 rounded-xl bg-purple-600 text-white border-2 border-black">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-slate-400">In Stock Items</span>
              <p className="text-lg font-black text-purple-400">{totalStockItems}</p>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(search || category || quickFilter !== 'all') && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-slate-400 font-bold">Active Filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-blue-600 text-white border-2 border-black">
                Search: "{search}"
                <button onClick={() => setSearch('')} className="hover:text-yellow-300">×</button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-blue-600 text-white border-2 border-black">
                Category: {formatCategoryName(category)}
                <button onClick={() => setCategory('')} className="hover:text-yellow-300">×</button>
              </span>
            )}
            <button
              onClick={() => { setSearch(''); setCategory(''); setQuickFilter('all'); }}
              className="text-xs text-yellow-400 hover:underline ml-2 font-black"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Product Grid / List */}
        {loading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${gridColsClass}` : 'grid-cols-1'}`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} theme={theme} />
            ))}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className={`py-24 text-center border-4 border-dashed rounded-3xl ${
            isDark ? 'border-slate-800 bg-black' : 'border-slate-300 bg-white'
          }`}>
            <PackageX className="w-12 h-12 text-slate-500 mx-auto mb-3 stroke-2" />
            <p className="text-sm font-black text-slate-300 uppercase">
              No products found matching your criteria
            </p>
            <p className="text-xs text-slate-500 font-bold mt-1">Try resetting your filters or search query.</p>
          </div>
        ) : (
          <motion.div layout className={`grid gap-6 ${viewMode === 'grid' ? `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${gridColsClass}` : 'grid-cols-1'}`}>
            <AnimatePresence>
              {paginatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={setSelectedProduct}
                  theme={theme}
                  isWishlisted={wishlist.some((item) => item.id === p.id)}
                  onToggleWishlist={toggleWishlist}
                  isCompared={compareItems.some((item) => item.id === p.id)}
                  onToggleCompare={toggleCompare}
                  viewMode={viewMode}
                  onAddToCart={addToCart}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className={`mt-12 pt-6 border-t-4 border-inherit flex items-center justify-between text-sm`}>
            <span className="text-xs font-black text-slate-400 uppercase">
              Page <strong className="text-yellow-400">{page}</strong> of <strong className="text-yellow-400">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white border-2 border-black transition disabled:opacity-40 uppercase tracking-wider shadow-md"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white border-2 border-black transition disabled:opacity-40 uppercase tracking-wider shadow-md"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} theme={theme} onAddToCart={addToCart} />
      <CompareModal 
        isOpen={isCompareModalOpen} 
        onClose={() => setIsCompareModalOpen(false)} 
        compareItems={compareItems} 
        onRemove={toggleCompare}
        theme={theme}
      />
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onUpdateQuantity={updateCartQuantity} 
        onRemove={removeFromCart} 
        onClearCart={clearCart} 
        theme={theme} 
      />
    </div>
  );
}
