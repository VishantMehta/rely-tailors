import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, ChevronDown, X, Loader2, CheckCircle2, XCircle, Trash2,
    AlertTriangle, Search, User, Calendar, CircleDollarSign, MoreVertical, Eye,
    Truck, Check, Clock
} from 'lucide-react';
import { orderListRequest, orderListSuccess, orderListFail } from '../features/orders/orderSlice';
import api from '../api/AxiosAPI';

// --- Premium Status Configuration ---
const STATUS_CONFIG = {
    'Pending Confirmation': { 
        bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', 
        icon: Clock, label: 'Pending' 
    },
    'Confirmed': { 
        bg: 'bg-stone-200', text: 'text-stone-700', border: 'border-stone-300', 
        icon: Check, label: 'Confirmed' 
    },
    'Processing': { 
        bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', 
        icon: Loader2, animate: true, label: 'Processing' 
    },
    'Shipped': { 
        bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', 
        icon: Truck, label: 'Shipped' 
    },
    'Delivered': { 
        bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', 
        icon: CheckCircle2, label: 'Delivered' 
    },
    'Cancelled': { 
        bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', 
        icon: XCircle, label: 'Cancelled' 
    },
    'Default': { 
        bg: 'bg-stone-100', text: 'text-stone-600', border: 'border-stone-200', 
        icon: Package, label: 'Unknown' 
    }
};

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Default;
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${config.bg} ${config.text} ${config.border}`}>
            <Icon className={`h-3 w-3 ${config.animate ? 'animate-spin' : ''}`} strokeWidth={2} />
            {config.label}
        </span>
    );
};

// --- Action Menu with Premium Feel ---
const ActionMenu = ({ order, onConfirm, onCancel, onDelete, onView, openUpward }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuPositionClasses = openUpward ? 'bottom-full mb-2' : 'top-full mt-2';

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(prev => !prev)} 
                className="p-2 rounded-full hover:bg-stone-200 transition-colors text-stone-500 hover:text-stone-800"
            >
                <MoreVertical className="h-4 w-4" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: openUpward ? 10 : -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: openUpward ? 10 : -10 }}
                        onMouseLeave={() => setIsOpen(false)}
                        className={`absolute right-0 w-48 bg-white rounded-sm shadow-xl border border-stone-100 z-20 ${menuPositionClasses}`}
                    >
                        <button onClick={() => { onView(order._id); setIsOpen(false); }} className="w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold text-stone-600 hover:bg-stone-50 hover:text-amber-700 flex items-center gap-2 transition-colors">
                            <Eye className="h-4 w-4" /> View Details
                        </button>
                        {order.orderStatus === 'Pending Confirmation' && (
                            <>
                                <button onClick={() => { onConfirm(order._id); setIsOpen(false); }} className="w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold text-stone-600 hover:bg-stone-50 hover:text-green-700 flex items-center gap-2 transition-colors">
                                    <CheckCircle2 className="h-4 w-4" /> Confirm
                                </button>
                                <button onClick={() => { onCancel(order._id); setIsOpen(false); }} className="w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold text-stone-600 hover:bg-stone-50 hover:text-red-700 flex items-center gap-2 transition-colors">
                                    <XCircle className="h-4 w-4" /> Cancel
                                </button>
                                <button onClick={() => { onDelete(order); setIsOpen(false); }} className="w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold text-stone-600 hover:bg-stone-50 hover:text-red-700 flex items-center gap-2 transition-colors border-t border-stone-100">
                                    <Trash2 className="h-4 w-4" /> Delete
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Mobile Order Card ---
const OrderCard = ({ order, onStatusChange, onConfirm, onCancel, onDelete, onView, isLast }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white p-5 rounded-sm border border-stone-200 shadow-sm flex flex-col gap-4"
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-400">Order ID</p>
                <p className="font-mono text-sm font-medium text-stone-800" title={order._id}>#{order._id.slice(-6)}</p>
            </div>
            <StatusBadge status={order.orderStatus} />
        </div>

        <div className="border-t border-stone-100 pt-3 text-sm space-y-2 font-light">
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-stone-400" /><span className="text-stone-700">{order.user?.name || 'Guest'}</span></div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-stone-400" /><span className="text-stone-600">{new Date(order.createdAt).toLocaleDateString()}</span></div>
            <div className="flex items-center gap-2"><CircleDollarSign className="h-4 w-4 text-stone-400" /><span className="font-medium text-stone-900">₹{Number(order.totalPrice || 0).toFixed(2)}</span></div>
        </div>

        <div className="border-t border-stone-100 pt-3 flex items-center justify-between gap-3">
            {order.orderStatus !== 'Pending Confirmation' ? (
                <div className="relative w-full">
                    <select 
                        value={order.orderStatus} 
                        onChange={(e) => onStatusChange(order._id, e.target.value)} 
                        className="w-full p-2 pl-3 pr-8 border border-stone-200 rounded-sm text-stone-700 bg-stone-50 text-xs uppercase tracking-wide focus:ring-1 focus:outline-none focus:ring-amber-500 focus:border-amber-500 appearance-none"
                    >
                        {['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                </div>
            ) : <span className="text-xs text-amber-600 italic font-medium bg-amber-50 px-3 py-1 rounded-full">Needs Approval</span>}
            <ActionMenu order={order} onConfirm={onConfirm} onCancel={onCancel} onDelete={onDelete} onView={onView} openUpward={isLast} />
        </div>
    </motion.div>
);

// --- Skeleton Loader ---
const OrderListSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="hidden md:block">
            <div className="h-12 bg-stone-200 w-full mb-4 rounded-sm"></div>
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border-b border-stone-100">
                    <div className="h-4 bg-stone-200 w-24 rounded"></div>
                    <div className="h-4 bg-stone-200 w-32 rounded"></div>
                    <div className="h-4 bg-stone-200 w-24 rounded"></div>
                    <div className="h-4 bg-stone-200 w-20 rounded"></div>
                    <div className="h-6 bg-stone-200 w-24 rounded-full"></div>
                </div>
            ))}
        </div>
        <div className="md:hidden space-y-4">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-stone-200 rounded-sm"></div>
             ))}
        </div>
    </div>
);

// --- Confirmation Modal ---
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-sm w-full max-w-sm p-6 shadow-2xl border-t-4 border-red-600">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 mb-4">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="font-marcellus text-xl text-stone-900 mb-2">{title}</h3>
                        <p className="text-sm text-stone-500 font-light leading-relaxed mb-6">{message}</p>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row gap-3">
                        <button onClick={onCancel} disabled={isLoading} className="w-full inline-flex justify-center rounded-sm border border-stone-300 px-4 py-3 bg-white text-xs font-bold uppercase tracking-widest text-stone-700 hover:bg-stone-50 transition-colors">Cancel</button>
                        <button onClick={onConfirm} disabled={isLoading} className="w-full inline-flex justify-center rounded-sm border border-transparent px-4 py-3 bg-red-700 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-800 transition-colors">
                            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirm Delete'}
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// --- Main Page Component ---
const AdminOrderListPage = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);
    const [searchTerm, setSearchTerm] = useState('');
    const [refresh, setRefresh] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [openItems, setOpenItems] = useState({});
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchAllOrders = useCallback(async (searchQuery) => {
        dispatch(orderListRequest());
        try {
            const url = searchQuery ? `/admin/orders?search=${searchQuery}` : '/admin/orders';
            const { data } = await api.get(url);
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            dispatch(orderListSuccess(sortedData));
        } catch (err) {
            dispatch(orderListFail(err.response?.data?.message || err.message));
        }
    }, [dispatch]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchAllOrders(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [fetchAllOrders, refresh, searchTerm]);

    const handleAction = async (action) => {
        try {
            await action();
            setRefresh(prev => prev + 1);
        } catch (err) {
            console.error("Action failed:", err);
        }
    };

    const confirmHandler = (orderId) => handleAction(() => api.put(`/admin/orders/${orderId}/confirm`));
    const cancelHandler = (orderId) => handleAction(() => api.put(`/admin/orders/${orderId}/cancel`));
    const handleStatusChange = (orderId, newStatus) => handleAction(() => api.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus }));

    const deleteHandler = async () => {
        if (!orderToDelete) return;
        setIsDeleting(true);
        await handleAction(() => api.delete(`/admin/orders/${orderToDelete._id}`));
        setIsDeleting(false);
        setOrderToDelete(null);
    };

    const openOrderDetails = async (orderId) => {
        setModalLoading(true);
        setSelectedOrder(true);
        try {
            const { data } = await api.get(`/admin/orders/${orderId}`);
            setSelectedOrder(data);
            setOpenItems({});
        } catch (err) {
            setSelectedOrder(null);
        } finally {
            setModalLoading(false);
        }
    };

    const closeModal = () => setSelectedOrder(null);
    const toggleItem = (productId) => setOpenItems(prev => ({ ...prev, [productId]: !prev[productId] }));
    const formatTimestamp = (dateString) => new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="bg-[#FDFBF7] min-h-screen font-montserrat text-stone-800">
            <div className="container mx-auto p-4 sm:p-8 lg:p-12">
                <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="font-marcellus text-3xl sm:text-4xl text-stone-900 mb-2">Order Management</h1>
                        <p className="text-stone-500 font-light text-sm">Oversee and update customer orders in real-time.</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-sm pl-10 pr-4 py-3 text-sm shadow-sm focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 transition-all placeholder-stone-400"
                        />
                    </div>
                </header>

                <div className="bg-white border border-stone-100 rounded-sm shadow-sm overflow-hidden">
                    {loading ? <OrderListSkeleton /> : error ? <p className="text-red-500 p-8 text-center">{error}</p> : (
                        <>
                            {/* Mobile View */}
                            <div className="space-y-4 md:hidden p-4 bg-stone-50">
                                <AnimatePresence>
                                    {orders.map((order, index) => (
                                        <OrderCard
                                            key={order._id}
                                            order={order}
                                            onStatusChange={handleStatusChange}
                                            onConfirm={confirmHandler}
                                            onCancel={cancelHandler}
                                            onDelete={setOrderToDelete}
                                            onView={openOrderDetails}
                                            isLast={index >= orders.length - 2}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Desktop View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-[10px] uppercase tracking-widest text-stone-500 bg-stone-50/80 border-b border-stone-100">
                                        <tr>
                                            <th className="px-6 py-5 font-bold">Order ID</th>
                                            <th className="px-6 py-5 font-bold">Customer</th>
                                            <th className="px-6 py-5 font-bold">Date Placed</th>
                                            <th className="px-6 py-5 font-bold">Total</th>
                                            <th className="px-6 py-5 font-bold">Status</th>
                                            <th className="px-6 py-5 font-bold text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {orders.map((order, index) => (
                                            <tr key={order._id} className="bg-white hover:bg-amber-50/30 transition-colors group">
                                                <td className="px-6 py-4 font-mono text-xs text-stone-600" title={order._id}>#{order._id.slice(-6)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-stone-800">{order.user?.name || 'Guest'}</div>
                                                    <div className="text-xs text-stone-400 font-light">{order.user?.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-stone-600 font-light">{formatTimestamp(order.createdAt)}</td>
                                                <td className="px-6 py-4 font-medium text-stone-900">₹{Number(order.totalPrice || 0).toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    {order.orderStatus === 'Pending Confirmation' ?
                                                        <StatusBadge status={order.orderStatus} /> :
                                                        <div className="relative w-40">
                                                            <select 
                                                                value={order.orderStatus} 
                                                                onChange={(e) => handleStatusChange(order._id, e.target.value)} 
                                                                className="w-full appearance-none bg-stone-50 border border-stone-200 text-stone-700 text-xs py-2 pl-3 pr-8 rounded-sm focus:outline-none focus:border-amber-700 cursor-pointer hover:bg-white transition-colors"
                                                            >
                                                                {['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                                                            </select>
                                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-stone-400 pointer-events-none" />
                                                        </div>
                                                    }
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <ActionMenu order={order} onConfirm={confirmHandler} onCancel={cancelHandler} onDelete={setOrderToDelete} onView={openOrderDetails} openUpward={index >= orders.length - 3} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ConfirmationModal isOpen={!!orderToDelete} title="Delete Order" message={`Are you sure you want to permanently delete order #${orderToDelete?._id.slice(-6)}? This action cannot be undone.`} onConfirm={deleteHandler} onCancel={() => setOrderToDelete(null)} isLoading={isDeleting} />

            {/* --- Detail Modal --- */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex justify-center items-center z-40 p-4">
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-[#FDFBF7] rounded-sm w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-100">
                            <div className="flex justify-between items-center p-6 border-b border-stone-200 bg-white">
                                <div>
                                    <h2 className="font-marcellus text-2xl text-stone-900">Order Details</h2>
                                    <p className="text-xs uppercase tracking-widest text-stone-500 mt-1">ID: {selectedOrder._id}</p>
                                </div>
                                <button onClick={closeModal} className="p-2 rounded-full hover:bg-stone-100 transition-colors text-stone-500"><X className="h-5 w-5" /></button>
                            </div>
                            
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                {modalLoading ? <div className="text-center p-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-700" /></div> : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                            <div className="bg-white p-5 border border-stone-100 shadow-sm">
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-4 border-b border-stone-100 pb-2">Customer Info</h3>
                                                <div className="space-y-3 text-sm font-light text-stone-600">
                                                    <div className="flex items-center gap-2"><User className="h-4 w-4 text-stone-400" /> <span className="text-stone-800 font-medium">{selectedOrder.user?.name}</span></div>
                                                    <div className="pl-6">{selectedOrder.user?.email}</div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-5 border border-stone-100 shadow-sm">
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-4 border-b border-stone-100 pb-2">Order Info</h3>
                                                <div className="space-y-3 text-sm font-light text-stone-600">
                                                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-stone-400" /> {formatTimestamp(selectedOrder.createdAt)}</div>
                                                    <div className="flex items-center gap-2"><CircleDollarSign className="h-4 w-4 text-stone-400" /> {selectedOrder.paymentMethod}</div>
                                                    <div className="flex items-center gap-2 mt-2"><StatusBadge status={selectedOrder.orderStatus} /></div>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-marcellus text-stone-900 mb-4">Items Ordered</h3>
                                        <div className="space-y-3">
                                            {selectedOrder.orderItems.map(item => (
                                                <div key={item.product} className="border border-stone-100 bg-white rounded-sm overflow-hidden">
                                                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-amber-50/20 transition-colors" onClick={() => toggleItem(item.product)}>
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-16 w-12 bg-stone-100 overflow-hidden">
                                                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="font-marcellus text-lg text-stone-900">{item.name}</p>
                                                                <p className="text-sm font-light text-stone-600">₹{Number(item.price || 0).toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                        <ChevronDown className={`transition-transform text-stone-400 ${openItems[item.product] ? 'rotate-180' : ''}`} />
                                                    </div>
                                                    <AnimatePresence>
                                                        {openItems[item.product] && (
                                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-stone-50 border-t border-stone-100">
                                                                <div className="p-4 text-xs text-stone-600 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {item.measurements && Object.keys(item.measurements).length > 0 && (
                                                                        <div>
                                                                            <p className="font-bold text-stone-800 mb-1 uppercase tracking-wider">Measurements</p>
                                                                            <ul className="space-y-1 font-light">{Object.entries(item.measurements).map(([k, v]) => <li key={k} className="capitalize flex justify-between border-b border-stone-200 border-dashed pb-1"><span>{k}</span> <span>{v}"</span></li>)}</ul>
                                                                        </div>
                                                                    )}
                                                                    {item.selectedCustomizations && Object.keys(item.selectedCustomizations).length > 0 && (
                                                                        <div>
                                                                            <p className="font-bold text-stone-800 mb-1 uppercase tracking-wider">Customizations</p>
                                                                            <ul className="space-y-1 font-light">{Object.entries(item.selectedCustomizations).map(([k, v]) => <li key={k} className="capitalize flex justify-between border-b border-stone-200 border-dashed pb-1"><span>{k}</span> <span>{v}</span></li>)}</ul>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="mt-auto border-t border-stone-200 p-6 flex justify-between items-center bg-stone-50">
                                <span className="text-sm font-light text-stone-500">Total Amount</span>
                                <span className="text-2xl font-marcellus text-amber-700">₹{Number(selectedOrder?.totalPrice || 0).toFixed(2)}</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminOrderListPage;