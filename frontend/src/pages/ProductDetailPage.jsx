import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart } from '../features/cart/cartSlice'; // 1. Import the new async thunk
import { insta2 } from '../assets';
import api from '../api/AxiosAPI';

// --- Helper Components for the Page ---

// Animated Background Component
const BackgroundCubes = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
        <ul className="circles">
            <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
        </ul>
    </div>
);

// Accordion for Customizations
const AccordionItem = ({ title, options, selectedOption, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200">
            <button className="w-full flex justify-between items-center py-4 text-left" onClick={() => setIsOpen(!isOpen)}>
                <span className="font-bold uppercase tracking-wider text-sm">{title}</span>
                <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="pb-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {options.map(option => (
                        <div key={option.optionName} className={`p-3 border rounded-md cursor-pointer text-center transition-colors ${selectedOption === option.optionName ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 hover:border-slate-400'}`} onClick={() => onSelect(title, option)}>
                            <p className="font-semibold text-sm">{option.optionName}</p>
                            {option.additionalPrice > 0 && <p className="text-xs opacity-70">+${option.additionalPrice.toFixed(2)}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Star Rating Component
const StarRating = ({ rating, setRating }) => {
    return (
        <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <button type="button" key={ratingValue} onClick={() => setRating ? setRating(ratingValue) : null} className={setRating ? 'cursor-pointer' : ''}>
                        <svg className={`w-5 h-5 ${ratingValue <= rating ? 'text-amber-500' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </button>
                );
            })}
        </div>
    );
};


// --- Main Product Detail Page Component ---
const ProductDetailPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCustomizations, setSelectedCustomizations] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [isFavorited, setIsFavorited] = useState(false);
    
    // Review Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loadingReview, setLoadingReview] = useState(false);
    const [errorReview, setErrorReview] = useState('');
    
    const { userInfo } = useSelector((state) => state.auth);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/products/${productId}`);
            setProduct(data);
            setTotalPrice(data.basePrice);
            setLoading(false);
        } catch (err) {
            setError('Product not found.');
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
        Object.values(newSelections).forEach(selectedOption => { newTotal += selectedOption.additionalPrice; });
        setTotalPrice(newTotal);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setLoadingReview(true);
        try {
            await api.post(`/products/${productId}/reviews`, { rating, comment });
            setLoadingReview(false);
            setRating(5);
            setComment('');
            fetchProduct(); // Re-fetch product to show the new review
        } catch (err) {
            setErrorReview(err.response?.data?.message || 'Error submitting review.');
            setLoadingReview(false);
        }
    };

    // 2. Update the Add to Cart Handler to be async
    const addToCartHandler = async () => {
        const simpleCustomizations = {};
        for (const key in selectedCustomizations) {
            simpleCustomizations[key] = selectedCustomizations[key].optionName;
        }

        const newItem = {
            product: product._id,
            name: product.name,
            imageUrl: product.imageUrl,
            price: totalPrice,
            selectedCustomizations: simpleCustomizations,
        };
        
        // 3. await the dispatch to ensure the API call finishes
        await dispatch(addItemToCart(newItem));
        navigate('/checkout');
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!product) return null;

    const hasUserReviewed = userInfo && (product.reviews || []).some(r => r.user === userInfo._id);

    return (
        <div className="bg-[#f2f2f2] font-montserrat">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Sticky Image */}
                    <div className="lg:sticky top-24 h-screen max-h-[80vh]">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" data-aos="zoom-in" />
                    </div>

                    {/* Right Column: Details & Customizations */}
                    <div className="lg:pt-8">
                        <div data-aos="fade-left">
                            <p className="text-sm text-slate-500 uppercase tracking-widest">{product.category}</p>
                            <h1 className="font-marcellus text-4xl md:text-5xl text-slate-900 mt-2">{product.name}</h1>
                            <div className="flex items-center gap-2 my-4">
                                <StarRating rating={product.rating} />
                                <span className="text-slate-500 text-sm">({product.numReviews} reviews)</span>
                            </div>
                            <p className="text-2xl text-slate-700 my-4">${totalPrice.toFixed(2)}</p>
                        </div>
                        
                        <div className="mt-8" data-aos="fade-left" data-aos-delay="200">
                            <h2 className="font-marcellus text-xl mb-4">Customize Your Garment</h2>
                            {(product.customizations || []).map(customization => (
                                <AccordionItem key={customization.name} title={customization.name} options={customization.options} selectedOption={selectedCustomizations[customization.name]?.optionName} onSelect={handleCustomizationSelect} />
                            ))}
                        </div>

                        <div className="mt-10 flex items-center gap-4" data-aos="fade-up" data-aos-delay="400">
                            <button onClick={() => setIsFavorited(!isFavorited)} className={`p-4 border rounded-md transition-colors ${isFavorited ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-slate-300 hover:bg-slate-100'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
                            </button>
                            <button onClick={addToCartHandler} className="flex-1 bg-slate-900 text-white font-bold py-4 px-8 rounded-md hover:bg-slate-800 transition-colors duration-300 text-sm uppercase tracking-widest">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Bottom Section: Tabs --- */}
                <div className="mt-24" data-aos="fade-up">
                    <div className="border-b border-slate-300 flex space-x-8">
                        <button onClick={() => setActiveTab('description')} className={`font-marcellus text-xl pb-2 transition-colors ${activeTab === 'description' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Description</button>
                        <button onClick={() => setActiveTab('reviews')} className={`font-marcellus text-xl pb-2 transition-colors ${activeTab === 'reviews' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Reviews ({product.numReviews})</button>
                        <button onClick={() => setActiveTab('sizing')} className={`font-marcellus text-xl pb-2 transition-colors ${activeTab === 'sizing' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Size & Fit</button>
                    </div>

                    <div className="py-8">
                        {activeTab === 'description' && (
                            <div className="prose max-w-none text-slate-600">
                                <p>{product.description}</p>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div>
                                {(product.reviews || []).length === 0 && <p>No reviews yet.</p>}
                                {(product.reviews || []).map((review) => (
                                    <div key={review._id} className="border-b border-slate-200 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold">{review.name.charAt(0)}</div>
                                            <div>
                                                <p className="font-bold">{review.name}</p>
                                                <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pl-16">
                                            <StarRating rating={review.rating} />
                                            <p className="text-slate-600 mt-2">{review.comment}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                                    <h3 className="font-marcellus text-2xl mb-4">Write a Review</h3>
                                    {userInfo ? (
                                        hasUserReviewed ? (
                                            <p className="text-blue-600">You have already reviewed this product.</p>
                                        ) : (
                                            <form onSubmit={handleReviewSubmit}>
                                                {errorReview && <p className="text-red-500 mb-4">{errorReview}</p>}
                                                <div className="mb-4">
                                                    <label className="block text-sm font-bold mb-2">Your Rating</label>
                                                    <StarRating rating={rating} setRating={setRating} />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="comment" className="block text-sm font-bold mb-2">Your Review</label>
                                                    <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows="4" className="w-full p-3 border border-slate-300 rounded-md" placeholder="Share your experience..."></textarea>
                                                </div>
                                                <button type="submit" disabled={loadingReview} className="bg-slate-900 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50">
                                                    {loadingReview ? 'Submitting...' : 'Submit Review'}
                                                </button>
                                            </form>
                                        )
                                    ) : (
                                        <p>Please <Link to="/login" className="font-bold underline hover:text-slate-600">sign in</Link> to write a review.</p>
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === 'sizing' && (
                            <div className="prose max-w-none text-slate-600">
                                <p>For a truly bespoke fit, we tailor each garment to your unique profile. Please add or update your measurements in your dashboard.</p>
                                <h4 className="font-bold mt-4">Key Measurements We Use:</h4>
                                <ul className="grid grid-cols-2 gap-x-8">
                                    <li>Neck</li><li>Chest</li><li>Waist</li><li>Hips</li><li>Sleeve Length</li><li>Shoulder Width</li><li>Shirt Length</li><li>Trouser Length</li><li>Inseam</li>
                                </ul>
                                <Link to="/profile/measurements" className="inline-block mt-6 bg-slate-900 text-white font-bold py-3 px-8 rounded-md hover:bg-slate-800 transition-colors duration-300 text-sm uppercase tracking-widest">
                                    Manage My Measurements
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* --- About Us Section --- */}
            <div className="relative mt-16 bg-white rounded-lg shadow-lg overflow-hidden" data-aos="fade-up">
                <BackgroundCubes />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center">
                    <div className="p-12 text-slate-800">
                        <h2 className="font-marcellus text-4xl">The Rely Tailors Difference</h2>
                        <p className="text-slate-600 mt-4 mb-6">
                            For over 35 years, we have been the architects of confidence. Our philosophy is simple: a perfect suit is a blend of art, precision, and personal expression. We source only the world's finest fabrics and employ master tailors who dedicate their craft to achieving an impeccable fit, just for you.
                        </p>
                        <Link to="/about" className="inline-block bg-slate-900 text-white font-bold py-3 px-8 rounded-md hover:bg-slate-800 transition-colors duration-300 text-sm uppercase tracking-widest">
                            Our Story
                        </Link>
                    </div>
                    <div>
                        <img 
                            src={insta2}
                            alt="Master tailor at work"
                            className="w-full h-96 object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
