import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Heart, ChevronDown, Check, Loader2, Minus, Plus, 
  ShoppingBag, ArrowLeft, Share2, Ruler 
} from 'lucide-react';

import { addItemToCart } from '../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../features/wishlist/wishlistSlice';
import api from '../api/AxiosAPI';
import { insta2 } from '../assets/index';

// --- Toast Notification ---
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, x: '-50%' }}
    animate={{ opacity: 1, y: 0, x: '-50%' }}
    exit={{ opacity: 0, y: 20, x: '-50%' }}
    className={`fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-sm shadow-xl border min-w-[300px] ${
      type === 'success' ? 'bg-stone-900 text-white border-stone-800' : 'bg-red-50 text-red-800 border-red-100'
    }`}
  >
    {type === 'success' ? <Check size={16} className="text-amber-500" /> : <Heart size={16} />}
    <span className="text-xs font-bold uppercase tracking-wide">{message}</span>
  </motion.div>
);

// --- Skeleton Loader ---
const LoadingSkeleton = () => (
  <div className="container mx-auto max-w-7xl px-4 py-16 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-4">
        <div className="bg-stone-200 h-[600px] rounded-sm"></div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-stone-200 h-24 rounded-sm"></div>)}
        </div>
      </div>
      <div className="space-y-8 lg:pt-10">
        <div className="space-y-4">
          <div className="h-4 bg-stone-200 w-1/4"></div>
          <div className="h-12 bg-stone-200 w-3/4"></div>
          <div className="h-6 bg-stone-200 w-1/3"></div>
        </div>
        <div className="h-16 bg-stone-200 w-full rounded-sm"></div>
        <div className="h-16 bg-stone-200 w-full rounded-sm"></div>
      </div>
    </div>
  </div>
);

// --- Image Gallery ---
const ImageGallery = ({ images = [], productName }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  useEffect(() => {
    if (images.length > 0) setMainImage(images[0]);
  }, [images]);

  if (!images.length) return <div className="aspect-[3/4] bg-stone-100 rounded-sm"></div>;

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-24 h-fit">
      <motion.div
        key={mainImage}
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="aspect-[3/4] w-full bg-stone-100 rounded-sm overflow-hidden border border-stone-100 relative group"
      >
        <img
          src={mainImage}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className="grid grid-cols-5 gap-2">
        {images.map((img, index) => (
          <div
            key={index}
            className={`aspect-square cursor-pointer border transition-all duration-300 ${mainImage === img ? 'border-stone-900 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
            onClick={() => setMainImage(img)}
          >
            <img
              src={img}
              alt={`Thumbnail ${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Customization Accordion ---
const CustomizationAccordion = ({ title, options, selectedOption, onSelect }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-stone-200">
      <button
        className="w-full flex justify-between items-center py-4 text-left group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-marcellus text-sm text-stone-800 group-hover:text-amber-700 transition-colors">{title}</span>
        {isOpen ? <Minus size={16} className="text-stone-400" /> : <Plus size={16} className="text-stone-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 grid grid-cols-2 gap-3">
              {options.map(option => (
                <button
                  key={option.optionName}
                  onClick={() => onSelect(title, option)}
                  className={`p-3 text-xs border transition-all duration-200 text-center flex flex-col items-center justify-center gap-1 ${
                    selectedOption === option.optionName
                      ? 'border-stone-900 bg-stone-900 text-white shadow-md'
                      : 'border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <span className="font-bold uppercase tracking-wider">{option.optionName}</span>
                  {option.additionalPrice > 0 && (
                    <span className={`text-[10px] ${selectedOption === option.optionName ? 'text-stone-300' : 'text-stone-400'}`}>+₹{option.additionalPrice}</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Details Accordion ---
const DetailsAccordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-stone-200 last:border-0">
      <button
        className="w-full flex justify-between items-center py-4 text-left group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-xs uppercase tracking-widest text-stone-500 group-hover:text-stone-900 transition-colors">{title}</span>
        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-sm text-stone-600 font-light leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Star Rating ---
const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={i < Math.floor(rating) ? "fill-amber-700 text-amber-700" : "text-stone-300"} 
      />
    ))}
  </div>
);

// --- Reviews Section ---
const ReviewsSection = ({ reviews, productId, userInfo, onReviewSubmitted, hasUserReviewed }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      onReviewSubmitted();
      setShowForm(false);
      setComment('');
    } catch (err) {
      alert('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-stone-200 mt-20 pt-16" id="reviews">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h2 className="font-marcellus text-2xl text-stone-900 mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-2">
            <StarRating rating={reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)} />
            <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
        </div>
        {!hasUserReviewed && userInfo && !showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="border-b border-stone-900 text-stone-900 pb-1 text-xs font-bold uppercase tracking-widest hover:text-amber-700 hover:border-amber-700 transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit} 
            className="bg-stone-50 p-6 mb-10 rounded-sm"
          >
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)}>
                    <Star size={20} className={star <= rating ? "fill-amber-700 text-amber-700" : "text-stone-300"} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Review</label>
              <textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                className="w-full p-3 border border-stone-200 rounded-sm text-sm focus:outline-none focus:border-amber-700" 
                rows="4" 
                required 
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="bg-stone-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-amber-700 transition-colors disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-stone-500 text-xs font-bold uppercase tracking-widest hover:text-stone-900">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {reviews.length === 0 ? (
          <p className="text-stone-500 italic text-sm">No reviews yet. Be the first to review this royalty.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-stone-100 pb-8 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center font-marcellus text-stone-600 font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">{review.name}</p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wide">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-stone-600 text-sm font-light pl-11">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- Main Page Component ---
const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [toast, setToast] = useState(null);

  const isFavorited = useMemo(() => wishlistItems.some((item) => item._id === productId), [wishlistItems, productId]);
  const hasUserReviewed = useMemo(() => userInfo && (product?.reviews || []).some(r => r.user === userInfo._id), [userInfo, product]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${productId}`);
        setProduct(data);
        setTotalPrice(data.basePrice);
      } catch (err) {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    fetchProduct();
    if (userInfo) dispatch(fetchWishlist());
  }, [productId, dispatch, userInfo]);

  const handleCustomizationSelect = (name, option) => {
    const newSelections = { ...selectedCustomizations, [name]: option };
    setSelectedCustomizations(newSelections);
    let newTotal = product.basePrice;
    Object.values(newSelections).forEach(sel => { newTotal += sel.additionalPrice; });
    setTotalPrice(newTotal);
  };

  const toggleWishlistHandler = async () => {
    if (!userInfo) return navigate(`/login?redirect=/product/${productId}`);
    setIsTogglingWishlist(true);
    try {
      if (isFavorited) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        showToast('Removed from Wishlist', 'success');
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        showToast('Added to Wishlist', 'success');
      }
    } catch (err) {
      showToast('Action Failed', 'error');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const addToCartHandler = async () => {
    setIsAddingToCart(true);
    const simpleCustomizations = {};
    for (const key in selectedCustomizations) {
      simpleCustomizations[key] = selectedCustomizations[key].optionName;
    }

    const newItem = {
      product: product._id,
      name: product.name,
      imageUrl: product.gallery ? product.gallery[0] : product.imageUrl,
      price: totalPrice,
      selectedCustomizations: simpleCustomizations,
    };

    try {
      await dispatch(addItemToCart(newItem)).unwrap();
      showToast('Added to Bag', 'success');
    } catch (err) {
      showToast('Failed to add to bag', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center text-stone-500">{error || 'Product not found'}</div>;

  return (
    <div className="bg-[#FDFBF7] font-montserrat text-stone-800">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
            <Link to="/products" className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-amber-700 flex items-center gap-2 transition-colors">
                <ArrowLeft size={14} /> Back to Collection
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery - Sticky */}
          <div className="lg:col-span-7">
            <ImageGallery images={product.gallery || [product.imageUrl]} productName={product.name} />
          </div>

          {/* Details - Scrollable */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-6 border-b border-stone-200 pb-6">
              <span className="text-amber-700 text-xs font-bold uppercase tracking-[0.2em] mb-2 block">{product.category}</span>
              <h1 className="font-marcellus text-4xl text-stone-900 mb-2 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                    <StarRating rating={product.rating} />
                    <span className="text-xs text-stone-500 ml-1">({product.numReviews})</span>
                </div>
                <button className="text-stone-400 hover:text-stone-900 transition-colors"><Share2 size={18} /></button>
              </div>
              <p className="text-3xl font-marcellus text-stone-900">₹{totalPrice.toFixed(2)}</p>
            </div>

            {/* Customizations */}
            <div className="mb-8">
              {(product.customizations || []).map(customization => (
                <CustomizationAccordion
                  key={customization.name}
                  title={customization.name}
                  options={customization.options}
                  selectedOption={selectedCustomizations[customization.name]?.optionName}
                  onSelect={handleCustomizationSelect}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-10">
              <button
                onClick={addToCartHandler}
                disabled={isAddingToCart}
                className="flex-1 bg-stone-900 text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-amber-700 transition-all disabled:bg-stone-400 flex items-center justify-center gap-2"
              >
                {isAddingToCart ? <Loader2 className="animate-spin" size={16} /> : <ShoppingBag size={16} />}
                {isAddingToCart ? 'Adding...' : 'Add to Bag'}
              </button>
              <button
                onClick={toggleWishlistHandler}
                disabled={isTogglingWishlist}
                className={`p-4 border transition-colors ${isFavorited ? 'border-red-200 bg-red-50 text-red-500' : 'border-stone-200 hover:border-stone-900 text-stone-400 hover:text-stone-900'}`}
              >
                {isTogglingWishlist ? <Loader2 className="animate-spin" size={20} /> : <Heart size={20} className={isFavorited ? 'fill-current' : ''} />}
              </button>
            </div>

            {/* Info Accordions */}
            <div className="space-y-2">
                <DetailsAccordion title="Description" defaultOpen={true}>
                    {product.description}
                </DetailsAccordion>
                <DetailsAccordion title="Size & Fit">
                    Our garments are tailored to standard Indian sizing. <br/>
                    <Link to="/profile" className="text-amber-700 hover:underline flex items-center gap-1 mt-2 font-medium"><Ruler size={14}/> Check Size Guide</Link>
                </DetailsAccordion>
                <DetailsAccordion title="Shipping & Returns">
                    Free shipping on all domestic orders over ₹5000. Returns accepted within 7 days of delivery for unworn items with tags attached.
                </DetailsAccordion>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <ReviewsSection 
            reviews={product.reviews || []} 
            productId={productId} 
            userInfo={userInfo} 
            onReviewSubmitted={async () => {
                const { data } = await api.get(`/products/${productId}`);
                setProduct(data);
            }} 
            hasUserReviewed={hasUserReviewed} 
        />

        {/* Promo Banner */}
        <div className="mt-24 relative rounded-sm overflow-hidden h-80 group">
            <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition-colors z-10"></div>
            <img src={insta2} alt="Royal Collection" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-6">
                <h2 className="font-marcellus text-4xl md:text-5xl mb-4">The Royal Edit</h2>
                <p className="text-stone-200 max-w-lg mb-8 font-light">Discover pieces that blend timeless heritage with modern elegance.</p>
                <Link to="/products" className="bg-white text-stone-900 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-amber-50 transition-colors">Explore Collection</Link>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;