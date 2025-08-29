import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2,
    AlertTriangle,
    MapPin,
    CreditCard,
    ShoppingCart,
    ArrowLeft,
    Hash,
    Calendar,
    Check,
    MessageSquare,
} from 'lucide-react';

import api from '../api/AxiosAPI';

// --- Configuration & Helpers ---

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
    <div className="container mx-auto p-4 md:p-8">
        <div className="h-8 bg-zinc-200 rounded w-1/4 mb-2 animate-pulse"></div>
        <div className="h-5 bg-zinc-200 rounded w-1/3 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="h-24 bg-zinc-200 rounded-lg animate-pulse"></div>
                <div className="bg-white p-6 rounded-lg border border-zinc-200 animate-pulse">
                    <div className="h-6 bg-zinc-200 rounded w-1/2 mb-6"></div>
                    <div className="h-20 bg-zinc-200 rounded mb-4"></div>
                    <div className="h-20 bg-zinc-200 rounded"></div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="h-32 bg-zinc-200 rounded-lg animate-pulse"></div>
                <div className="h-32 bg-zinc-200 rounded-lg animate-pulse"></div>
            </div>
        </div>
    </div>
);

const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-center bg-red-50 text-red-800 p-8 rounded-lg border border-red-200 my-8">
        <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
        <h3 className="text-xl font-semibold">Could Not Fetch Order</h3>
        <p className="mt-1 text-red-700">{message}</p>
        <Link to="/my-orders" className="mt-6 inline-flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-red-700 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to My Orders
        </Link>
    </div>
);

const InfoCard = ({ icon: Icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg border border-zinc-200 h-full">
        <div className="flex items-center gap-3 mb-4">
            <Icon className="h-6 w-6 text-zinc-500" />
            <h3 className="font-marcellus text-xl text-zinc-800">{title}</h3>
        </div>
        <div className="text-zinc-600 space-y-1 text-sm">{children}</div>
    </div>
);

const OrderStatusTracker = ({ currentStatus }) => {
    const currentIndex = ORDER_STATUSES.indexOf(currentStatus);
    const isCancelled = currentStatus === 'Cancelled';

    if (isCancelled) {
        return (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
                <h3 className="text-red-800 font-bold">Order Cancelled</h3>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-lg">
            {ORDER_STATUSES.map((status, index) => {
                const isActive = index <= currentIndex;
                return (
                    <React.Fragment key={status}>
                        <div className="flex flex-col items-center text-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'bg-zinc-800 border-zinc-800 text-white' : 'bg-white border-zinc-300 text-zinc-400'}`}>
                                {isActive && <Check className="h-5 w-5" />}
                            </div>
                            <p className={`mt-2 text-xs font-semibold transition-colors duration-300 ${isActive ? 'text-zinc-800' : 'text-zinc-400'}`}>{status.replace(' Confirmation', '')}</p>
                        </div>
                        {index < ORDER_STATUSES.length - 1 && (
                            <div className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-300 ${isActive ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
                        )}
                    </React.Fragment>
                );
            })}
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
        // IMPORTANT: Replace with the owner's actual phone number
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
        <div className="bg-zinc-50 min-h-screen font-sans">
            <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <header className="mb-8" data-aos="fade-down">
                            <Link to="/my-orders" className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 mb-4 transition-colors">
                                <ArrowLeft className="h-4 w-4" />
                                Back to All Orders
                            </Link>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div>
                                    <h1 className="font-marcellus text-3xl md:text-4xl text-zinc-900 flex items-center gap-3">
                                        <Hash className="h-7 w-7 text-zinc-400" />
                                        <span>Order</span>
                                        <span className="font-mono text-2xl md:text-3xl tracking-tight text-zinc-700">{order._id}</span>
                                    </h1>
                                    <p className="text-zinc-500 mt-1 flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4" /> Placed on {formatDate(order.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </header>

                        {order.orderStatus === 'Pending Confirmation' && (
                            <div className="mb-8 bg-green-50 border border-green-200 p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4" data-aos="fade-up">
                                <div>
                                    <h3 className="font-bold text-green-800 text-lg">Action Required: Confirm Your Order</h3>
                                    <p className="text-green-700 text-sm mt-1">Please confirm your order details and payment via WhatsApp to begin processing.</p>
                                </div>
                                <button
                                    onClick={handleWhatsAppConfirm}
                                    className="w-full md:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                                >
                                    <MessageSquare className="h-5 w-5" />
                                    Confirm on WhatsApp
                                </button>
                            </div>
                        )}

                        <div className="mb-8">
                            <OrderStatusTracker currentStatus={order.orderStatus} />
                        </div>

                        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8" data-aos="fade-right">
                                <div className="bg-white p-6 rounded-lg border border-zinc-200">
                                    <h2 className="font-marcellus text-2xl mb-6 flex items-center gap-3"><ShoppingCart className="h-6 w-6 text-zinc-500" /> Order Summary</h2>
                                    <div className="space-y-4">
                                        {order.orderItems.map(item => (
                                            <div key={item._id || item.product} className="flex items-start gap-4 border-b border-zinc-100 pb-4 last:border-b-0 last:pb-0">
                                                <img src={item.imageUrl} alt={item.name} className="w-24 h-32 object-cover rounded-md border" />
                                                <div className="flex-1">
                                                    <p className="font-bold text-lg text-zinc-800">{item.name}</p>
                                                    <div className="text-xs text-zinc-500 mt-1 space-y-0.5">
                                                        {Object.entries(item.selectedCustomizations || {}).map(([key, value]) => (
                                                            <p key={key}><span className="font-semibold capitalize">{key}:</span> {value}</p>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="font-semibold text-lg text-zinc-900 ml-auto">${Number(item.price || 0).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end mt-6 pt-6 border-t border-zinc-200">
                                        <div className="w-full max-w-sm space-y-2 text-zinc-600">
                                            <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold text-zinc-800">${Number(order.totalPrice || 0).toFixed(2)}</span></div>
                                            <div className="flex justify-between"><span>Shipping</span><span className="font-semibold text-zinc-800">Free</span></div>
                                            <div className="flex justify-between font-bold text-xl text-zinc-900 mt-2 pt-2 border-t border-zinc-200"><span>Total</span><span>${Number(order.totalPrice || 0).toFixed(2)}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <aside className="space-y-8" data-aos="fade-left">
                                <InfoCard icon={MapPin} title="Shipping Address">
                                    <p className="font-semibold text-zinc-800">{shippingAddress.fullName || 'N/A'}</p>
                                    <p>{shippingAddress.addressLine1 || ''}</p>
                                    <p>{shippingAddress.city || ''}, {shippingAddress.state || ''} {shippingAddress.postalCode || ''}</p>
                                    <p>{shippingAddress.phoneNumber || ''}</p>
                                </InfoCard>
                                <InfoCard icon={CreditCard} title="Payment Information">
                                    <p className="font-semibold text-zinc-800">{order.paymentMethod || 'N/A'}</p>
                                    <p>Payment to be confirmed manually.</p>
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