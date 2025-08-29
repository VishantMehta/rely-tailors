import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ChevronDown, Check, Loader2 } from 'lucide-react';

import { addItemToCart } from '../features/cart/cartSlice';
import api from '../api/AxiosAPI';
import { insta2 } from '../assets/index'; // Assuming this asset is in your project

// --- Helper Components ---

const BackgroundCubes = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
        <ul className="circles">
            {[...Array(10)].map((_, i) => <li key={i}></li>)}
        </ul>
    </div>
);

const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="space-y-4">
                <div className="bg-zinc-200 rounded-lg h-96"></div>
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-zinc-200 rounded h-24"></div>
                    <div className="bg-zinc-200 rounded h-24"></div>
                    <div className="bg-zinc-200 rounded h-24"></div>
                    <div className="bg-zinc-200 rounded h-24"></div>
                </div>
            </div>
            <div className="lg:pt-8">
                <div className="h-4 bg-zinc-200 rounded w-1/4 mb-4"></div>
                <div className="h-12 bg-zinc-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-zinc-200 rounded w-1/3 mb-6"></div>
                <div className="h-10 bg-zinc-200 rounded w-1/2 mb-10"></div>
                <div className="h-16 bg-zinc-200 rounded mb-4"></div>
                <div className="h-16 bg-zinc-200 rounded mb-8"></div>
                <div className="h-16 bg-zinc-200 rounded"></div>
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
        return <div className="aspect-w-3 aspect-h-4 bg-zinc-100 rounded-lg"></div>;
    }

    return (
        <div className="flex flex-col gap-4 sticky top-24">
            <div className="aspect-w-3 aspect-h-4 bg-zinc-100 rounded-lg overflow-hidden">
                <img src={mainImage} alt={productName} className="w-full h-full object-cover object-center" />
            </div>
            <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden cursor-pointer ring-2 transition ${mainImage === img ? 'ring-zinc-900' : 'ring-transparent hover:ring-zinc-400'}`}
                        onClick={() => setMainImage(img)}
                    >
                        <img src={img} alt={`${productName} thumbnail ${index + 1}`} className="w-full h-full object-cover object-center" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const AccordionItem = ({ title, options, selectedOption, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-zinc-200">
            <button className="w-full flex justify-between items-center py-5 text-left" onClick={() => setIsOpen(!isOpen)}>
                <span className="font-bold uppercase tracking-wider text-sm text-zinc-800">{title}</span>
                <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="py-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {options.map(option => (
                        <div key={option.optionName} className={`p-4 border rounded-md cursor-pointer text-center transition-all duration-200 ${selectedOption === option.optionName ? 'border-zinc-900 bg-zinc-900 text-white shadow-lg scale-105' : 'border-zinc-200 bg-white hover:border-zinc-500'}`} onClick={() => onSelect(title, option)}>
                            <p className="font-semibold text-sm">{option.optionName}</p>
                            {option.additionalPrice > 0 && <p className="text-xs opacity-70 mt-1">+${option.additionalPrice.toFixed(2)}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StarRating = ({ rating, setRating }) => (
    <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
                <button type="button" key={ratingValue} onClick={() => setRating?.(ratingValue)} disabled={!setRating} className={setRating ? 'cursor-pointer' : ''}>
                    <Star className={`w-5 h-5 transition-colors ${ratingValue <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-300'}`} />
                </button>
            );
        })}
    </div>
);


// --- Main Component ---

const ProductDetailPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCustomizations, setSelectedCustomizations] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [isFavorited, setIsFavorited] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Review form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loadingReview, setLoadingReview] = useState(false);
    const [errorReview, setErrorReview] = useState('');

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

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const handleCustomizationSelect = (customizationName, option) => {
        const newSelections = { ...selectedCustomizations, [customizationName]: option };
        setSelectedCustomizations(newSelections);
        let newTotal = product.basePrice;
        Object.values(newSelections).forEach(sel => { newTotal += sel.additionalPrice; });
        setTotalPrice(newTotal);
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
            navigate('/checkout');
        } catch (err) {
            console.error('Failed to add item to cart:', err);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setLoadingReview(true);
        setErrorReview('');
        try {
            await api.post(`/products/${productId}/reviews`, { rating, comment });
            setRating(5);
            setComment('');
            await fetchProduct();
        } catch (err) {
            setErrorReview(err.response?.data?.message || 'Error submitting review.');
        } finally {
            setLoadingReview(false);
        }
    };

    if (loading) return <LoadingSkeleton />;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!product) return null;

    const hasUserReviewed = userInfo && (product.reviews || []).some(r => r.user === userInfo._id);

    return (
        <div className="bg-zinc-50 font-sans">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ImageGallery images={product.gallery || [product.imageUrl]} productName={product.name} />

                    <div className="lg:pt-8">
                        <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">{product.category}</p>
                        <h1 className="font-marcellus text-4xl md:text-5xl text-zinc-900 mt-2">{product.name}</h1>
                        <div className="flex items-center gap-4 my-4">
                            <StarRating rating={product.rating} />
                            <a href="#reviews" className="text-zinc-500 text-sm hover:underline">({product.numReviews} reviews)</a>
                        </div>
                        <p className="text-4xl font-light text-zinc-800 my-6">${totalPrice.toFixed(2)}</p>

                        <div className="mt-8">
                            <h2 className="font-marcellus text-xl mb-2 text-zinc-900">Customize Your Garment</h2>
                            {(product.customizations || []).map(customization => (
                                <AccordionItem key={customization.name} title={customization.name} options={customization.options} selectedOption={selectedCustomizations[customization.name]?.optionName} onSelect={handleCustomizationSelect} />
                            ))}
                        </div>

                        <div className="mt-10 flex items-center gap-4">
                            <button onClick={() => setIsFavorited(!isFavorited)} className={`p-4 border rounded-md transition-all duration-200 ${isFavorited ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-zinc-300 text-zinc-500 hover:bg-zinc-100 hover:text-red-500'}`}>
                                <Heart className="h-6 w-6" fill={isFavorited ? 'currentColor' : 'none'} />
                            </button>
                            <button onClick={addToCartHandler} disabled={isAddingToCart} className="flex-1 bg-zinc-900 text-white font-bold py-4 px-8 rounded-lg hover:bg-zinc-700 transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-zinc-400">
                                {isAddingToCart ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    'Add to Cart'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div id="reviews" className="mt-24 pt-8">
                    <div className="border-b border-zinc-300 flex space-x-8">
                        {['description', 'reviews', 'sizing'].map(tabName => (
                            <button key={tabName} onClick={() => setActiveTab(tabName)} className={`font-marcellus text-xl pb-3 relative transition-colors ${activeTab === tabName ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'}`}>
                                {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
                                {tabName === 'reviews' && ` (${product.numReviews})`}
                                {activeTab === tabName && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" layoutId="underline" />}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="py-8 prose max-w-none"
                        >
                            {activeTab === 'description' && <p>{product.description}</p>}
                            {activeTab === 'sizing' && <div><p>We recommend managing your measurements in your personal dashboard to ensure every garment is tailored to your exact specifications for the perfect fit.</p><Link to="/profile/measurements" className="inline-block mt-6 bg-zinc-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-zinc-800 no-underline">Manage Measurements</Link></div>}
                            {activeTab === 'reviews' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <h3 className="font-marcellus text-2xl m-0">Customer Feedback</h3>
                                        {(product.reviews || []).length === 0 && <p>No reviews yet.</p>}
                                        {(product.reviews || []).map(r => (
                                            <div key={r._id} className="border-b border-zinc-200 pb-6 last:border-b-0">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-zinc-200 rounded-full flex items-center justify-center font-bold text-zinc-600">{r.name.charAt(0)}</div>
                                                    <div>
                                                        <p className="font-bold text-zinc-800 m-0">{r.name}</p>
                                                        <p className="text-xs text-zinc-500 m-0">{new Date(r.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pl-16">
                                                    <StarRating rating={r.rating} />
                                                    <p className="text-zinc-600 mt-2">{r.comment}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-white p-8 rounded-lg shadow-sm border border-zinc-200">
                                        <h3 className="font-marcellus text-2xl mb-4">Write a Review</h3>
                                        {userInfo ? (
                                            hasUserReviewed ? <p className="text-blue-600">You've already reviewed this product.</p> :
                                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                                    {errorReview && <p className="text-red-500 text-sm">{errorReview}</p>}
                                                    <div>
                                                        <label className="block text-sm font-bold mb-2">Your Rating</label>
                                                        <StarRating rating={rating} setRating={setRating} />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="comment" className="block text-sm font-bold mb-2">Your Review</label>
                                                        <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows="4" className="w-full p-3 border border-zinc-300 rounded-md focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500" placeholder="Share your experience..."></textarea>
                                                    </div>
                                                    <button type="submit" disabled={loadingReview} className="bg-zinc-900 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-zinc-800 flex items-center gap-2 disabled:bg-zinc-400">
                                                        {loadingReview && <Loader2 className="h-4 w-4 animate-spin" />}
                                                        {loadingReview ? 'Submitting...' : 'Submit Review'}
                                                    </button>
                                                </form>
                                        ) : <p>Please <Link to="/login" className="font-bold underline">sign in</Link> to write a review.</p>}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="relative mt-24 bg-white rounded-lg shadow-lg overflow-hidden">
                    <BackgroundCubes />
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center">
                        <div className="p-12 text-zinc-800">
                            <h2 className="font-marcellus text-4xl">The Rely Tailors Difference</h2>
                            <p className="text-zinc-600 mt-4 mb-6">
                                For over 35 years, we have been the architects of confidence. Our philosophy is simple: a perfect suit is a blend of art, precision, and personal expression.
                            </p>
                            <Link to="/about" className="inline-block bg-zinc-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-zinc-800 no-underline">Our Story</Link>
                        </div>
                        <div>
                            <img src={insta2} alt="Master tailor at work" className="w-full h-96 object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;