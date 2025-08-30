import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, X, Inbox, SlidersHorizontal } from 'lucide-react';
import { productListRequest, productListSuccess, productListFail } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import api from '../api/AxiosAPI';

const categories = ['All', 'Suits', 'Blazers', 'Shirts', 'Kurtas', 'Polo T-Shirts', 'Indo Western', 'Wedding', 'Formal'];


const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12 animate-pulse">
    {[...Array(9)].map((_, i) => (
      <div key={i} className="space-y-3">
        <div className="aspect-[3/4] bg-zinc-200 rounded-lg"></div>
        <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
        <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="flex flex-col items-center justify-center text-center bg-red-50 text-red-700 p-8 rounded-lg border border-red-200">
    <X className="w-12 h-12 mb-4" />
    <h3 className="text-lg font-semibold">An Error Occurred</h3>
    <p className="text-sm">{message}</p>
  </div>
);

const NoResults = () => (
  <div className="text-center py-20 bg-zinc-100/50 rounded-lg">
    <Inbox className="mx-auto h-16 w-16 text-zinc-400" strokeWidth={1.5} />
    <h3 className="mt-4 text-xl font-semibold text-zinc-800">No Products Found</h3>
    <p className="mt-1 text-zinc-500">Try adjusting your search or filters.</p>
  </div>
);

const MobileFilterSidebar = ({ isOpen, onClose, categories, activeCategory, onSelectCategory }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
        <motion.div
          initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-full w-full max-w-xs bg-white z-50 flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-lg">Categories</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100"><X className="h-5 w-5" /></button>
          </div>
          <ul className="overflow-y-auto p-2 flex-1">
            {categories.map(cat => (
              <li key={cat}>
                <button
                  onClick={() => { onSelectCategory(cat); onClose(); }}
                  className={`w-full text-left p-3 rounded-md text-base transition-colors ${activeCategory === cat ? 'font-semibold bg-zinc-100 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-50'}`}
                >{cat}</button>
              </li>
            ))}
          </ul>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center mt-12 sm:mt-16 gap-1 sm:gap-2">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 transition-colors"><ChevronLeft className="h-5 w-5" /></button>
      {[...Array(totalPages).keys()].map(page => (
        <button key={page + 1} onClick={() => onPageChange(page + 1)} className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full font-semibold text-sm transition-colors ${currentPage === page + 1 ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'}`}>{page + 1}</button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 transition-colors"><ChevronRight className="h-5 w-5" /></button>
    </div>
  );
};


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

  const formatCategoryFromParam = (param) => {
    if (!param) return 'All';
    if (param.toLowerCase() === 'polo-t-shirts') return 'Polo T-Shirts';
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

  const renderContent = () => {
    if (loading) return <ProductGridSkeleton />;
    if (error) return <ErrorMessage message={error} />;
    if ((products?.length || 0) === 0) {
      return (
        <motion.div key="no-results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
          <NoResults />
        </motion.div>
      );
    }
    return (
      <motion.div key="product-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
          {products.map((product, index) => (
            <ProductCard key={product._id || index} product={product} />
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={pages} onPageChange={setCurrentPage} />
      </motion.div>
    );
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <MobileFilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} categories={categories} activeCategory={activeCategory} onSelectCategory={handleFilter} />

      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">

        <div className="lg:hidden">
          <header className="text-center mb-6">
            <h1 className="text-4xl font-bold text-zinc-900 font-marcellus">
              {activeCategory === 'All' ? 'All Products' : activeCategory}
            </h1>
            <p className="text-zinc-500 max-w-2xl mx-auto text-base mt-2">Discover our curated selection.</p>
          </header>
          <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-30 py-3 -mx-4 px-4 mb-6 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search products..." className="border-zinc-300 rounded-full pl-10 pr-4 py-2 w-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800" />
              </form>
              <button onClick={() => setIsFilterOpen(true)} className="flex-shrink-0 flex items-center gap-2 font-semibold border border-zinc-300 bg-white rounded-full px-4 py-2 hover:bg-zinc-100 active:bg-zinc-200 transition-colors text-sm">
                <SlidersHorizontal className="h-4 w-4" /><span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- DESKTOP LAYOUT (grid) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">

          {/* --- DESKTOP SIDEBAR (hidden lg:block) --- */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-zinc-800 tracking-wide">Categories</h3>
              <ul className="space-y-1 border-l border-zinc-200">
                {categories.map(cat => (
                  <li key={cat}>
                    <button
                      onClick={() => handleFilter(cat)}
                      className={`w-full text-left pl-4 -ml-px py-2 border-l-2 transition-colors duration-200 ${activeCategory === cat ? 'font-semibold border-zinc-800 text-zinc-900' : 'text-zinc-600 border-transparent hover:border-zinc-400 hover:text-zinc-900'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* --- MAIN CONTENT & PRODUCT GRID --- */}
          <main className="lg:col-span-3">
            {/* Desktop Header & Search */}
            <div className="hidden lg:flex justify-between items-center mb-8 pb-4 border-b border-zinc-200">
              <div>
                <h1 className="text-4xl font-bold text-zinc-900 font-marcellus">
                  <AnimatePresence mode="wait">
                    <motion.span key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="inline-block">
                      {activeCategory === 'All' ? 'All Products' : activeCategory}
                    </motion.span>
                  </AnimatePresence>
                </h1>
                <p className="text-zinc-500 mt-1">Discover our curated selection.</p>
              </div>
              <form onSubmit={handleSearch} className="relative w-full max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search products..." className="border-zinc-300 bg-zinc-50 rounded-full pl-11 pr-4 py-2.5 w-full shadow-sm text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-800" />
              </form>
            </div>

            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
};

export default ProductsPage;