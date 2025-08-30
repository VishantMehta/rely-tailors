import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2,
    AlertTriangle,
    ShoppingBag,
    Calendar,
    Hash,
    CircleDollarSign,
    ChevronRight,
    Package,
    Truck,
    CheckCircle2,
    XCircle,
    Hourglass,
    Archive,
} from 'lucide-react';

import { orderListRequest, orderListSuccess, orderListFail } from '../features/orders/orderSlice';
import api from '../api/AxiosAPI';

// --- Configuration & Helpers ---

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const STATUS_CONFIG = {
    'Pending Confirmation': {
        icon: Hourglass,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    'Confirmed': {
        icon: Archive,
        color: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    },
    'Processing': {
        icon: Loader2, // Using Loader2 which can be animated
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        animate: true,
    },
    'Shipped': {
        icon: Truck,
        color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
    'Delivered': {
        icon: CheckCircle2,
        color: 'bg-green-100 text-green-800 border-green-300',
    },
    'Cancelled': {
        icon: XCircle,
        color: 'bg-red-100 text-red-800 border-red-300',
    },
    'Default': {
        icon: Package,
        color: 'bg-zinc-100 text-zinc-800 border-zinc-300',
    }
};


// --- UI Sub-components ---

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Default;
    const Icon = config.icon;

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold leading-none rounded-full border ${config.color}`}>
            <Icon className={`h-4 w-4 ${config.animate ? 'animate-spin' : ''}`} />
            <span>{status}</span>
        </div>
    );
};

const LoadingSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border border-zinc-200 animate-pulse">
                <div className="flex justify-between items-center">
                    <div className="h-4 bg-zinc-200 rounded w-1/4"></div>
                    <div className="h-8 bg-zinc-200 rounded-full w-1/3 md:w-1/5"></div>
                </div>
                <div className="mt-4 h-4 bg-zinc-200 rounded w-1/2"></div>
            </div>
        ))}
    </div>
);

const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-center bg-red-50 text-red-800 p-8 rounded-lg border border-red-200">
        <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
        <h3 className="text-xl font-semibold">Could Not Load Orders</h3>
        <p className="mt-1 text-red-700">{message}</p>
    </div>
);

const EmptyState = () => (
    <div className="text-center bg-white p-12 rounded-lg border border-zinc-200 shadow-sm">
        <ShoppingBag className="mx-auto h-16 w-16 text-zinc-400" strokeWidth={1.5} />
        <h2 className="mt-6 text-2xl font-semibold text-zinc-800">No Order History</h2>
        <p className="mt-2 text-zinc-500 max-w-sm mx-auto">When you place an order, it will appear here. Let's get you started!</p>
        <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 bg-zinc-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-zinc-700 transition-colors duration-300"
        >
            Explore Products
        </Link>
    </div>
);

const OrderRow = ({ order, index }) => {
    const mobileInfo = [
        { icon: Hash, label: 'Order ID', value: `#${order._id}` },
        { icon: Calendar, label: 'Date', value: formatDate(order.createdAt) },
        { icon: CircleDollarSign, label: 'Total', value: `₹${Number(order.totalPrice || 0).toFixed(2)}`, valueClass: 'font-bold text-zinc-800' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="bg-white rounded-lg border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-300"
        >
            <Link to={`/orders/${order._id}`} className="block">
                {/* --- Mobile & Tablet Layout --- */}
                <div className="p-4 md:hidden">
                    <div className="flex justify-between items-start mb-4">
                        <p className="font-mono text-sm text-zinc-700 font-semibold break-all">#{order._id}</p>
                        <div className="flex-shrink-0 ml-4">
                            <StatusBadge status={order.orderStatus} />
                        </div>
                    </div>
                    <div className="space-y-2 text-sm text-zinc-500 border-t border-zinc-100 pt-4">
                        <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-zinc-400" />
                            <span>{formatDate(order.createdAt)}</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <CircleDollarSign className="h-4 w-4 text-zinc-400" />
                            <span className="font-semibold text-zinc-800">₹{Number(order.totalPrice || 0).toFixed(2)}</span>
                        </p>
                    </div>
                </div>

                {/* --- Desktop Layout --- */}
                <div className="hidden md:grid grid-cols-[2fr,1fr,1fr,1.5fr,auto] gap-6 items-center px-6 py-5">
                    <p className="font-mono text-sm text-zinc-700 font-semibold truncate" title={order._id}>#{order._id}</p>
                    <p className="text-zinc-600 text-sm">{formatDate(order.createdAt)}</p>
                    <p className="font-semibold text-zinc-800 text-sm">₹{Number(order.totalPrice || 0).toFixed(2)}</p>
                    <div><StatusBadge status={order.orderStatus} /></div>
                    <div className="text-right">
                        <ChevronRight className="h-5 w-5 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};


// --- Main Page Component ---

const MyOrdersPage = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                dispatch(orderListRequest());
                const { data } = await api.get('/orders/myorders');
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                dispatch(orderListSuccess(sortedData));
            } catch (err) {
                dispatch(orderListFail(err.response?.data?.message || err.message));
            }
        };
        fetchMyOrders();
    }, [dispatch]);

    const renderContent = () => {
        if (loading) return <LoadingSkeleton />;
        if (error) return <ErrorDisplay message={error} />;
        if (!orders || orders.length === 0) return <EmptyState />;

        return (
            <div className="space-y-4">
                {/* --- Desktop Header --- */}
                <div className="hidden md:grid grid-cols-[2fr,1fr,1fr,1.5fr,auto] gap-6 px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    <span>Order ID</span>
                    <span>Date</span>
                    <span>Total</span>
                    <span>Status</span>
                    <span className="text-right"></span>
                </div>
                {/* --- Orders List --- */}
                {orders.map((order, index) => (
                    <OrderRow key={order._id} order={order} index={index} />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-zinc-50 min-h-screen font-sans">
            <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
                <header className="mb-8 md:mb-10" data-aos="fade-down">
                    <h1 className="font-marcellus text-4xl md:text-5xl text-zinc-900">
                        Order History
                    </h1>
                    <p className="text-zinc-500 mt-2">Review your past orders and their delivery status.</p>
                </header>

                <main>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={loading ? 'loading' : error ? 'error' : orders?.length || 0}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default MyOrdersPage;