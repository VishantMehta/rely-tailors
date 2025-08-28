import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  productListRequest,
  productListSuccess,
  productListFail,
} from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import suit from '../assets/suit.jpg';

// --- Category Icons ---
const SuitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);
const BlazerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.982 11.038L12 5.02l6.018 6.018-6.018 6.018-6.018-6.018z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21V5" />
  </svg>
);
const ShirtIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 16v-5a6 6 0 00-6-6v0a6 6 0 00-6 6v5" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 16H3" />
  </svg>
);
const AccessoriesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.494v1.026a2 2 0 01-2 2h-2.236a2 2 0 01-2-2v-1.026a2 2 0 012-2h2.236a2 2 0 012 2z" />
  </svg>
);
const AllIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const KurtaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);
const WeddingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error, page, pages } = useSelector((state) => state.products);

  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Suits', 'Blazers', 'Shirts', 'Kurtas', 'Wedding', 'Accessories'];

  const fetchProducts = async (keywordParam = '', pageParam = 1, categoryParam = '') => {
    try {
      dispatch(productListRequest());
      const { data } = await axios.get(
        `/api/products?keyword=${keywordParam}&page=${pageParam}&category=${categoryParam}`
      );
      dispatch(productListSuccess(data));
    } catch (err) {
      dispatch(
        productListFail(err.response?.data?.message || err.message)
      );
    }
  };


  useEffect(() => {
    fetchProducts(keyword, page);
  }, [dispatch, keyword, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput); // triggers fetch
  };

  const handleFilter = (category) => {
    setActiveCategory(category);
    const categoryParam = category === 'All' ? '' : category;
    fetchProducts(keyword, 1, categoryParam); // reset to page 1
  };


  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Suits': return <SuitIcon />;
      case 'Blazers': return <BlazerIcon />;
      case 'Shirts': return <ShirtIcon />;
      case 'Kurtas': return <KurtaIcon />;
      case 'Wedding': return <WeddingIcon />;
      case 'Accessories': return <AccessoriesIcon />;
      default: return <AllIcon />;
    }
  };

  // Category filter applied on top of search results
  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="bg-[#f2f2f2] font-montserrat">
      {/* --- Banner Section --- */}
      <div className="relative bg-slate-800 text-white" data-aos="fade-down">
        <img
          src={suit}
          alt="Man in a stylish suit"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative container mx-auto px-6 py-32 text-center">
          <p className="text-sm text-slate-300">Home - Products</p>
          <h1 className="font-marcellus text-5xl text-white mt-2">All Products</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* --- Search Box --- */}
        <form onSubmit={handleSearch} className="flex justify-center gap-2 mb-8">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="border rounded-md px-4 py-2 w-64"
          />
          <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-md">
            Search
          </button>
        </form>

        {/* --- Categories --- */}
        <div data-aos="fade-up">
          <h2 className="font-marcellus text-3xl text-slate-900 mb-6 text-center">
            Product Categories
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilter(category)}
                className={`flex items-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-300 ${activeCategory === category
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {getCategoryIcon(category)}
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* --- Products Grid --- */}
        <div className="mt-12">
          {loading ? (
            <div className="text-center text-slate-500">Loading products...</div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded text-center">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product, index) => (
                  <div key={product._id} data-aos="fade-up" data-aos-delay={index * 100}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* --- Pagination --- */}
              {pages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  {/* Previous */}
                  <button
                    disabled={page === 1}
                    onClick={() => fetchProducts(keyword, page - 1)}
                    className={`px-4 py-2 rounded-md ${page === 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                      }`}
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {[...Array(pages).keys()].map((x) => (
                    <button
                      key={x + 1}
                      onClick={() => fetchProducts(keyword, x + 1)}
                      className={`px-4 py-2 rounded-md ${page === x + 1
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                      {x + 1}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    disabled={page === pages}
                    onClick={() => fetchProducts(keyword, page + 1)}
                    className={`px-4 py-2 rounded-md ${page === pages
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
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
