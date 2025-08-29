import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, XCircle, Inbox } from 'lucide-react';

import {
  productListRequest,
  productListSuccess,
  productListFail,
} from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import api from '../api/AxiosAPI';

// --- Asset Imports (Assuming these are local) ---
import suit from '../assets/suit.jpg';
import kurta from '../assets/Crain.jpg';
import polo from '../assets/polo.jpg';
import shirts from '../assets/shirts.jpg';
import blazers from '../assets/blazers.jpg';
import wedding from '../assets/wedding.jpg';
import indo from '../assets/indo.jpg';
import formal from '../assets/formal.jpg';


// --- Data & Configuration ---
const categoryImages = {
  'All': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Suits': suit,
  'Blazers': blazers,
  'Shirts': shirts,
  'Kurtas': kurta,
  'Polo T-Shirts': polo,
  'Indo Western': indo,
  'Wedding': wedding,
  'Formal': formal,
};

const categories = [
  'All', 'Suits', 'Blazers', 'Shirts', 'Kurtas',
  'Polo T-Shirts', 'Indo Western', 'Wedding', 'Formal'
];

// --- Reusable UI Components ---

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="flex flex-col items-center justify-center text-center bg-red-50 text-red-700 p-8 rounded-lg border border-red-200">
    <XCircle className="w-12 h-12 mb-4" />
    <h3 className="text-lg font-semibold">An Error Occurred</h3>
    <p className="text-sm">{message}</p>
  </div>
);

const NoResults = () => (
  <div className="text-center py-20 bg-zinc-100/50 rounded-lg">
    <Inbox className="mx-auto h-16 w-16 text-zinc-400" strokeWidth={1.5} />
    <h3 className="mt-4 text-xl font-semibold text-zinc-800">No Products Found</h3>
    <p className="mt-1 text-zinc-500">Try adjusting your search or category filters.</p>
  </div>
);


const CategoryCard = ({ category, isActive, onClick }) => (
  <div
    className="group relative flex-shrink-0 w-44 h-24 md:w-48 md:h-28 rounded-xl cursor-pointer overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1"
    onClick={onClick}
    style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }} // Fix for Safari border-radius issue with overflow:hidden
  >
    <img
      src={categoryImages[category]}
      alt={category}
      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out ${isActive ? 'scale-110' : 'scale-105 group-hover:scale-110'}`}
    />
    <div className={`absolute inset-0 w-full h-full transition-all duration-300 ${isActive ? 'bg-black/30' : 'bg-black/50 group-hover:bg-black/40'}`}></div>
    <div className={`absolute inset-0 flex items-center justify-center p-2 ring-2 transition-all duration-300 ${isActive ? 'ring-white' : 'ring-transparent'}`}>
      <h3 className="font-semibold text-center text-white text-lg tracking-wide">
        {category}
      </h3>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-16 gap-2" data-aos="fade-up">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      {[...Array(totalPages).keys()].map((page) => (
        <button
          key={page + 1}
          onClick={() => onPageChange(page + 1)}
          className={`h-10 w-10 rounded-full font-semibold transition-colors duration-300 ${currentPage === page + 1
            ? 'bg-zinc-900 text-white'
            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
            }`}
        >
          {page + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
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

  const carouselRef = useRef(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: true });

  const formatCategoryFromParam = (param) => {
    if (!param) return 'All';
    if (param.toLowerCase() === 'polo-t-shirts') return 'Polo T-Shirts';
    return param.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState(() => formatCategoryFromParam(categoryName));

  const checkScrollability = () => {
    const el = carouselRef.current;
    if (el) {
      const isAtStart = el.scrollLeft <= 0;
      const isAtEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      setCanScroll({ left: !isAtStart, right: !isAtEnd });
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      checkScrollability();
      el.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        el.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [products]);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  const fetchProducts = async (keywordParam = '', pageParam = 1, categoryParam = '') => {
    try {
      dispatch(productListRequest());
      const { data } = await api.get(`/products?keyword=${keywordParam}&page=${pageParam}&category=${categoryParam}`);
      const payload = {
        products: Array.isArray(data?.products) ? data.products : [],
        page: data?.page || 1,
        pages: data?.pages || 1,
      };
      dispatch(productListSuccess(payload));
    } catch (err) {
      dispatch(productListFail(err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    const categoryFromURL = formatCategoryFromParam(categoryName);
    if (categoryFromURL !== activeCategory) {
      setActiveCategory(categoryFromURL);
      setCurrentPage(1);
      setKeyword('');
    }
  }, [categoryName]);

  useEffect(() => {
    const categoryToFetch = activeCategory === 'All' ? '' : activeCategory;
    fetchProducts(keyword, currentPage, categoryToFetch);
    window.scrollTo(0, 0);
  }, [dispatch, keyword, currentPage, activeCategory]);

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
    setActiveCategory(category);
    const categoryPath = category === 'All' ? '' : `/category/${category.replace(/\s+/g, '-').toLowerCase()}`;
    navigate(`/products${categoryPath}`);
  };

  return (
    <div className="bg-zinc-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">

        {/* --- Header Section --- */}
        <header className="text-center mb-10 md:mb-12" data-aos="fade-down">
          <h1 className="font-marcellus text-4xl md:text-6xl text-zinc-900 mb-3">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                {activeCategory === 'All' ? 'Our Collection' : activeCategory}
              </motion.span>
            </AnimatePresence>
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-base md:text-lg">
            Discover our curated selection of high-quality apparel. Find exactly what you're looking for.
          </p>
        </header>

        {/* --- Search Form --- */}
        <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto mb-12" data-aos="fade-up">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for suits, kurtas, etc..."
            className="border-zinc-300 rounded-full pl-12 pr-4 py-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-900 text-white px-5 py-2 rounded-full hover:bg-zinc-700 transition-colors duration-300 font-semibold"
          >
            Search
          </button>
        </form>

        {/* --- Category Carousel --- */}
        <div className="relative group" data-aos="fade-up" data-aos-delay="100">
          <button
            onClick={() => scroll(-1)}
            disabled={!canScroll.left}
            className="absolute top-1/2 -translate-y-1/2 -left-4 z-10 h-10 w-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-zinc-800 hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div
            ref={carouselRef}
            className="flex gap-4 md:gap-5 py-4 overflow-x-auto scroll-smooth scrollbar-hide -mx-4 px-4"
          >
            {categories.map((cat) => (
              <CategoryCard
                key={cat}
                category={cat}
                isActive={activeCategory === cat}
                onClick={() => handleFilter(cat)}
              />
            ))}
          </div>
          <button
            onClick={() => scroll(1)}
            disabled={!canScroll.right}
            className="absolute top-1/2 -translate-y-1/2 -right-4 z-10 h-10 w-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-zinc-800 hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* --- Products Section --- */}
        <main className="mt-12 md:mt-16">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <AnimatePresence>
              {Array.isArray(products) && products.length > 0 ? (
                <motion.div
                  key="product-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
                    {products.map((product, index) => (
                      <div
                        key={product._id || index}
                        data-aos="fade-up"
                        data-aos-delay={index * 50}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pages}
                    onPageChange={setCurrentPage}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <NoResults />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>

      </div>
    </div>
  );
};

export default ProductsPage;