import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addItemToCart } from '../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice';
import { Check, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: wishlist } = useSelector((state) => state.wishlist);
  const isFavorited = wishlist.some((p) => p._id === product._id);

  const [isAdded, setIsAdded] = useState(false);


  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdded) return;

    const newItem = {
      product: product._id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.basePrice,
      selectedCustomizations: {},
      measurements: {},
    };

    dispatch(addItemToCart(newItem));
    setIsAdded(true);

    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-2xl rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-12 w-12 rounded-md object-cover"
                  src={product.imageUrl || "https://placehold.co/100x100"}
                  alt={product.name}
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-zinc-800">
                  {product.name}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Added to your cart!
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-zinc-200">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                navigate('/checkout');
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-zinc-600 hover:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              View Cart
            </button>
          </div>
        </div>
      ),
      { duration: 4000 }
    );

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const toggleWishlistHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

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

        <div className="relative overflow-hidden bg-zinc-100 aspect-[3/4]">
          <img
            src={product.imageUrl || "https://placehold.co/600x800/f2f2f2/334155?text=Rely+Tailors"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>

      <div className="relative text-left p-4">
        <div className="transition-opacity duration-300 opacity-100 group-hover:opacity-0">
          <h3 className="font-marcellus text-xl text-slate-900 truncate" title={product.name}>
            {product.name}
          </h3>
          <p className="text-slate-800 text-lg font-medium mt-1">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.basePrice)}
          </p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <button
            onClick={addToCartHandler}
            disabled={isAdded}
            className={`w-full flex items-center justify-center font-semibold py-3 px-6 rounded-md text-sm uppercase tracking-wider transition-colors duration-200 ${isAdded
              ? 'bg-green-600 text-white cursor-not-allowed'
              : 'bg-slate-800 text-white hover:bg-slate-900'
              }`}
          >
            {isAdded ? (
              <>
                <Check className="h-5 w-5 mr-2" /> Added
              </>
            ) : (
              'Add to Cart'
            )
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;