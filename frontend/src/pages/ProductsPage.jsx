import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  productListRequest,
  productListSuccess,
  productListFail,
} from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import api from '../api/AxiosAPI';
import suit from '../assets/suit.jpg';
import kurta from '../assets/Crain.jpg';
import polo from '../assets/polo.jpg';
import shirts from '../assets/shirts.jpg';
import blazers from '../assets/blazers.jpg';
import wedding from '../assets/wedding.jpg';
import indo from '../assets/indo.jpg';
import formal from '../assets/formal.jpg';

const categoryImages = {
  'All': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  'Suits': suit,
  'Blazers': blazers,
  'Shirts': shirts,
  'Kurtas': kurta,
  'Polo T-Shirts': polo,
  'Indo Western': indo,
  'Wedding': wedding,
  'Formal': formal,
};

// A simple arrow SVG component for the buttons
const ChevronArrow = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);


const ProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, pages } = useSelector((state) => state.products);
  const { categoryName } = useParams();

  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const formatCategoryFromParam = (param) => {
    if (!param) return 'All';
    if (param.toLowerCase() === 'polo-t-shirts') return 'Polo T-Shirts';
    return param.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState(() => formatCategoryFromParam(categoryName));

  const categories = [
    'All', 'Suits', 'Blazers', 'Shirts', 'Kurtas',
    'Polo T-Shirts', 'Indo Western', 'Wedding', 'Formal'
  ];

  // --- Carousel Scroll Logic ---
  const checkScrollability = () => {
    const el = carouselRef.current;
    if (el) {
      const isAtStart = el.scrollLeft <= 0;
      const isAtEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      setCanScrollLeft(!isAtStart);
      setCanScrollRight(!isAtEnd);
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      checkScrollability(); // Check on mount and when products change
      el.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        el.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [products]);

  const scroll = (direction) => {
    const el = carouselRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8; // Scroll 80% of the visible width
      el.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };


  const fetchProducts = async (keywordParam = '', pageParam = 1, categoryParam = '') => {
    try {
      dispatch(productListRequest());
      const { data } = await api.get(
        `/products?keyword=${keywordParam}&page=${pageParam}&category=${categoryParam}`
      );
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
  }, [categoryName, activeCategory]);

  useEffect(() => {
    const categoryToFetch = activeCategory === 'All' ? '' : activeCategory;
    fetchProducts(keyword, currentPage, categoryToFetch);
  }, [dispatch, keyword, currentPage, activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setKeyword(searchInput);
    navigate('/products'); // Clear category from URL on search
  };

  const handleFilter = (category) => {
    setCurrentPage(1);
    setKeyword('');
    setSearchInput('');
    setActiveCategory(category);
    if (category === 'All') {
      navigate('/products');
    } else {
      const categoryPath = category.replace(/\s+/g, '-').toLowerCase();
      navigate(`/products/category/${categoryPath}`);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* --- Heading & Search --- */}
        <div className="text-center mb-8" data-aos="fade-down">
          <h1 className="font-marcellus text-3xl md:text-5xl text-slate-900 mb-4">
            {activeCategory === 'All' ? 'Our Collection' : activeCategory}
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Discover our curated selection of high-quality apparel. Use the filters to find exactly what you're looking for.
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-lg mx-auto mb-12" data-aos="fade-up">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for suits, kurtas, etc..."
            className="border-gray-300 rounded-lg px-4 py-3 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800 transition"
          />
          <button
            type="submit"
            className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors duration-300 font-semibold"
          >
            Search
          </button>
        </form>

        {/* --- Category Carousel with Arrows --- */}
        <div className="relative group" data-aos="fade-up">
          <button
            onClick={() => scroll(-1)}
            className={`absolute top-1/2 -translate-y-1/2 -left-4 z-10 h-10 w-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-slate-800 hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed`}
            disabled={!canScrollLeft}
          >
            <ChevronArrow className="w-5 h-5 transform rotate-180" />
          </button>
          <div
            ref={carouselRef}
            className="flex gap-4 md:gap-5 py-4 overflow-x-auto scroll-smooth scrollbar-hide"
          >
            {categories.map((category) => (
              <div
                key={category}
                className="group/item flex-shrink-0 w-40 h-52 md:w-48 md:h-56 rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2"
                onClick={() => handleFilter(category)}
              >
                <div className={`w-full h-full rounded-xl shadow-md overflow-hidden transition-all duration-300 ${activeCategory === category ? 'shadow-lg' : ''}`}>
                  <div className="h-[70%] overflow-hidden">
                    <img
                      src={categoryImages[category]}
                      alt={category}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                    />
                  </div>
                  <div className="h-[30%] bg-white flex flex-col items-center justify-center p-2">
                    <h3 className="font-semibold text-center text-slate-800">
                      {category}
                    </h3>
                    <div className={`h-[3px] mt-1 rounded-full bg-slate-800 transition-all duration-300 ${activeCategory === category ? 'w-8' : 'w-0 group-hover/item:w-4'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll(1)}
            className={`absolute top-1/2 -translate-y-1/2 -right-4 z-10 h-10 w-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-slate-800 hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed`}
            disabled={!canScrollRight}
          >
            <ChevronArrow className="w-5 h-5" />
          </button>
        </div>

        {/* --- Products Grid --- */}
        <div className="mt-12">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">{error}</div>
          ) : (
            <>
              {Array.isArray(products) && products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
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
              ) : (
                <div className="text-center py-16 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 text-6xl mb-4">🛍️</div>
                  <p className="text-slate-600 text-xl font-semibold">No Products Found</p>
                  <p className="text-slate-500 mt-2">Please try a different search term or category.</p>
                </div>
              )}

              {/* --- Pagination --- */}
              {pages > 1 && (
                <div className="flex justify-center mt-16 gap-2" data-aos="fade-up">
                  {[...Array(pages).keys()].map((x) => (
                    <button
                      key={x + 1}
                      onClick={() => setCurrentPage(x + 1)}
                      className={`h-10 w-10 rounded-full font-semibold transition-colors duration-300 ${currentPage === x + 1
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                      {x + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

