import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart } from '../features/cart/cartSlice';
import { insta2 } from '../assets';
import api from '../api/AxiosAPI';   // ✅ use your AxiosAPI wrapper

// --- Helper Components ---
const BackgroundCubes = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
        <ul className="circles">
            <li></li><li></li><li></li><li></li><li></li>
            <li></li><li></li><li></li><li></li><li></li>
        </ul>
    </div>
);

const AccordionItem = ({ title, options, selectedOption, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200">
            <button className="w-full flex justify-between items-center py-4 text-left"
                onClick={() => setIsOpen(!isOpen)}>
                <span className="font-bold uppercase tracking-wider text-sm">{title}</span>
                <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="pb-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {options.map(option => (
                        <div key={option.optionName}
                            className={`p-3 border rounded-md cursor-pointer text-center transition-colors 
                ${selectedOption === option.optionName ? 'border-slate-900 bg-slate-900 text-white'
                                    : 'border-slate-200 hover:border-slate-400'}`}
                            onClick={() => onSelect(title, option)}>
                            <p className="font-semibold text-sm">{option.optionName}</p>
                            {option.additionalPrice > 0 && (
                                <p className="text-xs opacity-70">+${option.additionalPrice.toFixed(2)}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StarRating = ({ rating, setRating }) => (
    <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => {
            const ratingValue = i + 1;
            return (
                <button key={ratingValue} type="button"
                    onClick={() => setRating ? setRating(ratingValue) : null}
                    className={setRating ? 'cursor-pointer' : ''}>
                    <svg className={`w-5 h-5 ${ratingValue <= rating ? 'text-amber-500' : 'text-slate-300'}`}
                        fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 
              1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 
              1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 
              2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 
              1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 
              1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
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

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCustomizations, setSelectedCustomizations] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [isFavorited, setIsFavorited] = useState(false);

    const { userInfo } = useSelector((state) => state.auth);

    // ✅ Always fetch from our AxiosAPI
    const fetchProduct = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/products/${productId}`);
            setProduct(data);
            setTotalPrice(data.basePrice || 0);
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
        let newTotal = product.basePrice || 0;
        Object.values(newSelections).forEach(opt => {
            newTotal += opt.additionalPrice || 0;
        });
        setTotalPrice(newTotal);
    };

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
        await dispatch(addItemToCart(newItem));
        navigate('/checkout');
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!product) return null;

    return (
        <div className="bg-[#f2f2f2] font-montserrat">
            <div className="container mx-auto px-4 py-12">
                {/* Image + Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="lg:sticky top-24 h-screen max-h-[80vh]">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="lg:pt-8">
                        <h1 className="font-marcellus text-4xl md:text-5xl text-slate-900 mt-2">{product.name}</h1>
                        <p className="text-2xl text-slate-700 my-4">
                            ${Number(totalPrice).toFixed(2)}
                        </p>
                        {/* Customizations */}
                        {(product.customizations || []).map(c => (
                            <AccordionItem key={c.name}
                                title={c.name}
                                options={c.options}
                                selectedOption={selectedCustomizations[c.name]?.optionName}
                                onSelect={handleCustomizationSelect} />
                        ))}
                        {/* Buttons */}
                        <div className="mt-10 flex items-center gap-4">
                            <button onClick={() => setIsFavorited(!isFavorited)}
                                className={`p-4 border rounded-md ${isFavorited ? 'bg-red-500 text-white' : ''}`}>
                                ❤️
                            </button>
                            <button onClick={addToCartHandler}
                                className="flex-1 bg-slate-900 text-white font-bold py-4 px-8 rounded-md">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
