import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Loader2, AlertTriangle, Search, 
  ChevronLeft, ChevronRight, Package, Image as ImageIcon 
} from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce'; // Assuming this hook exists in your project

import {
  productListRequest,
  productListSuccess,
  productListFail,
} from '../features/products/productSlice';
import api from '../api/AxiosAPI';

// --- Skeleton Loader ---
const ProductListSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {/* Mobile Card Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white border border-stone-200 rounded-sm p-4 flex gap-4">
          <div className="w-20 h-24 bg-stone-200 rounded-sm"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-stone-200 w-3/4"></div>
            <div className="h-3 bg-stone-200 w-1/2"></div>
            <div className="h-8 bg-stone-200 w-full mt-auto"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Desktop Table Skeleton */}
    <div className="hidden md:block">
      <div className="h-12 bg-stone-200 w-full mb-4 rounded-sm"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border-b border-stone-100">
          <div className="flex items-center gap-4">
            <div className="h-16 w-12 bg-stone-200 rounded-sm"></div>
            <div className="space-y-2">
              <div className="h-4 bg-stone-200 w-48"></div>
              <div className="h-3 bg-stone-200 w-24"></div>
            </div>
          </div>
          <div className="h-4 bg-stone-200 w-20"></div>
          <div className="h-4 bg-stone-200 w-24"></div>
          <div className="h-8 bg-stone-200 w-20"></div>
        </div>
      ))}
    </div>
  </div>
);

// --- Mobile Product Card ---
const ProductCard = ({ product, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white border border-stone-200 rounded-sm p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow group"
  >
    <div className="w-24 h-32 bg-stone-100 rounded-sm overflow-hidden flex-shrink-0 border border-stone-100">
       {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
       ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300"><ImageIcon size={24} /></div>
       )}
    </div>
    <div className="flex-1 flex flex-col">
      <div className="mb-auto">
        <p className="font-marcellus text-lg text-stone-900 leading-tight mb-1">{product.name}</p>
        <p className="text-xs uppercase tracking-widest text-stone-500 mb-2">{product.category}</p>
        <p className="text-sm font-bold text-stone-900">₹{product.basePrice.toFixed(2)}</p>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-600 border border-stone-200 py-2 hover:bg-stone-50 hover:text-amber-700 transition-colors"
        >
          <Edit className="h-3 w-3" /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center px-3 text-stone-400 border border-stone-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  </motion.div>
);

// --- Confirmation Modal ---
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-sm w-full max-w-sm p-6 shadow-2xl border-t-4 border-red-600">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-marcellus text-xl text-stone-900 mb-2">{title}</h3>
            <p className="text-sm text-stone-500 font-light leading-relaxed mb-6">{message}</p>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button onClick={onCancel} disabled={isLoading} className="w-full inline-flex justify-center rounded-sm border border-stone-300 px-4 py-3 bg-white text-xs font-bold uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition-colors">Cancel</button>
            <button onClick={onConfirm} disabled={isLoading} className="w-full inline-flex justify-center rounded-sm border border-transparent px-4 py-3 bg-red-700 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-800 transition-colors">
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirm Delete'}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Pagination ---
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center mt-10 gap-2">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1} 
        className="h-10 w-10 flex items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:bg-stone-100 disabled:opacity-30 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      {[...Array(totalPages).keys()].map((page) => (
        <button 
          key={page + 1} 
          onClick={() => onPageChange(page + 1)} 
          className={`h-10 w-10 rounded-full font-bold text-xs transition-colors ${currentPage === page + 1 ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'}`}
        >
          {page + 1}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages} 
        className="h-10 w-10 flex items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:bg-stone-100 disabled:opacity-30 transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
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
    <div className="bg-[#FDFBF7] min-h-screen font-montserrat text-stone-800">
      <div className="container mx-auto p-4 sm:p-8 lg:p-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-10">
          <div>
            <h1 className="font-marcellus text-3xl sm:text-4xl text-stone-900 mb-2">Product Inventory</h1>
            <p className="text-stone-500 font-light text-sm">Curate your exclusive collection.</p>
          </div>
          <button 
            onClick={createProductHandler} 
            className="bg-stone-900 text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-sm hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-stone-900/20"
          >
            <Plus className="h-4 w-4" />
            Create Product
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-1">
          
          {/* Search Bar */}
          <div className="p-4 sm:p-6 border-b border-stone-100">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-stone-200 rounded-sm pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 transition-all placeholder-stone-400"
              />
            </div>
          </div>

          {loading ? <div className="p-6"><ProductListSkeleton /></div> : error ? (
            <div className="bg-red-50 text-red-700 p-6 flex items-center gap-3"><AlertTriangle className="h-5 w-5" /> {error}</div>
          ) : (
            <>
              {/* --- Mobile & Tablet Card View --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:hidden bg-stone-50">
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
                {products.length === 0 && <p className="col-span-full text-center py-10 text-stone-400">No products found.</p>}
              </div>

              {/* --- Desktop Table View --- */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] uppercase tracking-widest text-stone-500 bg-stone-50/80">
                    <tr>
                      <th scope="col" className="px-6 py-5 font-bold">Product</th>
                      <th scope="col" className="px-6 py-5 font-bold">Category</th>
                      <th scope="col" className="px-6 py-5 font-bold">Base Price</th>
                      <th scope="col" className="px-6 py-5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((product) => (
                      <tr key={product._id} className="bg-white hover:bg-amber-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-6">
                            <div className="h-16 w-12 bg-stone-100 border border-stone-200 overflow-hidden rounded-sm flex-shrink-0">
                               {product.imageUrl ? (
                                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                               ) : (
                                  <div className="w-full h-full flex items-center justify-center text-stone-300"><ImageIcon size={16} /></div>
                               )}
                            </div>
                            <div>
                              <p className="font-marcellus text-lg text-stone-900">{product.name}</p>
                              <p className="text-xs text-stone-400 font-mono">ID: {product._id.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-bold uppercase tracking-wider text-stone-600">
                                {product.category}
                            </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-stone-900">₹{product.basePrice.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Link to={`/admin/product/${product._id}/edit`} className="p-2 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-full transition-colors" title="Edit">
                                <Edit className="h-4 w-4" />
                            </Link>
                            <button onClick={() => setProductToDelete(product)} className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete">
                                <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center py-12 text-stone-400 font-light">
                                <Package size={48} className="mx-auto mb-3 opacity-20" />
                                No products found matching your search.
                            </td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {products.length > 0 && <div className="p-4"><Pagination currentPage={currentPage} totalPages={pages} onPageChange={setCurrentPage} /></div>}
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