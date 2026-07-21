import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, ShoppingBag, X, Star, Package, Filter, 
  Loader2, Trash2, ArrowRight, AlertCircle, CheckCircle2 
} from 'lucide-react';
import {
  fetchWishlist,
  removeFromWishlist
} from '../features/wishlist/wishlistSlice';
import { addItemToCart } from '../features/cart/cartSlice';

// --- Toast Notification Component ---
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, x: '-50%' }}
    animate={{ opacity: 1, y: 0, x: '-50%' }}
    exit={{ opacity: 0, y: -20, x: '-50%' }}
    className={`fixed top-6 left-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-sm shadow-xl border ${
      type === 'success' ? 'bg-stone-900 text-white border-stone-800' : 'bg-red-50 text-red-800 border-red-100'
    }`}
  >
    {type === 'success' ? <CheckCircle2 size={18} className="text-amber-500" /> : <AlertCircle size={18} />}
    <span className="text-sm font-medium tracking-wide">{message}</span>
  </motion.div>
);

// --- Skeleton Loader ---
const WishlistSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white border border-stone-100 p-4 rounded-sm">
        <div className="h-64 bg-stone-200 rounded-sm mb-4"></div>
        <div className="h-4 bg-stone-200 w-3/4 mb-2"></div>
        <div className="h-4 bg-stone-200 w-1/4 mb-4"></div>
        <div className="h-10 bg-stone-200 w-full"></div>
      </div>
    ))}
  </div>
);

// --- Main Component ---
const MyWishlist = () => {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading, error } = useSelector(state => state.wishlist);
  
  const [sortBy, setSortBy] = useState('recent');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  
  // Toast State
  const [toast, setToast] = useState(null); // { message, type }

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleRemoveClick = (item) => {
    setItemToRemove(item);
    setShowConfirmModal(true);
  };

  const confirmRemove = async () => {
    if (itemToRemove) {
      try {
        await dispatch(removeFromWishlist(itemToRemove._id)).unwrap();
        setShowConfirmModal(false);
        setItemToRemove(null);
        showToast('Item removed from wishlist', 'success');
      } catch (err) {
        showToast('Failed to remove item', 'error');
      }
    }
  };

  const handleMoveToCart = async (item) => {
    setAddingToCart(item._id);
    try {
      const newItem = {
        product: item._id,
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.basePrice,
        selectedCustomizations: {},
        measurements: {},
      };

      dispatch(addItemToCart(newItem));
      await dispatch(removeFromWishlist(item._id)).unwrap();
      showToast(`Added ${item.name} to bag`);
    } catch (err) {
      showToast('Failed to add to cart', 'error');
    } finally {
      setAddingToCart(null);
    }
  };

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'recent': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'price-low': return (a.basePrice || 0) - (b.basePrice || 0);
      case 'price-high': return (b.basePrice || 0) - (a.basePrice || 0);
      case 'name': return (a.name || '').localeCompare(b.name || '');
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-montserrat text-stone-800">
      
      {/* Toast Container */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="font-marcellus text-4xl text-stone-900 mb-2">My Wishlist</h1>
            <p className="text-stone-500 font-light text-sm">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} curated for your collection.
            </p>
          </div>

          <div className="relative group">
            <div className="flex items-center gap-2 border border-stone-300 rounded-sm px-4 py-2 bg-white hover:border-amber-700 transition-colors">
              <Filter size={16} className="text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-xs font-bold uppercase tracking-widest text-stone-700 cursor-pointer appearance-none pr-4"
              >
                <option value="recent">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <WishlistSkeleton />
        ) : error ? (
          <div className="text-center py-20 bg-white border border-stone-100 rounded-sm">
            <AlertCircle size={48} className="mx-auto text-red-300 mb-4" />
            <h3 className="font-marcellus text-xl text-stone-800">Something went wrong</h3>
            <button onClick={() => dispatch(fetchWishlist())} className="mt-4 text-xs font-bold uppercase tracking-widest border-b border-stone-900 pb-1 hover:text-amber-700 hover:border-amber-700">Try Again</button>
          </div>
        ) : wishlistItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-stone-100 rounded-sm p-16 text-center shadow-sm"
          >
            <Heart size={48} className="mx-auto text-stone-300 mb-6" strokeWidth={1} />
            <h3 className="font-marcellus text-2xl text-stone-900 mb-2">Your Wishlist is Empty</h3>
            <p className="text-stone-500 font-light mb-8 max-w-md mx-auto">
              Save your favorite royal ensembles here to view or buy them later.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-amber-700 transition-colors"
            >
              Start Curating <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {sortedItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={item._id}
                  className="group bg-white border border-stone-100 rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="relative overflow-hidden aspect-[3/4]">
                    <img
                      src={item.imageUrl || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    <button
                      onClick={() => handleRemoveClick(item)}
                      className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-stone-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 duration-300"
                      title="Remove"
                    >
                      <X size={16} />
                    </button>

                    <div className="absolute top-2 left-2">
                        <span className="bg-stone-900/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
                            {item.category}
                        </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <Link to={`/products/${item._id}`} className="mb-2 block">
                      <h3 className="font-marcellus text-lg text-stone-900 leading-tight group-hover:text-amber-700 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < Math.floor(item.rating || 0) ? "currentColor" : "none"} className={i < Math.floor(item.rating || 0) ? "" : "text-stone-300"} />
                            ))}
                        </div>
                        <span className="text-xs text-stone-400">({item.numReviews || 0})</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-stone-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-stone-900">₹{Number(item.basePrice).toFixed(2)}</span>
                        </div>
                        
                        <button
                            onClick={() => handleMoveToCart(item)}
                            disabled={addingToCart === item._id}
                            className="w-full bg-stone-100 text-stone-800 py-3 text-xs font-bold uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-colors flex items-center justify-center gap-2 disabled:bg-stone-50 disabled:text-stone-300"
                        >
                            {addingToCart === item._id ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <ShoppingBag size={14} />
                            )}
                            {addingToCart === item._id ? 'Adding...' : 'Add to Bag'}
                        </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-sm shadow-2xl max-w-sm w-full p-6 text-center border-t-4 border-amber-600"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
                <Trash2 size={24} />
              </div>
              <h3 className="font-marcellus text-xl text-stone-900 mb-2">Remove Item?</h3>
              <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-stone-800">"{itemToRemove?.name}"</span> from your wishlist?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-3 border border-stone-200 text-stone-600 text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className="flex-1 px-4 py-3 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyWishlist;