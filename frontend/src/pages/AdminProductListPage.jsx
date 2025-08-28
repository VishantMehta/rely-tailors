import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  productListRequest,
  productListSuccess,
  productListFail,
} from '../features/products/productSlice';
import api from '../api/AxiosAPI';

const AdminProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, error, page, pages } = useSelector(
    (state) => state.products
  );
  const { userInfo } = useSelector((state) => state.auth);

  // track current page
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(productListRequest());
        // pass page to backend
        const { data } = await api.get(`/products?page=${currentPage}`);
        dispatch(productListSuccess(data)); // data = { products, page, pages }
      } catch (err) {
        dispatch(
          productListFail(
            err.response?.data?.message ? err.response.data.message : err.message
          )
        );
      }
    };
    fetchProducts();
  }, [dispatch, currentPage]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        // refetch current page after deletion
        const { data } = await api.get(`/products?page=${currentPage}`);
        dispatch(productListSuccess(data));
      } catch (err) {
        alert('Product could not be deleted.');
      }
    }
  };

  const createProductHandler = async () => {
    try {
      const { data } = await api.post('/products', {});
      navigate(`/admin/product/${data._id}/edit`);
    } catch (error) {
      alert('Could not create product.');
    }
  };

  return (
    <div className="bg-[#f2f2f2] min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div
          className="flex justify-between items-center mb-8"
          data-aos="fade-down"
        >
          <h1 className="font-marcellus text-3xl sm:text-4xl text-slate-900">
            Manage Products
          </h1>
          <button
            onClick={createProductHandler}
            className="bg-slate-900 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-800 transition-colors"
          >
            Create Product
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div
              className="bg-white p-4 rounded-lg shadow-md overflow-x-auto"
              data-aos="fade-up"
            >
              <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">ID</th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Price</th>
                    <th scope="col" className="px-6 py-3">Category</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {product._id}
                      </td>
                      <td className="px-6 py-4">{product.name}</td>
                      <td className="px-6 py-4">${product.basePrice}</td>
                      <td className="px-6 py-4">{product.category}</td>
                      <td className="px-6 py-4 flex space-x-2">
                        <Link
                          to={`/admin/product/${product._id}/edit`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center space-x-2 mt-6">
              {[...Array(pages).keys()].map((x) => (
                <button
                  key={x + 1}
                  onClick={() => setCurrentPage(x + 1)}
                  className={`px-3 py-1 rounded ${currentPage === x + 1
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                >
                  {x + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProductListPage;
