import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './components/ProductCard';
import SkeletonCard from './components/SkeletonCard';
import ProductModal from './components/ProductModal';
import { 
  Search, SlidersHorizontal, PackageX, Sun, Moon, 
  Heart, ArrowUpDown, Scale, X, Star, CheckCircle, AlertCircle 
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
  const [quickFilter, setQuickFilter] = useState('all'); // 'all', 'under50', 'topRated', 'wishlist'
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Dark/Light Mode
  const [darkMode, setDarkMode] = useState(true);

  // LocalStorage Wishlist
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('app_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Comparison State (Max 3 items)
  const [compareItems, setCompareItems] = useState([]);

  useEffect(() => {
    localStorage.setItem('app_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => 
      prev.some((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product]
    );
  };

  const toggleCompare = (product) => {
    setCompareItems((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id);
      }
      if (prev.length >= 3) return prev; // Limit to 3 items
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

  // Filter & Sort Logic
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

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
      darkMode ? 'bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white' : 'bg-slate-50 text-slate-800 selection:bg-indigo-600 selection:text-white'
    }`}>
      {/* Navbar */}
      <header className={`border-b sticky top-0 z-30 transition-colors duration-300 ${
        darkMode ? 'border-slate-800 bg-slate-950/80 backdrop-blur-md' : 'border-slate-200 bg-white/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm shadow-indigo-500/20">
                P
              </div>
              <span className={`font-semibold text-base tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                Catalog Engine
              </span>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`md:hidden p-2 rounded-lg border transition ${
                darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Search, Sort & Category Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className={`w-full border rounded-lg pl-10 pr-4 py-2 text-sm transition focus:outline-none focus:border-indigo-500 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="relative w-full sm:w-48">
              <SlidersHorizontal className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className={`w-full border rounded-lg pl-10 pr-8 py-2 text-sm appearance-none cursor-pointer transition focus:outline-none focus:border-indigo-500 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-900'
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
                className={`w-full border rounded-lg pl-10 pr-6 py-2 text-sm appearance-none cursor-pointer transition focus:outline-none focus:border-indigo-500 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="default">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition ${
                darkMode ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="max-w-7xl mx-auto px-6 pb-3 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Products' },
            { id: 'under50', label: 'Under $50' },
            { id: 'topRated', label: '★ 4.5+ Rated' },
            { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})` },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => { setQuickFilter(pill.id); setPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                quickFilter === pill.id
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : darkMode 
                    ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 pb-32">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className={`py-24 text-center border border-dashed rounded-2xl ${
            darkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-300 bg-white/60'
          }`}>
            <PackageX className="w-10 h-10 text-slate-400 mx-auto mb-3 stroke-1" />
            <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              No products matching criteria
            </p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {paginatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={setSelectedProduct}
                  darkMode={darkMode}
                  isWishlisted={wishlist.some((item) => item.id === p.id)}
                  onToggleWishlist={toggleWishlist}
                  isCompared={compareItems.some((item) => item.id === p.id)}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer Pagination */}
        {!loading && totalPages > 1 && (
          <div className={`mt-12 pt-6 border-t flex items-center justify-between text-sm ${
            darkMode ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Page <strong className={darkMode ? 'text-slate-200' : 'text-slate-900'}>{page}</strong> of <strong className={darkMode ? 'text-slate-200' : 'text-slate-900'}>{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={`px-3.5 py-1.5 border rounded-lg text-xs font-medium transition disabled:opacity-40 ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={`px-3.5 py-1.5 border rounded-lg text-xs font-medium transition disabled:opacity-40 ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Comparison Drawer */}
      <AnimatePresence>
        {compareItems.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`fixed bottom-0 inset-x-0 border-t z-40 p-4 shadow-2xl backdrop-blur-lg ${
              darkMode ? 'bg-slate-950/90 border-slate-800 text-slate-100' : 'bg-white/90 border-slate-200 text-slate-900'
            }`}
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-semibold">Comparing ({compareItems.length}/3)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
                {compareItems.map((item) => (
                  <div key={item.id} className={`p-2.5 rounded-lg border flex items-center gap-3 relative ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <button
                      onClick={() => toggleCompare(item)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <img src={item.thumbnail} alt={item.title} className="w-10 h-10 object-cover rounded" />
                    <div className="text-xs">
                      <p className="font-semibold line-clamp-1">{item.title}</p>
                      <p className="text-indigo-400 font-bold">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCompareItems([])}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} darkMode={darkMode} />
    </div>
  );
}