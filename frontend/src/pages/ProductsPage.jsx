import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  productListRequest,
  productListSuccess,
  productListFail,
} from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import api from '../api/AxiosAPI';

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
const AccessoriesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4" />
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

      const { data } = await api.get(`/products?keyword=${keywordParam}&page=${pageParam}&category=${categoryParam}`);

      // Ensure backend response matches expected shape
      const payload = {
        products: Array.isArray(data.products) ? data.products : data || [],
        page: data.page || 1,
        pages: data.pages || 1,
      };

      dispatch(productListSuccess(payload));
    } catch (err) {
      dispatch(productListFail(err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchProducts(keyword, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
  };

  const handleFilter = (category) => {
    setActiveCategory(category);
    const categoryParam = category === 'All' ? '' : category;
    fetchProducts(keyword, 1, categoryParam);
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

  const filteredProducts =
    activeCategory === 'All'
      ? products || []
      : (products || []).filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product, index) => (
                  <div key={product._id || index} data-aos="fade-up" data-aos-delay={index * 100}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* --- Pagination --- */}
              {pages > 1 && (
                <div className="flex justify-center mt-10 gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => fetchProducts(keyword, page - 1)}
                    className={`px-4 py-2 rounded-md ${page === 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-slate-200 shadow-sm'
                      }`}
                  >
                    Previous
                  </button>

                  {[...Array(pages).keys()].map((x) => (
                    <button
                      key={x + 1}
                      onClick={() => fetchProducts(keyword, x + 1)}
                      className={`px-4 py-2 rounded-md ${page === x + 1
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-200 shadow-sm'
                        }`}
                    >
                      {x + 1}
                    </button>
                  ))}

                  <button
                    disabled={page === pages}
                    onClick={() => fetchProducts(keyword, page + 1)}
                    className={`px-4 py-2 rounded-md ${page === pages
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
