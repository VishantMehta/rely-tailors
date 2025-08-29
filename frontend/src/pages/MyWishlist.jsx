import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Sample wishlist data - in a real app, this would come from your backend
const sampleWishlistItems = [
  {
    id: 1,
    productId: 101,
    name: 'Premium Slim Fit Suit',
    price: 299.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    inStock: true,
    category: 'Suits',
    addedDate: '2023-10-15'
  },
  {
    id: 2,
    productId: 102,
    name: 'Classic Wool Blazer',
    price: 189.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    inStock: true,
    category: 'Blazers',
    addedDate: '2023-10-10'
  },
  {
    id: 3,
    productId: 103,
    name: 'Cotton Dress Shirt',
    price: 79.99,
    originalPrice: 89.99,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    inStock: false,
    category: 'Shirts',
    addedDate: '2023-10-05'
  },
  {
    id: 4,
    productId: 104,
    name: 'Designer Silk Kurta',
    price: 129.99,
    originalPrice: 159.99,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    inStock: true,
    category: 'Kurtas',
    addedDate: '2023-09-28'
  }
];

const MyWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState(sampleWishlistItems);
  const [sortBy, setSortBy] = useState('recent');

  // Sort wishlist items based on selected option
  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.addedDate) - new Date(a.addedDate);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleRemoveItem = (id) => {
    if (window.confirm('Are you sure you want to remove this item from your wishlist?')) {
      setWishlistItems(wishlistItems.filter(item => item.id !== id));
    }
  };

  const handleMoveToCart = (item) => {
    // In a real app, this would dispatch an action to add to cart
    alert(`Added ${item.name} to cart!`);
    // You might want to remove it from wishlist after adding to cart
    // handleRemoveItem(item.id);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const totalItems = wishlistItems.length;
  const inStockItems = wishlistItems.filter(item => item.inStock).length;

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="font-marcellus text-2xl md:text-3xl text-slate-900 mb-4 md:mb-0">My Wishlist</h2>
        
        <div className="flex items-center space-x-4">
          <span className="text-slate-600 text-sm">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} ({inStockItems} in stock)
          </span>
          
          <div className="flex items-center">
            <label htmlFor="sort" className="text-slate-700 text-sm mr-2">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={handleSortChange}
              className="border border-slate-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="recent">Recently Added</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Product Name</option>
            </select>
          </div>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-slate-300 text-6xl mb-4">❤️</div>
          <h3 className="text-xl text-slate-700 mb-2">Your wishlist is empty</h3>
          <p className="text-slate-500 mb-6">Save your favorite items here for easy access later.</p>
          <Link
            to="/products"
            className="inline-block bg-slate-900 text-white py-3 px-6 rounded-md hover:bg-slate-700 transition text-sm uppercase tracking-widest"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedItems.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-60 object-cover"
                  />
                  
                  {!item.inStock && (
                    <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-1">
                      Out of Stock
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 hover:text-red-600 transition"
                    aria-label="Remove from wishlist"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  {item.originalPrice > item.price && (
                    <div className="absolute bottom-2 left-2 bg-amber-600 text-white text-xs px-2 py-1 rounded">
                      {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">{item.category}</p>
                  
                  <Link
                    to={`/product/${item.productId}`}
                    className="font-medium text-slate-900 hover:text-slate-700 line-clamp-2 mb-2"
                  >
                    {item.name}
                  </Link>
                  
                  <div className="flex items-center mt-3 mb-4">
                    <span className="text-slate-900 font-medium text-lg">${item.price.toFixed(2)}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-slate-500 line-through text-sm ml-2">${item.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={!item.inStock}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                        item.inStock
                          ? 'bg-slate-900 text-white hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      } transition`}
                    >
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-slate-600 text-sm">
                Items in your wishlist are saved for 90 days.
              </p>
              
              <Link
                to="/products"
                className="bg-white text-slate-900 py-2 px-6 rounded-md border border-slate-900 hover:bg-slate-100 transition text-sm uppercase tracking-widest"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyWishlist;