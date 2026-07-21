import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingBag, 
    Trash2, 
    Loader2, 
    AlertCircle, 
    ArrowRight, 
    MapPin, 
    CreditCard, 
    ShieldCheck,
    Truck,
    Package
} from 'lucide-react';

import {
    fetchUserCart,
    removeItemFromCart,
    clearCart,
    fetchUserAddress,
} from '../features/cart/cartSlice';
import api from '../api/AxiosAPI';

// --- Reusable UI Components ---

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
        <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-stone-200 rounded-sm"></div>
            <div className="h-64 bg-stone-200 rounded-sm"></div>
        </div>
        <div className="lg:col-span-1">
            <div className="h-80 bg-stone-200 rounded-sm"></div>
        </div>
    </div>
);

const EmptyCart = () => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
    >
        <div className="bg-stone-100 p-6 rounded-full mb-6 text-stone-400">
            <ShoppingBag size={48} strokeWidth={1} />
        </div>
        <h2 className="font-marcellus text-3xl text-stone-900 mb-2">Your Bag is Empty</h2>
        <p className="text-stone-500 mb-8 max-w-md font-light">
            Looks like you haven't added any pieces to your collection yet.
        </p>
        <Link 
            to="/products" 
            className="bg-stone-900 text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
            Start Shopping <ArrowRight size={14} />
        </Link>
    </motion.div>
);

const ErrorNotification = ({ message, onClear }) => (
    <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-sm flex items-center justify-between gap-4 mb-8 text-sm"
    >
        <div className="flex items-center gap-3">
            <AlertCircle size={18} />
            <span>{message}</span>
        </div>
        <button onClick={onClear} className="text-red-400 hover:text-red-700">&times;</button>
    </motion.div>
);

// --- Main Checkout Page Component ---

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux selectors
    const { cartItems, loading, address } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderError, setOrderError] = useState('');
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        dispatch(fetchUserCart());
        dispatch(fetchUserAddress());
    }, [dispatch]);

    useEffect(() => {
        if (address && address.length > 0) {
            // Default to first address if not selected
            if (!selectedAddress) setSelectedAddress(address[0]);
        }
    }, [address, selectedAddress]);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
    const total = subtotal; // Free shipping logic can be added here

    const placeOrderHandler = async () => {
        setOrderError('');
        if (!selectedAddress) {
            setOrderError('Please select a shipping address to proceed.');
            return;
        }
        
        setIsPlacingOrder(true);
        try {
            const orderItems = cartItems.map(item => ({
                name: item.name,
                imageUrl: item.imageUrl,
                price: item.price,
                product: item.product._id || item.product,
                measurements: userInfo.measurements || {},
                selectedCustomizations: item.selectedCustomizations || {},
            }));

            const orderPayload = {
                orderItems,
                shippingAddress: {
                    fullName: selectedAddress.fullName,
                    addressLine1: selectedAddress.addressLine1,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    postalCode: selectedAddress.postalCode,
                    phoneNumber: selectedAddress.phoneNumber,
                    _id: selectedAddress._id,
                },
                totalPrice: total,
                paymentMethod: 'Manual Confirmation', 
            };

            const { data } = await api.post('/orders', orderPayload);
            dispatch(clearCart());
            navigate(`/orders/${data._id}`);
        } catch (error) {
            const message = error.response?.data?.message || 'Unable to place order. Please try again.';
            setOrderError(message);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeItemFromCart(id));
    };

    const renderContent = () => {
        if (loading) return <LoadingSkeleton />;
        if (!cartItems || cartItems.length === 0) return <EmptyCart />;

        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                
                {/* --- Left Column: Address & Items --- */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Shipping Address Section */}
                    <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-stone-100">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                            <h2 className="font-marcellus text-xl text-stone-900 flex items-center gap-2">
                                <MapPin size={20} className="text-amber-700" /> Shipping Address
                            </h2>
                            <Link to="/my-addresses" className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-amber-700 transition-colors">
                                {address?.length > 0 ? 'Manage Addresses' : 'Add New'}
                            </Link>
                        </div>

                        {address && address.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {address.map((addr) => (
                                    <div 
                                        key={addr._id}
                                        onClick={() => setSelectedAddress(addr)}
                                        className={`relative p-4 border rounded-sm cursor-pointer transition-all duration-300 ${selectedAddress?._id === addr._id ? 'border-amber-700 bg-amber-50/20' : 'border-stone-200 hover:border-stone-400'}`}
                                    >
                                        {selectedAddress?._id === addr._id && (
                                            <div className="absolute top-2 right-2 text-amber-700">
                                                <ShieldCheck size={16} />
                                            </div>
                                        )}
                                        <p className="font-bold text-stone-900 text-sm mb-1">{addr.fullName}</p>
                                        <p className="text-stone-600 text-xs leading-relaxed">{addr.addressLine1}</p>
                                        <p className="text-stone-600 text-xs leading-relaxed">{addr.city}, {addr.state} {addr.postalCode}</p>
                                        <p className="text-stone-500 text-xs mt-2 font-mono">{addr.phoneNumber}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-stone-200 rounded-sm">
                                <p className="text-stone-500 mb-4 font-light text-sm">You haven't added any addresses yet.</p>
                                <Link to="/my-addresses" className="inline-block px-6 py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors">
                                    Add Address
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Cart Items Section */}
                    <section className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-stone-100">
                        <h2 className="font-marcellus text-xl text-stone-900 mb-6 flex items-center gap-2 pb-4 border-b border-stone-100">
                            <ShoppingBag size={20} className="text-amber-700" /> Order Items ({cartItems.length})
                        </h2>
                        
                        <div className="space-y-6">
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div 
                                        key={item._id || item.product}
                                        layout
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex gap-4 sm:gap-6"
                                    >
                                        <div className="w-20 h-28 sm:w-24 sm:h-32 bg-stone-100 rounded-sm overflow-hidden flex-shrink-0 border border-stone-200">
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <h3 className="font-marcellus text-lg text-stone-900 leading-tight">{item.name}</h3>
                                                {/* Customizations Display */}
                                                <div className="mt-2 space-y-1">
                                                    {item.selectedCustomizations && Object.entries(item.selectedCustomizations).map(([key, value]) => (
                                                        <p key={key} className="text-xs text-stone-500">
                                                            <span className="font-semibold uppercase tracking-wider text-stone-400 mr-1">{key}:</span> 
                                                            {value}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-4">
                                                <p className="font-bold text-stone-900">₹{item.price.toFixed(2)}</p>
                                                <button 
                                                    onClick={() => removeFromCartHandler(item._id)}
                                                    className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-600 transition-colors uppercase tracking-widest font-bold"
                                                >
                                                    <Trash2 size={14} /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>
                </div>

                {/* --- Right Column: Order Summary --- */}
                <div className="lg:col-span-1">
                    <div className="sticky top-28">
                        <div className="bg-white p-6 md:p-8 rounded-sm shadow-xl border border-stone-100 relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-50 rounded-full blur-3xl pointer-events-none"></div>

                            <h2 className="font-marcellus text-xl text-stone-900 mb-6 flex items-center gap-2 relative z-10">
                                <CreditCard size={20} className="text-amber-700" /> Payment Summary
                            </h2>

                            <div className="space-y-3 mb-6 text-sm text-stone-600 relative z-10">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-stone-900">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1"><Truck size={14} /> Shipping</span>
                                    <span className="text-amber-700 font-bold text-xs uppercase tracking-widest">Free</span>
                                </div>
                                <div className="pt-4 border-t border-stone-100 flex justify-between items-end">
                                    <span className="font-marcellus text-lg text-stone-900">Total</span>
                                    <span className="font-bold text-2xl text-stone-900">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="bg-stone-50 p-3 mb-6 rounded-sm text-xs text-stone-500 flex items-start gap-2">
                                <ShieldCheck size={14} className="mt-0.5 text-stone-400 flex-shrink-0" />
                                <p>Secure Checkout. Your payment information is encrypted and processed securely.</p>
                            </div>

                            <button
                                onClick={placeOrderHandler}
                                disabled={isPlacingOrder || !selectedAddress}
                                className="w-full bg-stone-900 text-white py-4 px-6 text-xs font-bold uppercase tracking-[0.15em] hover:bg-amber-700 transition-all duration-300 disabled:bg-stone-300 disabled:cursor-not-allowed shadow-lg shadow-stone-900/10 flex items-center justify-center gap-2 relative z-10"
                            >
                                {isPlacingOrder ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        Place Order <Package size={16} />
                                    </>
                                )}
                            </button>
                            
                            {!selectedAddress && (
                                <p className="text-center text-red-500 text-xs mt-3 font-medium animate-pulse">
                                    * Select a shipping address
                                </p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-montserrat text-stone-800">
            <div className="container mx-auto px-4 py-12 md:py-20">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="font-marcellus text-4xl md:text-5xl text-stone-900 mb-3">Checkout</h1>
                    <div className="h-[1px] w-20 bg-amber-700 mx-auto mb-4"></div>
                    <p className="text-stone-500 font-light text-sm tracking-wide">
                        Complete your purchase to receive your royal attire.
                    </p>
                </div>

                <AnimatePresence>
                    {orderError && (
                        <div className="max-w-4xl mx-auto">
                            <ErrorNotification message={orderError} onClear={() => setOrderError('')} />
                        </div>
                    )}
                </AnimatePresence>

                <div className="max-w-6xl mx-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;