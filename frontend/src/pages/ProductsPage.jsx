import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, X, Inbox, SlidersHorizontal, Loader2, ArrowRight } from 'lucide-react';
import { productListRequest, productListSuccess, productListFail } from '../features/products/productSlice';
import api from '../api/AxiosAPI';

// --- Configuration ---
const CATEGORIES = [
  'All', 
  'Lehengas', 
  'Sarees', 
  'Kurtis',
  'Suits'
];

// --- Sub-components ---

// 1. Skeleton Loader
const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="space-y-4">
        <div className="aspect-[3/4] bg-stone-200 rounded-sm"></div>
        <div className="space-y-2 text-center">
          <div className="h-4 bg-stone-200 rounded w-3/4 mx-auto"></div>
          <div className="h-3 bg-stone-200 rounded w-1/4 mx-auto"></div>
        </div>
      </div>
    ))}
  </div>
);

// 2. Product Card (Inline for Style Consistency)
const ProductCard = ({ product }) => (
  <Link to={`/products/${product._id}`} className="group block">
    <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 rounded-sm mb-5">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-1000 ease-out"
          loading="lazy"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-stone-300 bg-stone-50">
            <span>No Image</span>
        </div>
      )}
      
      {/* Overlay Badge */}
      <div className="absolute top-3 left-3">
         <span className="bg-white/90 backdrop-blur text-[10px] uppercase tracking-widest font-bold px-2 py-1 text-stone-800">
            {product.category}
         </span>
      </div>

      {/* Hover Action */}
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
         <p className="text-white text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2">
            View Details <ArrowRight size={12} />
         </p>
      </div>
    </div>
    <div className="text-center">
      <h3 className="text-lg font-marcellus text-stone-900 group-hover:text-amber-700 transition-colors leading-tight mb-1">
        {product.name}
      </h3>
      <p className="text-sm font-bold text-stone-600 font-montserrat">
        ₹{product.basePrice.toFixed(2)}
      </p>
    </div>
  </Link>
);

// 3. States & Feedback
const ErrorMessage = ({ message }) => (
  <div className="flex flex-col items-center justify-center text-center bg-red-50 text-red-800 p-12 rounded-sm border border-red-100">
    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
        <X size={24} />
    </div>
    <h3 className="font-marcellus text-xl mb-2">Something went wrong</h3>
    <p className="text-sm font-light">{message}</p>
  </div>
);

const NoResults = ({ resetFilters }) => (
  <div className="text-center py-24 border border-dashed border-stone-300 rounded-sm bg-stone-50/50">
    <Inbox className="mx-auto h-12 w-12 text-stone-300 mb-4" strokeWidth={1} />
    <h3 className="font-marcellus text-2xl text-stone-800 mb-2">No Products Found</h3>
    <p className="text-stone-500 font-light mb-6">We couldn't find any matches for your specific taste.</p>
    <button 
        onClick={resetFilters}
        className="text-xs font-bold uppercase tracking-widest border-b border-stone-900 pb-1 hover:text-amber-700 hover:border-amber-700 transition-colors"
    >
        Clear All Filters
    </button>
  </div>
);

// 4. Mobile Sidebar
const MobileFilterSidebar = ({ isOpen, onClose, activeCategory, onSelectCategory }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 lg:hidden" 
        />
        <motion.div
          initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-[#FDFBF7] z-50 flex flex-col shadow-2xl"
        >
          <div className="flex items-center justify-between p-6 border-b border-stone-200">
            <h3 className="font-marcellus text-xl text-stone-900">Collections</h3>
            <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors"><X size={20} /></button>
          </div>
          <ul className="flex-1 overflow-y-auto p-6 space-y-4">
            {CATEGORIES.map(cat => (
              <li key={cat}>
                <button
                  onClick={() => { onSelectCategory(cat); onClose(); }}
                  className={`w-full text-left text-sm uppercase tracking-widest py-2 transition-colors ${
                    activeCategory === cat 
                        ? 'font-bold text-amber-700 border-l-2 border-amber-700 pl-4' 
                        : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// 5. Pagination
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center mt-16 gap-2">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1} 
        className="w-10 h-10 flex items-center justify-center border border-stone-200 text-stone-500 hover:bg-stone-100 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-transparent rounded-full transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      
      {[...Array(totalPages).keys()].map(page => (
        <button 
            key={page + 1} 
            onClick={() => onPageChange(page + 1)} 
            className={`w-10 h-10 rounded-full text-xs font-bold transition-colors ${
                currentPage === page + 1 
                    ? 'bg-stone-900 text-white' 
                    : 'text-stone-600 hover:bg-stone-100'
            }`}
        >
            {page + 1}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages} 
        className="w-10 h-10 flex items-center justify-center border border-stone-200 text-stone-500 hover:bg-stone-100 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-transparent rounded-full transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

// --- Main Page Component ---

const ProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, pages } = useSelector((state) => state.products);
  const { categoryName } = useParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');

  // Format category from URL to readable text
  const formatCategoryFromParam = (param) => {
    if (!param) return 'All';
    return param.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const fetchProducts = useCallback(async (keywordParam, pageParam, categoryParam) => {
    dispatch(productListRequest());
    try {
      const categoryToFetch = categoryParam === 'All' ? '' : categoryParam;
      const { data } = await api.get(`/products?keyword=${keywordParam}&page=${pageParam}&category=${categoryToFetch}`);
      dispatch(productListSuccess(data));
    } catch (err) {
      dispatch(productListFail(err.response?.data?.message || err.message));
    }
  }, [dispatch]);

  useEffect(() => {
    const categoryFromURL = formatCategoryFromParam(categoryName);
    setActiveCategory(categoryFromURL);
    setCurrentPage(1);
    setKeyword('');
  }, [categoryName]);

  useEffect(() => {
    fetchProducts(keyword, currentPage, activeCategory);
    window.scrollTo(0, 0);
  }, [keyword, currentPage, activeCategory, fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setKeyword(searchInput);
    if (activeCategory !== 'All') {
      setActiveCategory('All');
      navigate('/products');
    }
  };

  const handleFilter = (category) => {
    setCurrentPage(1);
    setKeyword('');
    setSearchInput('');
    const categoryPath = category === 'All' ? '' : `/category/${category.replace(/\s+/g, '-').toLowerCase()}`;
    navigate(`/products${categoryPath}`);
  };

  const handleResetFilters = () => {
      setKeyword('');
      setSearchInput('');
      handleFilter('All');
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen font-montserrat text-stone-800">
      
      <MobileFilterSidebar 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        activeCategory={activeCategory} 
        onSelectCategory={handleFilter} 
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        
        {/* --- Header & Search --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-stone-200 pb-8">
            <div className="w-full md:w-auto">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 block mb-2">
                    {activeCategory === 'All' ? 'Full Collection' : 'Curated Selection'}
                </span>
                <h1 className="text-4xl md:text-5xl font-marcellus text-stone-900">
                    {activeCategory === 'All' ? 'All Products' : activeCategory}
                </h1>
            </div>

            <div className="w-full md:w-auto flex items-center gap-4">
                <form onSubmit={handleSearch} className="relative w-full md:w-80">
                    <input 
                        type="text" 
                        value={searchInput} 
                        onChange={(e) => setSearchInput(e.target.value)} 
                        placeholder="Search collection..." 
                        className="w-full bg-white border border-stone-200 rounded-sm pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 transition-all placeholder-stone-400 font-light" 
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-700 transition-colors">
                        <Search size={18} />
                    </button>
                </form>
                
                <button 
                    onClick={() => setIsFilterOpen(true)} 
                    className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-stone-200 rounded-sm text-sm font-bold uppercase tracking-wide hover:bg-stone-50"
                >
                    <SlidersHorizontal size={16} /> Filters
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* --- DESKTOP SIDEBAR --- */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <div className="sticky top-24">
              <h3 className="font-marcellus text-xl text-stone-900 mb-6 pb-2 border-b border-stone-200">
                Categories
              </h3>
              <ul className="space-y-4">
                {CATEGORIES.map(cat => (
                  <li key={cat}>
                    <button
                      onClick={() => handleFilter(cat)}
                      className={`text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-3 w-full text-left group ${
                        activeCategory === cat 
                            ? 'font-bold text-amber-700 translate-x-2' 
                            : 'text-stone-500 hover:text-stone-900 hover:translate-x-1'
                      }`}
                    >
                      <span className={`h-[1px] bg-amber-700 transition-all duration-300 ${activeCategory === cat ? 'w-4' : 'w-0 group-hover:w-2'}`}></span>
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* --- PRODUCT GRID --- */}
          <main className="lg:col-span-9 xl:col-span-10 min-h-[50vh]">
            <AnimatePresence mode="wait">
                {loading ? (
                    <ProductGridSkeleton />
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : (products?.length || 0) === 0 ? (
                    <NoResults resetFilters={handleResetFilters} />
                ) : (
                    <motion.div 
                        key="content"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ duration: 0.5 }}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                        <Pagination 
                            currentPage={currentPage} 
                            totalPages={pages} 
                            onPageChange={setCurrentPage} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
};

export default ProductsPage;