import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWishlist,
  removeFromWishlist
} from '../features/wishlist/wishlistSlice';
import { addItemToCart } from '../features/cart/cartSlice';
import { Heart, ShoppingCart, X, Star, Package, Filter } from 'lucide-react';

const MyWishlist = () => {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading, error } = useSelector(state => state.wishlist);
  const [sortBy, setSortBy] = useState('recent');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        // Error will be cleared when next action is dispatched
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
      } catch (err) {
        // Error will be shown from Redux state
      }
    }
  };

  const cancelRemove = () => {
    setShowConfirmModal(false);
    setItemToRemove(null);
  };

  const handleMoveToCart = async (item) => {
    setAddingToCart(item._id);

    try {
      // Use the same cart action as ProductCard
      const newItem = {
        product: item._id,
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.basePrice,
        selectedCustomizations: {},
        measurements: {},
      };

      dispatch(addItemToCart(newItem));

      // Remove from wishlist after successful cart addition
      await dispatch(removeFromWishlist(item._id)).unwrap();

      // Show success feedback
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successDiv.textContent = `${item.name} added to cart!`;
      document.body.appendChild(successDiv);

      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          document.body.removeChild(successDiv);
        }
      }, 3000);

    } catch (err) {
      // Show error feedback
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.textContent = 'Failed to add to cart';
      document.body.appendChild(errorDiv);

      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 3000);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleSortChange = (e) => setSortBy(e.target.value);

  // Sort wishlist items with correct property names
  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'price-low':
        return (a.basePrice || 0) - (b.basePrice || 0);
      case 'price-high':
        return (b.basePrice || 0) - (a.basePrice || 0);
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const totalItems = wishlistItems.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchWishlist())}
            className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="font-marcellus text-3xl text-gray-900 mb-2 flex items-center">
                  <Heart className="mr-3 text-red-500" size={32} />
                  My Wishlist
                </h1>
                <p className="text-gray-600">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} saved for later
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2">
                  <Filter className="mr-2 text-gray-400" size={18} />
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="bg-transparent border-none focus:outline-none text-sm font-medium"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Product Name</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {wishlistItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12">
              <div className="text-center max-w-md mx-auto">
                <div className="text-gray-300 mb-6">
                  <Heart size={80} className="mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-8">
                  Discover amazing products and save your favorites here for easy access later.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition font-medium"
                >
                  <Package className="mr-2" size={20} />
                  Start Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedItems.map((item) => {
                const itemPrice = item.basePrice || 0;
                const itemName = item.name || 'Unknown Product';
                const itemCategory = item.category || 'Uncategorized';
                const itemImage = item.imageUrl || '/placeholder-image.jpg';
                const itemRating = item.rating || 0;
                const itemNumReviews = item.numReviews || 0;
                const itemId = item._id || item.id;

                return (
                  <div key={itemId} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col">
                    <div className="relative overflow-hidden">
                      <img
                        src={itemImage}
                        alt={itemName}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveClick(item)}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        aria-label="Remove from wishlist"
                      >
                        <X size={18} />
                      </button>

                      {/* Category tag */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                          {itemCategory}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="mb-3">
                        <Link
                          to={`/products/${itemId}`}
                          className="text-lg font-semibold text-gray-900 hover:text-slate-600 transition-colors line-clamp-2"
                        >
                          {itemName}
                        </Link>
                      </div>

                      {/* Rating */}
                      {itemRating > 0 ? (
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={`${i < Math.floor(itemRating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">
                            {itemRating.toFixed(1)} ({itemNumReviews})
                          </span>
                        </div>
                      ) : (
                        <div className="h-[20px] mb-3" /> // Placeholder to maintain height
                      )}

                      <div className="flex-grow" />

                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-gray-900">
                          ${itemPrice.toFixed(2)}
                        </span>
                      </div>

                      {/* Add to cart button */}
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={addingToCart === itemId}
                        className="w-full bg-slate-900 text-white py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingToCart === itemId ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2" size={20} />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom section */}
          {wishlistItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <p className="text-gray-600 text-sm">
                  💡 Items in your wishlist are saved permanently until you remove them.
                </p>
                <Link
                  to="/products"
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
                >
                  <Package className="mr-2" size={18} />
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Remove from Wishlist
              </h3>
              <p className="text-gray-600">
                Are you sure you want to remove "{itemToRemove?.name}" from your wishlist?
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={cancelRemove}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyWishlist;