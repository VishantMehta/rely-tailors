import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Loader2, AlertTriangle, Search, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

import {
  productListRequest,
  productListSuccess,
  productListFail,
} from '../features/products/productSlice';
import api from '../api/AxiosAPI';


const ProductListSkeleton = () => (
  <div className="animate-pulse">
    {/* Mobile Card Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white border border-zinc-200 rounded-lg p-4 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-24 bg-zinc-200 rounded-md"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-200 rounded w-1/4"></div>
              <div className="h-3 bg-zinc-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="border-t border-zinc-100 pt-3 flex items-center justify-end gap-3">
            <div className="h-8 bg-zinc-200 rounded w-20"></div>
            <div className="h-8 bg-zinc-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Desktop Table Skeleton */}
    <div className="hidden md:block">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-zinc-200 rounded-md"></div>
            <div className="space-y-2">
              <div className="h-4 bg-zinc-200 rounded w-48"></div>
              <div className="h-3 bg-zinc-200 rounded w-24"></div>
            </div>
          </div>
          <div className="h-4 bg-zinc-200 rounded w-20"></div>
          <div className="h-4 bg-zinc-200 rounded w-24"></div>
          <div className="h-8 bg-zinc-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  </div>
);


const ProductCard = ({ product, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="bg-white border border-zinc-200 rounded-lg p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-start gap-4">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-20 h-24 object-cover rounded-md bg-zinc-100"
      />
      <div className="flex-1">
        <p className="font-semibold text-zinc-800 break-words leading-tight">{product.name}</p>
        <p className="text-sm font-bold text-zinc-900 mt-1">${product.basePrice.toFixed(2)}</p>
        <p className="text-xs text-zinc-500 mt-1 capitalize">{product.category}</p>
      </div>
    </div>
    <div className="border-t border-zinc-100 pt-3 flex items-center justify-end gap-2">
      <button
        onClick={onEdit}
        className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-blue-50"
      >
        <Edit className="h-4 w-4" />
        <span>Edit</span>
      </button>
      <button
        onClick={onDelete}
        className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-700 hover:text-red-600 transition-colors py-2 px-3 rounded-md hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete</span>
      </button>
    </div>
  </motion.div>
);


const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-zinc-900">{title}</h3>
              <div className="mt-2"><p className="text-sm text-zinc-500">{message}</p></div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
            <button onClick={onConfirm} disabled={isLoading} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:w-auto sm:text-sm disabled:bg-red-300">
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Confirm Delete'}
            </button>
            <button onClick={onCancel} disabled={isLoading} className="mt-3 w-full inline-flex justify-center rounded-md border border-zinc-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-zinc-700 hover:bg-zinc-50 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center mt-8 gap-1 sm:gap-2">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 transition-colors"><ChevronLeft className="h-5 w-5" /></button>
      {[...Array(totalPages).keys()].map((page) => (
        <button key={page + 1} onClick={() => onPageChange(page + 1)} className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full font-semibold transition-colors text-sm ${currentPage === page + 1 ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'}`}>{page + 1}</button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 transition-colors"><ChevronRight className="h-5 w-5" /></button>
    </div>
  );
};


// --- Main Component ---

const AdminProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, error, pages } = useSelector((state) => state.products);

  const [currentPage, setCurrentPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchProducts = useCallback(async (page, keyword) => {
    try {
      dispatch(productListRequest());
      const params = new URLSearchParams();
      params.append('page', page);
      if (keyword) {
        params.append('keyword', keyword);
      }

      const { data } = await api.get(`/products?${params.toString()}`);
      dispatch(productListSuccess(data));
    } catch (err) {
      dispatch(productListFail(err.response?.data?.message || err.message));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProducts(currentPage, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm, fetchProducts]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  const deleteHandler = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/products/${productToDelete._id}`);
      fetchProducts(currentPage, debouncedSearchTerm);
    } catch (err) {
      console.error('Product could not be deleted.', err);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const createProductHandler = async () => {
    try {
      const { data } = await api.post('/products', {});
      navigate(`/admin/product/${data._id}/edit`);
    } catch (error) {
      console.error('Could not create product.', error);
    }
  };

  return (
    <div className="bg-zinc-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-marcellus text-3xl sm:text-4xl font-bold text-zinc-900">Manage Products</h1>
            <p className="text-zinc-500 mt-1">Add, edit, or delete products from your inventory.</p>
          </div>
          <button onClick={createProductHandler} className="bg-zinc-900 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 self-start sm:self-center shadow-sm hover:shadow-md">
            <Plus className="h-5 w-5" />
            Create Product
          </button>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by Product Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:max-w-md border border-zinc-300 rounded-full pl-12 pr-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 transition-all"
            />
          </div>

          {loading ? <ProductListSkeleton /> : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3"><AlertTriangle className="h-5 w-5" /> {error}</div>
          ) : (
            <>
              {/* --- Mobile & Tablet Card View --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                <AnimatePresence>
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onEdit={() => navigate(`/admin/product/${product._id}/edit`)}
                      onDelete={() => setProductToDelete(product)}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* --- Desktop Table View --- */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/70">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-semibold">Product</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Price</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Category</th>
                      <th scope="col" className="px-6 py-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="bg-white border-b hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img src={product.imageUrl} alt={product.name} className="w-16 h-20 object-cover rounded-md bg-zinc-100" />
                            <div>
                              <p className="font-semibold text-zinc-800">{product.name}</p>
                              <p className="text-xs text-zinc-500 font-mono" title={product._id}>{product._id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-zinc-800">${product.basePrice.toFixed(2)}</td>
                        <td className="px-6 py-4 capitalize">{product.category}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-4">
                            <Link to={`/admin/product/${product._id}/edit`} className="p-2 text-zinc-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Edit className="h-5 w-5" /></Link>
                            <button onClick={() => setProductToDelete(product)} className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="h-5 w-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination currentPage={currentPage} totalPages={pages} onPageChange={setCurrentPage} />
            </>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!productToDelete}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${productToDelete?.name}"? This action cannot be undone.`}
        onConfirm={deleteHandler}
        onCancel={() => setProductToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminProductListPage;