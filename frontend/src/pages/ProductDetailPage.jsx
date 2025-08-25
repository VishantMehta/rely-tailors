import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

// Mock Product Data - Replace with API call
const mockProduct = {
    _id: '1',
    name: 'The Signature Bespoke Suit',
    description: 'A masterpiece of tailoring, our Signature Bespoke Suit is crafted from the finest Italian wool. Each suit is fully canvassed and meticulously shaped to your body for a flawless silhouette and unparalleled comfort. Perfect for making a lasting impression at any formal event.',
    basePrice: 850.00,
    category: 'Suits',
    imageUrl: 'https://images.unsplash.com/photo-1523282366825-6c71b1f35234?q=80&w=1887&auto=format&fit=crop',
    customizations: [
        {
            name: 'Fabric',
            options: [
                { optionName: 'Italian Wool', additionalPrice: 0, imageUrl: 'https://images.unsplash.com/photo-1594938384914-26278a2e2604' },
                { optionName: 'Cashmere Blend', additionalPrice: 150, imageUrl: 'https://images.unsplash.com/photo-1542033912-68575a7c2692' },
                { optionName: 'Summer Linen', additionalPrice: 50, imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7' },
            ]
        },
        {
            name: 'Lapel Style',
            options: [
                { optionName: 'Notch Lapel', additionalPrice: 0 },
                { optionName: 'Peak Lapel', additionalPrice: 25 },
                { optionName: 'Shawl Lapel', additionalPrice: 40 },
            ]
        },
        {
            name: 'Button Stance',
            options: [
                { optionName: 'Single Button', additionalPrice: 0 },
                { optionName: 'Two Buttons', additionalPrice: 0 },
                { optionName: 'Double Breasted', additionalPrice: 75 },
            ]
        }
    ]
};

// Accordion Item Component
const AccordionItem = ({ title, options, selectedOption, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-200">
            <button
                className="w-full flex justify-between items-center py-4 text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-bold uppercase tracking-wider text-sm">{title}</span>
                <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="pb-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {options.map(option => (
                        <div
                            key={option.optionName}
                            className={`p-3 border rounded-md cursor-pointer text-center transition-colors ${selectedOption === option.optionName ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 hover:border-slate-400'}`}
                            onClick={() => onSelect(title, option)}
                        >
                            <p className="font-semibold text-sm">{option.optionName}</p>
                            {option.additionalPrice > 0 && <p className="text-xs opacity-70">+${option.additionalPrice.toFixed(2)}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCustomizations, setSelectedCustomizations] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // In a real app, you would fetch the product data
        // For now, we use the mock data
        setProduct(mockProduct);
        setTotalPrice(mockProduct.basePrice);
        setLoading(false);

        // --- REAL API CALL ---
        // const fetchProduct = async () => {
        //     try {
        //         setLoading(true);
        //         const { data } = await axios.get(`/api/products/${id}`);
        //         setProduct(data);
        //         setTotalPrice(data.basePrice);
        //         setLoading(false);
        //     } catch (err) {
        //         setError('Product not found.');
        //         setLoading(false);
        //     }
        // };
        // fetchProduct();
    }, [id]);

    const handleCustomizationSelect = (customizationName, option) => {
        const newSelections = {
            ...selectedCustomizations,
            [customizationName]: option
        };
        setSelectedCustomizations(newSelections);

        // Recalculate total price
        let newTotal = product.basePrice;
        Object.values(newSelections).forEach(selectedOption => {
            newTotal += selectedOption.additionalPrice;
        });
        setTotalPrice(newTotal);
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!product) return null;

    return (
        <div className="bg-[#f2f2f2] font-montserrat">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Sticky Image */}
                    <div className="lg:sticky top-24 h-screen max-h-[80vh]">
                        <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            data-aos="zoom-in"
                        />
                    </div>

                    {/* Right Column: Details & Customizations */}
                    <div className="lg:pt-8">
                        <div data-aos="fade-left">
                            <h1 className="font-marcellus text-4xl md:text-5xl text-slate-900">{product.name}</h1>
                            <p className="text-2xl text-slate-700 my-4">${totalPrice.toFixed(2)}</p>
                            <p className="text-slate-600 leading-relaxed">{product.description}</p>
                        </div>
                        
                        <div className="mt-10" data-aos="fade-left" data-aos-delay="200">
                            <h2 className="font-marcellus text-2xl mb-4">Customize Your Garment</h2>
                            {product.customizations.map(customization => (
                                <AccordionItem 
                                    key={customization.name}
                                    title={customization.name}
                                    options={customization.options}
                                    selectedOption={selectedCustomizations[customization.name]?.optionName}
                                    onSelect={handleCustomizationSelect}
                                />
                            ))}
                        </div>

                        <div className="mt-10" data-aos="fade-up" data-aos-delay="400">
                            <button className="w-full bg-slate-900 text-white font-bold py-4 px-8 rounded-md hover:bg-slate-800 transition-colors duration-300 text-sm uppercase tracking-widest">
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
