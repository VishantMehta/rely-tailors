import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { productListRequest, productListSuccess, productListFail } from '../features/products/productSlice';

const AdminProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, error } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch all products when the component loads
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

  const deleteHandler = async (id) => {
    // A simple confirmation before deleting
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/products/${id}`, config);
        // Refetch products after deletion
        const { data } = await axios.get('/api/products');
        dispatch(productListSuccess(data));
      } catch (err) {
        alert('Product could not be deleted.');
      }
    }
  };

  const createProductHandler = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post('/api/products', {}, config);
      // Redirect to the edit page for the newly created product
      navigate(`/admin/product/${data._id}/edit`);
    } catch (error) {
        alert('Could not create product.');
    }
  };

  return (
    <div className="bg-[#f2f2f2] min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-marcellus text-3xl sm:text-4xl text-slate-900">
            Manage Products
          </h1>
          <button onClick={createProductHandler} className="bg-slate-900 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-800 transition-colors">
            Create Product
          </button>
        </div>

        {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
          <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
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
                    <td className="px-6 py-4 font-medium text-slate-900">{product._id}</td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">${product.basePrice}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <Link to={`/admin/product/${product._id}/edit`} className="font-medium text-blue-600 hover:underline">Edit</Link>
                      <button onClick={() => deleteHandler(product._id)} className="font-medium text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductListPage;
