import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
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

// Sample category images (replace with your actual image paths)
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

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error, pages } = useSelector((state) => state.products);
  const { categoryName } = useParams();
  
  const carouselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const formatCategoryFromParam = (param) => {
    if (!param) return 'All';
    if (param.toLowerCase() === 'polo-t-shirts') return 'Polo T-Shirts';
    return param.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState(() => formatCategoryFromParam(categoryName));

  // Categories with images
  const categories = [
    'All', 'Suits', 'Blazers', 'Shirts', 'Kurtas', 
    'Polo T-Shirts', 'Indo Western', 'Wedding', 'Formal'
  ];

  // Auto-scrolling carousel effect with smooth animation
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || isPaused) return;

    let animationId;
    let position = 0;
    const speed = 0.8; // Adjust speed as needed

    const animate = () => {
      position -= speed;
      
      // Reset position when scrolled all the way
      if (position < -carousel.scrollWidth / 2) {
        position = 0;
      }
      
      // Apply smooth transition
      carousel.style.transition = 'transform 0.3s ease-out';
      carousel.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused]);

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
  }, [categoryName]);

  useEffect(() => {
    const categoryToFetch = activeCategory === 'All' ? '' : activeCategory;
    fetchProducts(keyword, currentPage, categoryToFetch);
  }, [dispatch, keyword, currentPage, activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setKeyword(searchInput);
  };

  const handleFilter = (category) => {
    setCurrentPage(1);
    setKeyword('');
    setActiveCategory(category);
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen font-montserrat">
      <div className="container mx-auto px-4 py-8">
        {/* --- Heading & Search --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="font-marcellus text-3xl md:text-4xl text-slate-900 text-center md:text-left">
            {activeCategory === 'All' ? 'Our Collection' : activeCategory}
          </h1>
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="border rounded-md px-4 py-2 w-full md:w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <button
              type="submit"
              className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition"
            >
              Search
            </button>
          </form>
        </div>

        {/* --- Image-Based Category Carousel with Smooth Scrolling --- */}
        <div className="mb-12 relative overflow-hidden">
          <div 
            className="flex py-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div 
              ref={carouselRef}
              className="flex gap-4"
              style={{ willChange: 'transform' }}
            >
              {/* Double the items for seamless looping */}
              {[...categories, ...categories].map((category, index) => (
                <div
                  key={`${category}-${index}`}
                  className={`flex-shrink-0 w-48 h-56 rounded-xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${activeCategory === category ? 'ring-2 ring-slate-900 ring-opacity-50' : ''}`}
                  onClick={() => handleFilter(category)}
                >
                  <div className="h-40 overflow-hidden bg-gray-200 flex items-center justify-center">
                    <img 
                      src={categoryImages[category]} 
                      alt={category}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      style={{ objectPosition: 'center' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                      }}
                    />
                  </div>
                  <div className="p-3 bg-white">
                    <h3 className="font-medium text-slate-800 text-center">
                      {category}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Gradient overlays for a polished look */}
          <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#f9f9f9] to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#f9f9f9] to-transparent z-10"></div>
        </div>

        {/* --- Products Grid --- */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded text-center">{error}</div>
          ) : (
            <>
              {Array.isArray(products) && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product, index) => (
                    <div
                      key={product._id || index}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-slate-400 text-6xl mb-4">🛍️</div>
                  <p className="text-slate-500 text-lg">No products found.</p>
                  <p className="text-slate-400">Try a different search or category.</p>
                </div>
              )}

              {/* --- Pagination --- */}
              {pages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`px-4 py-2 rounded-md ${currentPage === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                      }`}
                  >
                    Previous
                  </button>

                  {[...Array(pages).keys()].map((x) => (
                    <button
                      key={x + 1}
                      onClick={() => setCurrentPage(x + 1)}
                      className={`px-4 py-2 rounded-md ${currentPage === x + 1
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                        }`}
                    >
                      {x + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === pages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`px-4 py-2 rounded-md ${currentPage === pages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                      }`}
                  >
                    Next
                  </button>
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