import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ChevronDown, Check, Loader2, Minus, Plus } from 'lucide-react';

import { addItemToCart } from '../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../features/wishlist/wishlistSlice';
import api from '../api/AxiosAPI';
import { insta2 } from '../assets/index';

// --- UI & Helper Components ---

const LoadingSkeleton = () => (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 animate-pulse">
            {/* Image Skeleton */}
            <div className="flex flex-col gap-4">
                <div className="bg-slate-200 h-[550px] rounded-lg"></div>
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-slate-200 h-28 rounded-md"></div>
                    <div className="bg-slate-200 h-28 rounded-md"></div>
                    <div className="bg-slate-200 h-28 rounded-md"></div>
                    <div className="bg-slate-200 h-28 rounded-md"></div>
                </div>
            </div>
            {/* Details Skeleton */}
            <div className="lg:pl-8">
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
                <div className="h-10 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
                <div className="h-12 bg-slate-200 rounded w-1/2 mb-10"></div>
                <div className="space-y-4">
                    <div className="h-16 bg-slate-200 rounded-md"></div>
                    <div className="h-16 bg-slate-200 rounded-md"></div>
                </div>
                <div className="h-16 bg-slate-200 rounded-lg mt-10"></div>
                <div className="mt-12 space-y-4">
                    <div className="h-12 bg-slate-200 rounded-md"></div>
                    <div className="h-12 bg-slate-200 rounded-md"></div>
                    <div className="h-12 bg-slate-200 rounded-md"></div>
                </div>
            </div>
        </div>
    </div>
);

const ImageGallery = ({ images = [], productName }) => {
    const [mainImage, setMainImage] = useState(images[0]);

    useEffect(() => {
        if (images.length > 0) {
            setMainImage(images[0]);
        }
    }, [images]);

    if (!images || images.length === 0) {
        return <div className="aspect-square bg-slate-100 rounded-lg"></div>;
    }

    return (
        <div className="flex flex-col gap-4 lg:sticky top-24">
            <motion.div
                key={mainImage}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="aspect-w-1 aspect-h-1 bg-slate-100 rounded-lg overflow-hidden shadow-sm"
            >
                <img
                    src={mainImage}
                    alt={productName}
                    className="w-full h-full object-cover object-center"
                />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden cursor-pointer ring-2 transition-all duration-300 ${mainImage === img ? 'ring-slate-900 ring-offset-2' : 'ring-transparent hover:ring-slate-300'}`}
                        onClick={() => setMainImage(img)}
                    >
                        <img
                            src={img}
                            alt={`${productName} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const CustomizationAccordion = ({ title, options, selectedOption, onSelect }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-slate-200">
            <button
                className="w-full flex justify-between items-center py-5 text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold text-base text-slate-800">{title}</span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {options.map(option => (
                                <button
                                    key={option.optionName}
                                    className={`p-3 border rounded-md text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500 ${selectedOption === option.optionName
                                        ? 'border-slate-800 bg-slate-800 text-white shadow-md scale-105'
                                        : 'border-slate-300 bg-white hover:border-slate-500'
                                        }`}
                                    onClick={() => onSelect(title, option)}
                                >
                                    <p className="font-medium text-sm">{option.optionName}</p>
                                    {option.additionalPrice > 0 && (
                                        <p className="text-xs opacity-80 mt-1">+₹{option.additionalPrice.toFixed(2)}</p>
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

const DetailsAccordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200">
            <button
                className="w-full flex justify-between items-center py-5 text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold text-base text-slate-800">{title}</span>
                {isOpen ? <Minus className="w-5 h-5 text-slate-500" /> : <Plus className="w-5 h-5 text-slate-500" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 prose prose-slate max-w-none text-slate-600">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


const StarRating = ({ rating, setRating, size = "md" }) => {
    const starSizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    return (
        <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <button type="button" key={ratingValue} onClick={() => setRating?.(ratingValue)} disabled={!setRating} className={setRating ? 'cursor-pointer' : ''}>
                        <Star className={`${starSizeClass} transition-colors ${ratingValue <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                );
            })}
        </div>
    );
};

const Notification = ({ message, type }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.5 }}
        className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-6 py-3 rounded-lg shadow-2xl text-white font-semibold ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
    >
        {type === 'success' ? <Check className="h-5 w-5" /> : <Heart className="h-5 w-5" />}
        <span>{message}</span>
    </motion.div>
);

const ReviewsSection = ({ reviews, productId, userInfo, onReviewSubmitted, hasUserReviewed }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loadingReview, setLoadingReview] = useState(false);
    const [errorReview, setErrorReview] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);

    const ratingDistribution = useMemo(() => {
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            if (review.rating >= 1 && review.rating <= 5) {
                counts[review.rating]++;
            }
        });
        return counts;
    }, [reviews]);

    const totalReviews = reviews.length;

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setLoadingReview(true);
        setErrorReview('');
        try {
            await api.post(`/products/${productId}/reviews`, { rating, comment });
            setRating(5);
            setComment('');
            setShowReviewForm(false);
            onReviewSubmitted();
        } catch (err) {
            setErrorReview(err.response?.data?.message || 'Error submitting review.');
        } finally {
            setLoadingReview(false);
        }
    };

    return (
        <div id="reviews" className="bg-slate-50/50 py-16 sm:py-24">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
                    <div className="lg:col-span-4">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Customer Feedback</h2>
                        <div className="mt-3 flex items-center">
                            <StarRating rating={reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews} />
                            <p className="ml-2 text-sm text-slate-900">Based on {totalReviews} reviews</p>
                        </div>
                        <div className="mt-6 space-y-3">
                            {[5, 4, 3, 2, 1].map(star => (
                                <div key={star} className="flex items-center text-sm">
                                    <dt className="flex-none flex items-center">
                                        <p className="w-3 font-semibold text-slate-700">{star}</p>
                                        <Star className="ml-1 h-4 w-4 fill-amber-400 text-amber-400" />
                                    </dt>
                                    <dd className="ml-3 w-full flex items-center">
                                        <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="bg-amber-400 h-full rounded-full"
                                                style={{ width: `${totalReviews > 0 ? (ratingDistribution[star] / totalReviews) * 100 : 0}%` }}
                                            />
                                        </div>
                                        <span className="ml-3 w-9 text-right text-slate-600 text-xs">
                                            {totalReviews > 0 ? `${Math.round((ratingDistribution[star] / totalReviews) * 100)}%` : '0%'}
                                        </span>
                                    </dd>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10">
                            <h3 className="text-lg font-medium text-slate-900">Share your thoughts</h3>
                            <p className="mt-1 text-sm text-slate-600">If you’ve used this product, share your thoughts with other customers.</p>
                            {!hasUserReviewed && userInfo && (
                                <button
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    className="mt-6 w-full bg-white border border-slate-300 rounded-md py-2.5 px-8 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    Write a review
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="lg:col-span-8">
                        <AnimatePresence>
                            {showReviewForm && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8"
                                >
                                    <h3 className="font-semibold text-lg mb-4 text-slate-900">Write a Review</h3>
                                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                                        {errorReview && <p className="text-red-500 text-sm">{errorReview}</p>}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Your Rating</label>
                                            <StarRating rating={rating} setRating={setRating} />
                                        </div>
                                        <div>
                                            <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-2">Your Review</label>
                                            <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows="4" className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition" placeholder="Share your experience..."></textarea>
                                        </div>
                                        <div className="flex justify-end items-center gap-4">
                                            <button type="button" onClick={() => setShowReviewForm(false)} className="text-sm font-medium text-slate-600 hover:text-slate-900">Cancel</button>
                                            <button type="submit" disabled={loadingReview} className="bg-slate-900 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 disabled:bg-slate-400">
                                                {loadingReview && <Loader2 className="h-4 w-4 animate-spin" />}
                                                {loadingReview ? 'Submitting...' : 'Submit Review'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="space-y-10">
                            {reviews.length === 0 && <p className="text-slate-600">No reviews yet. Be the first to share your thoughts!</p>}
                            {reviews.map(r => (
                                <div key={r._id} className="flex gap-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 text-lg">{r.name.charAt(0).toUpperCase()}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-slate-900">{r.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                            <StarRating rating={r.rating} size="sm" />
                                        </div>
                                        <div className="mt-4 prose prose-slate max-w-none text-slate-600"><p>{r.comment}</p></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {!userInfo && (
                            <div className="mt-10 text-center text-sm text-slate-600 border-t border-slate-200 pt-8">
                                <p>Please <Link to="/login" className="font-semibold text-slate-800 underline hover:text-slate-600">sign in</Link> to write a review.</p>
                            </div>
                        )}
                        {hasUserReviewed && !showReviewForm && (
                            <div className="mt-10 text-center text-sm text-slate-600 border-t border-slate-200 pt-8">
                                <p className="flex items-center justify-center gap-2"><Check className="w-4 h-4 text-green-600" /> You've already reviewed this product.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Component ---

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
    const [notification, setNotification] = useState(null);

    const isFavorited = useMemo(() => wishlistItems.some((item) => item._id === productId), [wishlistItems, productId]);
    const hasUserReviewed = useMemo(() => userInfo && (product?.reviews || []).some(r => r.user === userInfo._id), [userInfo, product]);

    const showNotification = (message, type = 'success') => {
        setNotification({ id: Date.now(), message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/products/${productId}`);
            setProduct(data);
            setTotalPrice(data.basePrice);
        } catch (err) {
            setError('Product not found. It might have been removed or the link is incorrect.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProduct();
        if (userInfo) {
            dispatch(fetchWishlist());
        }
    }, [productId, dispatch, userInfo]);

    const handleCustomizationSelect = (customizationName, option) => {
        const newSelections = { ...selectedCustomizations, [customizationName]: option };
        setSelectedCustomizations(newSelections);
        let newTotal = product.basePrice;
        Object.values(newSelections).forEach(sel => { newTotal += sel.additionalPrice; });
        setTotalPrice(newTotal);
    };

    const toggleWishlistHandler = async () => {
        if (!userInfo) {
            navigate('/login?redirect=/product/' + productId);
            return;
        }
        setIsTogglingWishlist(true);
        try {
            if (isFavorited) {
                await dispatch(removeFromWishlist(productId)).unwrap();
                showNotification('Removed from wishlist');
            } else {
                await dispatch(addToWishlist(productId)).unwrap();
                showNotification('Added to wishlist');
            }
        } catch (err) {
            showNotification(err.message || 'Failed to update wishlist', 'error');
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
            showNotification(`${product.name} added to cart!`);
            navigate('/checkout');
        } catch (err) {
            showNotification('Failed to add item to cart', 'error');
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (loading) return <LoadingSkeleton />;
    if (error) return <div className="text-center py-20 text-red-600 bg-red-50 h-screen flex items-center justify-center flex-col"><h2 className="text-2xl font-semibold">Oops! Something went wrong.</h2><p className="mt-2">{error}</p><Link to="/" className="mt-6 bg-slate-800 text-white font-semibold py-2 px-6 rounded-lg">Go Home</Link></div>;
    if (!product) return null;

    return (
        <>
            <div className="bg-white font-sans">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                        {/* Left Column: Image Gallery */}
                        <ImageGallery images={product.gallery || [product.imageUrl]} productName={product.name} />

                        {/* Right Column: Product Details */}
                        <div className="lg:pl-8 flex flex-col">
                            <div>
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{product.category}</p>
                                <h1 className="font-marcellus text-4xl md:text-5xl font-bold text-slate-900 mt-2">{product.name}</h1>

                                <div className="flex items-center gap-4 mt-4">
                                    <StarRating rating={product.rating} />
                                    <a href="#reviews" className="text-slate-500 text-sm hover:underline">({product.numReviews} reviews)</a>
                                </div>
                                <p className=" text-4xl font-marcellus text-slate-800 my-6">₹{totalPrice.toFixed(2)}</p>
                            </div>

                            <div className="mt-6">
                                <h2 className="text-lg font-semibold mb-2 text-slate-900">Customize Your Garment</h2>
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

                            <div className="mt-10 flex items-stretch gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleWishlistHandler}
                                    disabled={isTogglingWishlist}
                                    className={`p-4 border rounded-lg transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${isFavorited
                                        ? 'bg-red-50 border-red-200 text-red-500'
                                        : 'bg-white border-slate-300 text-slate-500 hover:border-red-400 hover:text-red-500'
                                        }`}
                                >
                                    {isTogglingWishlist ? <Loader2 className="h-6 w-6 animate-spin" /> : <Heart className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`} />}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: '0 10px 20px -5px rgb(0 0 0 / 0.1)' }}
                                    whileTap={{ scale: 0.98, boxShadow: '0 5px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    onClick={addToCartHandler}
                                    disabled={isAddingToCart}
                                    className="flex-1 bg-slate-900 text-white font-bold py-4 px-8 rounded-lg hover:bg-slate-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed text-base"
                                >
                                    {isAddingToCart ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Adding...</span>
                                        </>
                                    ) : (
                                        "Add to Cart"
                                    )}
                                </motion.button>
                            </div>

                            {/* Integrated Details Section */}
                            <div className="mt-12 w-full">
                                <DetailsAccordion title="Description">
                                    <p>{product.description}</p>
                                </DetailsAccordion>
                                <DetailsAccordion title="Materials & Care">
                                    {/* You can add a 'materials' field to your product schema for this */}
                                    <p>Crafted from premium, sustainably sourced fabrics. For best results, please follow the care instructions on the label. Typically, we recommend dry cleaning for our tailored garments.</p>
                                </DetailsAccordion>
                                <DetailsAccordion title="Size & Fit">
                                    <p>Our garments are tailored to your unique measurements for a flawless fit. To ensure perfection, please manage your measurements in your personal dashboard.</p>
                                    <Link to="/profile/measurements" className="inline-block mt-4 bg-slate-100 text-slate-800 font-bold py-2 px-6 rounded-lg hover:bg-slate-200 no-underline transition-colors">
                                        Manage Measurements
                                    </Link>
                                </DetailsAccordion>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ReviewsSection
                    reviews={product.reviews || []}
                    productId={productId}
                    userInfo={userInfo}
                    onReviewSubmitted={fetchProduct}
                    hasUserReviewed={hasUserReviewed}
                />

                {/* Promotional Section */}
                <div className="bg-white">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                        <div className="relative bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
                            <div className="absolute inset-0">
                                <img src={insta2} alt="Master tailor at work" className="w-full h-full object-cover opacity-30" />
                            </div>
                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
                                <div className="p-12 sm:p-16 text-white">
                                    <h2 className="font-serif text-4xl font-bold">The Rely Tailors Difference</h2>
                                    <p className="text-slate-300 mt-4 mb-8 max-w-lg">
                                        For over 35 years, we have been the architects of confidence. Our philosophy is simple: a perfect suit is a blend of art, precision, and personal expression.
                                    </p>
                                    <Link to="/about" className="inline-block bg-white text-slate-900 font-bold py-3 px-8 rounded-lg hover:bg-slate-200 no-underline transition-colors">Our Story</Link>
                                </div>
                                <div className="hidden lg:block h-full min-h-[400px]">
                                    {/* This space is intentionally left for the image to show through */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Area */}
            <AnimatePresence>
                {notification && (
                    <Notification
                        key={notification.id}
                        message={notification.message}
                        type={notification.type}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default ProductDetailPage;