import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2,
    AlertTriangle,
    MapPin,
    CreditCard,
    ShoppingBag,
    ArrowLeft,
    Hash,
    Calendar,
    Check,
    MessageSquare,
    Truck,
    Package
} from 'lucide-react';

import api from '../api/AxiosAPI';

// --- Utility Functions ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const ORDER_STATUSES = [
    'Pending Confirmation',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
];

// --- UI Sub-components ---

const LoadingSkeleton = () => (
    <div className="container mx-auto p-6 animate-pulse">
        <div className="h-8 bg-stone-200 w-1/4 mb-4 rounded-sm"></div>
        <div className="h-4 bg-stone-200 w-1/3 mb-12 rounded-sm"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="h-32 bg-stone-200 rounded-sm"></div>
                <div className="h-64 bg-stone-200 rounded-sm"></div>
            </div>
            <div className="space-y-6">
                <div className="h-40 bg-stone-200 rounded-sm"></div>
                <div className="h-40 bg-stone-200 rounded-sm"></div>
            </div>
        </div>
    </div>
);

const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
            <AlertTriangle size={32} />
        </div>
        <h3 className="font-marcellus text-2xl text-stone-900 mb-2">Order Not Found</h3>
        <p className="text-stone-500 mb-8">{message}</p>
        <Link to="/my-orders" className="bg-stone-900 text-white px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-amber-700 transition-colors">
            Back to Orders
        </Link>
    </div>
);

const InfoCard = ({ icon: Icon, title, children }) => (
    <div className="bg-white p-6 md:p-8 rounded-sm border border-stone-100 shadow-sm h-full">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-50">
            <Icon className="h-5 w-5 text-amber-700" />
            <h3 className="font-marcellus text-lg text-stone-900">{title}</h3>
        </div>
        <div className="text-stone-600 space-y-2 text-sm font-light leading-relaxed">{children}</div>
    </div>
);

const OrderStatusTracker = ({ currentStatus }) => {
    const currentIndex = ORDER_STATUSES.indexOf(currentStatus);
    const isCancelled = currentStatus === 'Cancelled';

    if (isCancelled) {
        return (
            <div className="bg-red-50 border border-red-100 p-6 rounded-sm text-center">
                <h3 className="font-marcellus text-xl text-red-800 mb-2">Order Cancelled</h3>
                <p className="text-red-600 text-sm">This order has been cancelled. Please contact support if this is a mistake.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 border border-stone-100 rounded-sm shadow-sm">
            <h3 className="font-marcellus text-lg text-stone-900 mb-8">Order Status</h3>
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-4 left-0 w-full h-[2px] bg-stone-100 -z-10"></div>
                <div 
                    className="hidden md:block absolute top-4 left-0 h-[2px] bg-stone-900 -z-10 transition-all duration-700 ease-out" 
                    style={{ width: `${(currentIndex / (ORDER_STATUSES.length - 1)) * 100}%` }}
                ></div>

                {ORDER_STATUSES.map((status, index) => {
                    const isActive = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    
                    return (
                        <div key={status} className="flex md:flex-col items-center gap-4 md:gap-4 relative group w-full md:w-auto">
                            {/* Connecting Line (Mobile) */}
                            {index < ORDER_STATUSES.length - 1 && (
                                <div className={`md:hidden absolute left-4 top-8 w-[2px] h-full ${isActive && index < currentIndex ? 'bg-stone-900' : 'bg-stone-100'} -z-10 ml-[-1px]`}></div>
                            )}

                            <div 
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 
                                ${isActive ? 'bg-stone-900 border-stone-900 text-white' : 'bg-white border-stone-200 text-stone-300'}`}
                            >
                                {isActive ? <Check size={14} /> : <div className="w-2 h-2 rounded-full bg-stone-200" />}
                            </div>
                            
                            <div className={`text-left md:text-center transition-colors duration-300 ${isCurrent ? 'opacity-100' : isActive ? 'opacity-70' : 'opacity-40'}`}>
                                <p className="text-xs font-bold uppercase tracking-widest text-stone-900">
                                    {status.replace(' Confirmation', '')}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Main Page Component ---

const OrderDetailPage = () => {
    const { id: orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError('');
                const { data } = await api.get(`/orders/${orderId}`);
                setOrder(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Could not fetch order details.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const handleWhatsAppConfirm = () => {
        if (!order) return;
        const ownerPhoneNumber = '917463997367';
        const message = `Hi, I've just placed Order #${order._id}. I'd like to confirm the details and payment.`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${ownerPhoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorDisplay message={error} />;
    if (!order) return null;

    const { shippingAddress = {} } = order;

    return (
        <div className="bg-[#FDFBF7] min-h-screen font-montserrat text-stone-800">
            <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20">
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Header */}
                        <header className="mb-10">
                            <Link 
                                to="/my-orders" 
                                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-amber-700 mb-6 transition-colors"
                            >
                                <ArrowLeft size={14} /> Back to History
                            </Link>
                            
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    <h1 className="font-marcellus text-3xl md:text-4xl text-stone-900 mb-2">
                                        Order <span className="font-mono text-stone-400">#</span>{order._id}
                                    </h1>
                                    <p className="text-stone-500 text-sm font-light flex items-center gap-2">
                                        <Calendar size={14} /> Placed on {formatDate(order.createdAt)}
                                    </p>
                                </div>
                                
                                {order.orderStatus === 'Pending Confirmation' && (
                                    <button
                                        onClick={handleWhatsAppConfirm}
                                        className="bg-[#25D366] text-white px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-[#128C7E] transition-colors flex items-center gap-2 shadow-lg shadow-green-900/10"
                                    >
                                        <MessageSquare size={16} /> Confirm via WhatsApp
                                    </button>
                                )}
                            </div>
                        </header>

                        {/* Status Tracker */}
                        <div className="mb-10">
                            <OrderStatusTracker currentStatus={order.orderStatus} />
                        </div>

                        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Left Column: Items */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white p-6 md:p-8 rounded-sm border border-stone-100 shadow-sm">
                                    <h2 className="font-marcellus text-xl text-stone-900 mb-6 flex items-center gap-3">
                                        <ShoppingBag size={20} className="text-amber-700" /> Collection
                                    </h2>
                                    
                                    <div className="space-y-6">
                                        {order.orderItems.map(item => (
                                            <div key={item._id || item.product} className="flex gap-6 pb-6 border-b border-stone-100 last:border-0 last:pb-0">
                                                <div className="w-20 h-28 bg-stone-100 rounded-sm overflow-hidden border border-stone-200 flex-shrink-0">
                                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-marcellus text-lg text-stone-900">{item.name}</h3>
                                                        <p className="font-bold text-stone-900">₹{Number(item.price || 0).toFixed(2)}</p>
                                                    </div>
                                                    
                                                    {item.selectedCustomizations && Object.keys(item.selectedCustomizations).length > 0 && (
                                                        <div className="mt-2 text-xs text-stone-500 bg-stone-50 p-3 rounded-sm">
                                                            {Object.entries(item.selectedCustomizations).map(([key, value]) => (
                                                                <div key={key} className="flex justify-between py-0.5">
                                                                    <span className="font-bold uppercase tracking-wide text-stone-400">{key}:</span>
                                                                    <span>{value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Totals */}
                                    <div className="mt-8 pt-6 border-t border-stone-100 bg-stone-50/50 -mx-6 -mb-6 p-6 rounded-b-sm">
                                        <div className="space-y-2 text-sm text-stone-600 max-w-xs ml-auto">
                                            <div className="flex justify-between">
                                                <span>Subtotal</span>
                                                <span className="font-medium text-stone-900">₹{Number(order.totalPrice || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Shipping</span>
                                                <span className="text-amber-700 font-bold text-xs uppercase tracking-widest">Free</span>
                                            </div>
                                            <div className="flex justify-between border-t border-stone-200 pt-3 mt-3">
                                                <span className="font-marcellus text-lg text-stone-900">Total</span>
                                                <span className="font-bold text-xl text-stone-900">₹{Number(order.totalPrice || 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Info Cards */}
                            <aside className="space-y-6">
                                <InfoCard icon={MapPin} title="Shipping To">
                                    <p className="font-bold text-stone-900 mb-1">{shippingAddress.fullName || 'N/A'}</p>
                                    <p className="leading-relaxed">
                                        {shippingAddress.addressLine1}<br />
                                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                                    </p>
                                    <p className="mt-4 pt-4 border-t border-stone-100 text-stone-500 font-mono text-xs">
                                        {shippingAddress.phoneNumber}
                                    </p>
                                </InfoCard>

                                <InfoCard icon={CreditCard} title="Payment Details">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-stone-500">Method</span>
                                        <span className="font-bold text-stone-900">{order.paymentMethod || 'Manual'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-stone-500">Status</span>
                                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                            {order.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-stone-400 mt-4 italic">
                                        * Payment is verified manually after WhatsApp confirmation.
                                    </p>
                                </InfoCard>
                            </aside>

                        </main>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default OrderDetailPage;