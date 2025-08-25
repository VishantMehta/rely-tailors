import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { productListRequest, productListSuccess, productListFail } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(productListRequest());
        const { data } = await axios.get('/api/products');
        dispatch(productListSuccess(data));
      } catch (err) {
        dispatch(productListFail(err.response && err.response.data.message ? err.response.data.message : err.message));
      }
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <div className="bg-slate-900 min-h-screen">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Our Collections</h1>
            
            {loading ? (
                <div className="text-center text-amber-400">Loading products...</div>
            ) : error ? (
                <div className="bg-red-500 text-white p-4 rounded text-center">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default ProductsPage;
