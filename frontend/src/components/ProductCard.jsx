import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addItemToCart } from '../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { items: wishlist } = useSelector((state) => state.wishlist);
  const isFavorited = wishlist.some((p) => p._id === product._id);

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent link navigation when clicking the button

    const newItem = {
      product: product._id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.basePrice,
      selectedCustomizations: {},
      measurements: {},
    };

    dispatch(addItemToCart(newItem));
    toast.success(`${product.name} added to cart!`);
  };

  const toggleWishlistHandler = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent link navigation

    if (isFavorited) {
      dispatch(removeFromWishlist(product._id));
      toast.error(`${product.name} removed from wishlist`);
    } else {
      dispatch(addToWishlist(product));
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  return (
    <div className="group relative bg-white overflow-hidden rounded-lg transition-shadow duration-300 hover:shadow-xl">
      <Link to={`/products/${product._id}`} className="cursor-pointer">
        {/* --- Wishlist Button --- */}
        <button
          onClick={toggleWishlistHandler}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${isFavorited ? 'bg-red-500/90' : 'bg-white/80 backdrop-blur-sm'
            } hover:scale-110 active:scale-100`}
          aria-label="Toggle Wishlist"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transition-all duration-300 ${isFavorited ? 'text-white' : 'text-slate-700'
              }`}
            fill={isFavorited ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
            />
          </svg>
        </button>

        {/* --- Image Container --- */}
        <div className="relative overflow-hidden bg-zinc-100 aspect-[3/4]">
          <img
            src={product.imageUrl || "https://placehold.co/600x800/f2f2f2/334155?text=Rely+Tailors"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>

      {/* --- Info and Action Container --- */}
      <div className="relative text-left p-4">
        {/* --- Text block (visible by default) --- */}
        <div className="transition-opacity duration-300 opacity-100 group-hover:opacity-0">
          <h3 className="font-marcellus text-xl text-slate-900 truncate" title={product.name}>
            {product.name}
          </h3>
          <p className="text-slate-800 text-lg font-medium mt-1">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.basePrice)}
          </p>
        </div>

        {/* --- 'Add to Cart' block (appears on hover) --- */}
        <div className="absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <button
            onClick={addToCartHandler}
            className="w-full bg-slate-800 text-white font-semibold py-3 px-6 rounded-md text-sm uppercase tracking-wider hover:bg-slate-900 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;