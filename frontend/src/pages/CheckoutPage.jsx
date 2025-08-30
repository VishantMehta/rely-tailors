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
} from 'lucide-react';

import {
    fetchUserCart,
    removeItemFromCart,
    clearCart,
    fetchUserAddress,
} from '../features/cart/cartSlice';
import api from '../api/AxiosAPI';

// --- Reusable UI Components ---

const BackgroundCubes = () => (
    <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-50">
        <ul className="circles">
            {[...Array(10)].map((_, i) => <li key={i}></li>)}
        </ul>
    </div>
);

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 bg-white/50 p-8 rounded-lg shadow-sm animate-pulse">
            <div className="h-8 w-1/3 bg-zinc-200 rounded mb-6"></div>
            <div className="h-28 bg-zinc-200 rounded mb-4"></div>
            <div className="h-28 bg-zinc-200 rounded"></div>
        </div>
        <div className="lg:col-span-1 bg-white/50 p-8 rounded-lg shadow-sm animate-pulse">
            <div className="h-8 w-1/2 bg-zinc-200 rounded mb-6"></div>
            <div className="h-6 bg-zinc-200 rounded mb-3"></div>
            <div className="h-6 bg-zinc-200 rounded mb-4"></div>
            <div className="h-10 bg-zinc-200 rounded"></div>
        </div>
    </div>
);

const EmptyCart = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center bg-white p-12 rounded-lg shadow-md border"
    >
        <ShoppingBag className="mx-auto h-16 w-16 text-zinc-400" strokeWidth={1.5} />
        <h2 className="mt-6 text-2xl font-semibold text-zinc-800">Your Cart is Empty</h2>
        <p className="mt-2 text-zinc-500">Looks like you haven't added anything to your cart yet.</p>
        <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-8 bg-zinc-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-zinc-700 transition-colors duration-300"
        >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
        </Link>
    </motion.div>
);

const ErrorNotification = ({ message, onClear }) => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center justify-between gap-4 mb-8"
    >
        <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{message}</span>
        </div>
        <button onClick={onClear} className="text-red-500 hover:text-red-700">&times;</button>
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
            setSelectedAddress(address[0]); // default first address
        }
    }, [address]);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
    const total = subtotal; // Assuming free shipping

    const placeOrderHandler = async () => {
        setOrderError('');
        if (!selectedAddress) {
            setOrderError('Please provide a shipping address before placing an order.');
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
            const message = error.response?.data?.message || 'A network error occurred. Please try again.';
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                {/* Left Side: Order Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping Info */}
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white/20" data-aos="fade-right">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-marcellus text-2xl text-zinc-900 flex items-center gap-3"><MapPin className="h-6 w-6 text-zinc-500" /> Shipping Details</h2>
                            <Link to="/my-addresses" className="text-sm font-semibold text-zinc-700 hover:underline">
                                {selectedAddress ? 'Change' : 'Add Address'}
                            </Link>
                        </div>
                        {address && address.length > 0 ? (
                            <div className="space-y-4 pl-9">
                                {address.map((addr) => (
                                    <label
                                        key={addr._id}
                                        className={`block p-4 border rounded-lg cursor-pointer transition 
          ${selectedAddress?._id === addr._id ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-300 hover:border-zinc-500'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="shippingAddress"
                                            value={addr._id}
                                            checked={selectedAddress?._id === addr._id}
                                            onChange={() => setSelectedAddress(addr)}
                                            className="mr-3"
                                        />
                                        <div className="inline-block align-middle text-sm text-zinc-700">
                                            <p className="font-bold text-zinc-900">{addr.fullName}</p>
                                            <p>{addr.addressLine1}</p>
                                            <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                                            <p className="text-xs text-zinc-500">Phone: {addr.phoneNumber}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-500 text-sm pl-9">No shipping address provided.</p>
                        )}

                    </div>

                    {/* Order Summary */}
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white/20" data-aos="fade-right" data-aos-delay="100">
                        <h2 className="font-marcellus text-2xl text-zinc-900 mb-6 flex items-center gap-3"><ShoppingBag className="h-6 w-6 text-zinc-500" /> Order Summary</h2>
                        <div className="space-y-6">
                            <AnimatePresence>
                                {cartItems.map(item => (
                                    <motion.div
                                        key={item._id || item.product}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex items-start gap-4 border-b border-zinc-200/50 pb-6 last:border-b-0 last:pb-0"
                                    >
                                        <img src={item.imageUrl} alt={item.name} className="w-24 h-32 object-cover rounded-md border" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-zinc-800">{item.name}</h3>
                                            <div className="text-xs text-zinc-500 mt-1 space-y-0.5">
                                                {item.selectedCustomizations && Object.entries(item.selectedCustomizations).map(([key, value]) => (
                                                    <p key={key}><span className="font-semibold capitalize">{key}:</span> {value}</p>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-lg text-zinc-900">${item.price.toFixed(2)}</p>
                                            <button onClick={() => removeFromCartHandler(item._id)} className="text-red-500 hover:text-red-700 transition-colors mt-2 p-1">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Right Side: Price & Checkout */}
                <div className="lg:col-span-1" data-aos="fade-left">
                    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-lg shadow-xl border border-white/30 sticky top-28">
                        <h2 className="font-marcellus text-3xl text-zinc-900 mb-6 flex items-center gap-3"><CreditCard className="h-6 w-6 text-zinc-500" /> Price Details</h2>
                        <div className="space-y-4 text-zinc-600">
                            <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span className="font-semibold text-green-600">Free</span></div>
                            <div className="flex justify-between text-zinc-900 font-bold text-xl border-t border-zinc-200 pt-4 mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
                        </div>
                        <button
                            onClick={placeOrderHandler}
                            disabled={isPlacingOrder || !selectedAddress}
                            className="w-full mt-8 bg-zinc-900 text-white font-bold py-3.5 px-8 rounded-lg hover:bg-zinc-700 transition-all duration-300 text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:bg-zinc-400 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            {isPlacingOrder ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Placing Order...</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="h-5 w-5" />
                                    <span>Confirm & Place Order</span>
                                </>
                            )}
                        </button>
                        {!selectedAddress && <p className="text-xs text-center text-amber-700 mt-3">Please add a shipping address to proceed.</p>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative min-h-screen w-full font-sans text-zinc-800">
            <BackgroundCubes />
            <div className="relative z-10 container mx-auto px-4 py-12 md:py-16">
                <div data-aos="fade-down" className="text-center mb-12">
                    <h1 className="font-marcellus text-4xl md:text-5xl text-zinc-900">Secure Checkout</h1>
                    <p className="text-zinc-500 mt-2 text-lg">Complete your purchase in just a few clicks.</p>
                </div>
                <AnimatePresence>
                    {orderError && <ErrorNotification message={orderError} onClear={() => setOrderError('')} />}
                </AnimatePresence>
                {renderContent()}
            </div>
        </div>
    );
};

export default CheckoutPage;
