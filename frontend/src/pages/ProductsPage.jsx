import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// ADDED: Import useParams to read URL parameters
import { useParams } from 'react-router-dom';
import {
  productListRequest,
  productListSuccess,
  productListFail,
} from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import api from '../api/AxiosAPI';

// --- Category Icons (remain the same) ---
const SuitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
  </svg>
);
const BlazerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.982 11.038L12 5.02l6.018 6.018-6.018 6.018-6.018-6.018z" />
  </svg>
);
const ShirtIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 16v-5a6 6 0 00-6-6v0a6 6 0 00-6 6v5" />
  </svg>
);
const AllIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const KurtaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536" />
  </svg>
);
const WeddingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682" />
  </svg>
);
// ADDED: Icons for new categories to match HomePage
const PoloIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4a1 1 0 001 1h10a1 1 0 100-2H5a1 1 0 00-1 1zM2 7a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm1 3a1 1 0 100 2h12a1 1 0 100-2H3zm1 3a1 1 0 100 2h12a1 1 0 100-2H4zm-1 3a1 1 0 100 2h14a1 1 0 100-2H3z" clipRule="evenodd" /></svg>;
const IndoWesternIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM4.636 4.636a.75.75 0 011.06 0l1.061 1.06a.75.75 0 01-1.06 1.061L4.636 5.697a.75.75 0 010-1.06zm9.193 9.193a.75.75 0 011.06 0l1.061 1.06a.75.75 0 01-1.06 1.061l-1.061-1.06a.75.75 0 010-1.061zM15.364 4.636a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 11-1.061-1.06l1.06-1.061a.75.75 0 011.061 0zm-9.193 9.193a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 11-1.061-1.06l1.06-1.061a.75.75 0 011.061 0z" /></svg>;
const FormalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.993.883L4 8v10a1 1 0 001 1h10a1 1 0 001-1V8l-.007-.117A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4z" clipRule="evenodd" /></svg>;


const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error, pages } = useSelector((state) => state.products);

  // ADDED: Read the category name from the URL
  const { categoryName } = useParams();

  // ADDED: Helper function to format the URL parameter into a display-friendly name
  const formatCategoryFromParam = (param) => {
    if (!param) return 'All';
    if (param.toLowerCase() === 'polo-t-shirts') return 'Polo T-Shirts';
    return param.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const [searchInput, setSearchInput] = useState('');
  // CHANGED: The three main states that control data fetching
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // CHANGED: Initialize active category from the URL parameter
  const [activeCategory, setActiveCategory] = useState(() => formatCategoryFromParam(categoryName));

  // CHANGED: Updated category list to be consistent with HomePage
  const categories = ['All', 'Suits', 'Blazers', 'Shirts', 'Kurtas', 'Polo T-Shirts', 'Indo Western', 'Wedding', 'Formal'];

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

  // ADDED: This effect syncs the URL parameter with the component's internal state
  useEffect(() => {
    const categoryFromURL = formatCategoryFromParam(categoryName);
    if (categoryFromURL !== activeCategory) {
      setActiveCategory(categoryFromURL);
      setCurrentPage(1);
      setKeyword('');
    }
  }, [categoryName]);

  // ADDED: This effect reacts to any state change and calls the API
  useEffect(() => {
    const categoryToFetch = activeCategory === 'All' ? '' : activeCategory;
    fetchProducts(keyword, currentPage, categoryToFetch);
  }, [dispatch, keyword, currentPage, activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    // CHANGED: Only update state. The useEffect will trigger the API call.
    setCurrentPage(1);
    setKeyword(searchInput);
  };

  const handleFilter = (category) => {
    // CHANGED: Only update state. The useEffect will trigger the API call.
    setCurrentPage(1);
    setKeyword('');
    setActiveCategory(category);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Suits': return <SuitIcon />;
      case 'Blazers': return <BlazerIcon />;
      case 'Shirts': return <ShirtIcon />;
      case 'Kurtas': return <KurtaIcon />;
      case 'Polo T-Shirts': return <PoloIcon />;
      case 'Indo Western': return <IndoWesternIcon />;
      case 'Wedding': return <WeddingIcon />;
      case 'Formal': return <FormalIcon />;
      default: return <AllIcon />;
    }
  };

  // DELETED: The `filteredProducts` logic is no longer needed

  return (
    <div className="bg-[#f9f9f9] min-h-screen font-montserrat">
      <div className="container mx-auto px-6 py-10">
        {/* --- Heading & Search --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="font-marcellus text-3xl text-slate-900">Shop Our Collection</h1>
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

        {/* --- Categories --- */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilter(category)}
                className={`flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium shadow-sm transition-colors duration-300 ${activeCategory === category
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
        <div>
          {loading ? (
            <div className="text-center text-slate-500">Loading products...</div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded text-center">{error}</div>
          ) : (
            <>
              {/* CHANGED: Map over `products` directly from Redux state */}
              {Array.isArray(products) && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
                <p className="text-center text-slate-500">No products found.</p>
              )}

              {/* --- Pagination --- */}
              {pages > 1 && (
                <div className="flex justify-center mt-10 gap-2">
                  <button
                    disabled={currentPage === 1}
                    // CHANGED: Use state setter for pagination
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`px-4 py-2 rounded-md ${currentPage === 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-slate-200 shadow-sm'
                      }`}
                  >
                    Previous
                  </button>

                  {[...Array(pages).keys()].map((x) => (
                    <button
                      key={x + 1}
                      // CHANGED: Use state setter for pagination
                      onClick={() => setCurrentPage(x + 1)}
                      className={`px-4 py-2 rounded-md ${currentPage === x + 1
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-200 shadow-sm'
                        }`}
                    >
                      {x + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === pages}
                    // CHANGED: Use state setter for pagination
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`px-4 py-2 rounded-md ${currentPage === pages
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-slate-200 shadow-sm'
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