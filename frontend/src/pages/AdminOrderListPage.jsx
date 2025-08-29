import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    ChevronDown,
    X,
    Loader2,
    CheckCircle2,
    XCircle,
    Trash2,
    AlertTriangle,
    Search,
    User,
    Calendar,
    CircleDollarSign,
    MoreVertical,
    Eye,
} from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce'; // Assuming a simple debounce hook

import { orderListRequest, orderListSuccess, orderListFail } from '../features/orders/orderSlice';
import api from '../api/AxiosAPI';

// --- Helper Components ---

const STATUS_CONFIG = {
    'Pending Confirmation': { color: 'bg-yellow-100 text-yellow-800', icon: Loader2, animate: true },
    'Confirmed': { color: 'bg-cyan-100 text-cyan-800', icon: CheckCircle2 },
    'Processing': { color: 'bg-blue-100 text-blue-800', icon: Loader2, animate: true },
    'Shipped': { color: 'bg-indigo-100 text-indigo-800', icon: Package },
    'Delivered': { color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
    'Cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle },
    'Default': { color: 'bg-zinc-100 text-zinc-800', icon: Package }
};

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Default;
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold leading-none rounded-full ${config.color}`}>
            <Icon className={`h-3.5 w-3.5 ${config.animate ? 'animate-spin' : ''}`} />
            {status}
        </span>
    );
};

// --- FIX: ActionMenu now accepts an 'openUpward' prop ---
const ActionMenu = ({ order, onConfirm, onCancel, onDelete, onView, openUpward }) => {
    const [isOpen, setIsOpen] = useState(false);

    // --- FIX: Added classes to position the menu upwards if 'openUpward' is true ---
    const menuPositionClasses = openUpward
        ? 'bottom-full mb-2'
        : 'top-full mt-2';

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} onBlur={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-zinc-200 transition-colors">
                <MoreVertical className="h-5 w-5 text-zinc-600" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: openUpward ? 10 : -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: openUpward ? 10 : -10 }}
                        className={`absolute right-0 w-48 bg-white rounded-md shadow-lg border z-20 ${menuPositionClasses}`}
                        onMouseLeave={() => setIsOpen(false)}
                    >
                        {/* Always show "View Details" */}
                        <button
                            onClick={() => { onView(order._id); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 flex items-center gap-2"
                        >
                            <Eye className="h-4 w-4" /> View Details
                        </button>

                        {/* Extra actions only if Pending Confirmation */}
                        {order.orderStatus === 'Pending Confirmation' && (
                            <>
                                <button
                                    onClick={() => { onConfirm(order._id); setIsOpen(false); }}
                                    className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center gap-2"
                                >
                                    <CheckCircle2 className="h-4 w-4" /> Confirm
                                </button>
                                <button
                                    onClick={() => { onCancel(order._id); setIsOpen(false); }}
                                    className="w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 flex items-center gap-2"
                                >
                                    <XCircle className="h-4 w-4" /> Cancel
                                </button>
                                <button
                                    onClick={() => { onDelete(order); setIsOpen(false); }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                                >
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

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl">
                    <div className="flex items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-zinc-900">{title}</h3>
                            <div className="mt-2">
                                <p className="text-sm text-zinc-500">{message}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                        <button onClick={onConfirm} disabled={isLoading} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:w-auto sm:text-sm disabled:bg-red-300">
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Confirm'}
                        </button>
                        <button onClick={onCancel} disabled={isLoading} className="mt-3 w-full inline-flex justify-center rounded-md border border-zinc-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-zinc-700 hover:bg-zinc-50 sm:mt-0 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// --- Main Component ---

const AdminOrderListPage = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);

    const [refresh, setRefresh] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [openItems, setOpenItems] = useState({});
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // --- FIX: State for search input and debounced value for API call ---
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

    // --- FIX: API call logic now handles search ---
    const fetchAllOrders = useCallback(async (searchQuery) => {
        try {
            dispatch(orderListRequest());
            // --- FIX: Append search query to the API endpoint ---
            const url = searchQuery ? `/admin/orders?search=${searchQuery}` : '/admin/orders';
            const { data } = await api.get(url);
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            dispatch(orderListSuccess(sortedData));
        } catch (err) {
            dispatch(orderListFail(err.response?.data?.message || err.message));
        }
    }, [dispatch]);

    // --- FIX: useEffect to fetch all orders on mount/refresh ---
    useEffect(() => {
        // Only fetch all orders if there is no search term
        if (!debouncedSearchTerm) {
            fetchAllOrders();
        }
    }, [refresh, debouncedSearchTerm, fetchAllOrders]);

    // --- FIX: useEffect to trigger search when debounced term changes ---
    useEffect(() => {
        if (debouncedSearchTerm) {
            fetchAllOrders(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm, fetchAllOrders]);


    const handleAction = async (action, successMsg, errorMsg) => {
        try {
            await action();
            console.log(successMsg);
            setRefresh(prev => prev + 1);
        } catch (err) {
            console.error(errorMsg, err);
        }
    };

    const confirmHandler = (orderId) => handleAction(() => api.put(`/admin/orders/${orderId}/confirm`), 'Order confirmed', 'Failed to confirm');
    const cancelHandler = (orderId) => handleAction(() => api.put(`/admin/orders/${orderId}/cancel`), 'Order cancelled', 'Failed to cancel');

    const deleteHandler = async () => {
        setIsDeleting(true);
        await handleAction(() => api.delete(`/admin/orders/${orderToDelete._id}`), 'Order deleted', 'Failed to delete');
        setIsDeleting(false);
        setOrderToDelete(null);
    };

    const handleStatusChange = (orderId, newStatus) => handleAction(() => api.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus }), `Status updated to ${newStatus}`, 'Failed to update status');

    const openOrderDetails = async (orderId) => {
        setModalLoading(true);
        setSelectedOrder(true);
        try {
            const { data } = await api.get(`/orders/${orderId}`);
            setSelectedOrder(data);
            setOpenItems({});
        } catch (err) {
            setSelectedOrder(null);
            console.error('Failed to fetch order details');
        } finally {
            setModalLoading(false);
        }
    };

    const closeModal = () => setSelectedOrder(null);
    const toggleItem = (productId) => setOpenItems(prev => ({ ...prev, [productId]: !prev[productId] }));
    const formatTimestamp = (dateString) => new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="bg-zinc-100 min-h-screen font-sans">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <header className="mb-8">
                    <h1 className="font-marcellus text-3xl md:text-4xl text-zinc-900">Manage All Orders</h1>
                    <p className="text-zinc-500 mt-1">View, update, and manage customer orders.</p>
                </header>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-lg border-zinc-300 rounded-full pl-12 pr-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 transition-all"
                        />
                    </div>

                    {loading ? <div className="text-center p-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-zinc-500" /></div> : error ? <p className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-zinc-500 uppercase bg-zinc-50">
                                    <tr>
                                        <th className="px-6 py-3">Order ID</th>
                                        <th className="px-6 py-3">Customer</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Total</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => ( // --- FIX: Added index ---
                                        <tr key={order._id} className="bg-white border-b hover:bg-zinc-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs font-semibold text-zinc-700" title={order._id}>{order._id}</td>
                                            <td className="px-6 py-4 text-zinc-800 font-medium">{order.user?.name || 'N/A'}</td>
                                            <td className="px-6 py-4 text-zinc-600">{formatTimestamp(order.createdAt)}</td>
                                            <td className="px-6 py-4 font-semibold text-zinc-900">${Number(order.totalPrice || 0).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                {order.orderStatus === 'Pending Confirmation' ?
                                                    <StatusBadge status={order.orderStatus} />
                                                    : (
                                                        <select value={order.orderStatus} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="p-1.5 border rounded-md text-zinc-700 bg-white text-xs focus:ring-2 focus:ring-zinc-500">
                                                            {['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                                                        </select>
                                                    )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {/* --- FIX: Pass 'openUpward' prop if it's one of the last 3 items --- */}
                                                <ActionMenu
                                                    order={order}
                                                    onConfirm={confirmHandler}
                                                    onCancel={cancelHandler}
                                                    onDelete={setOrderToDelete}
                                                    onView={openOrderDetails}
                                                    openUpward={index >= orders.length - 3}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!orderToDelete}
                title="Delete Order"
                message={`Are you sure you want to permanently delete order #${orderToDelete?._id}? This action cannot be undone.`}
                onConfirm={deleteHandler}
                onCancel={() => setOrderToDelete(null)}
                isLoading={isDeleting}
            />

            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 p-4">
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-zinc-50 rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
                            <div className="flex justify-between items-center p-6 border-b">
                                <h2 className="text-2xl font-bold font-marcellus text-zinc-900">Order Details</h2>
                                <button onClick={closeModal} className="p-2 rounded-full hover:bg-zinc-200 transition-colors"><X className="h-5 w-5" /></button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                {modalLoading ? <div className="text-center p-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-zinc-500" /></div> : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2"><User className="h-4 w-4 text-zinc-500" /><strong>Customer:</strong> {selectedOrder.user?.name} ({selectedOrder.user?.email})</div>
                                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-zinc-500" /><strong>Placed On:</strong> {formatTimestamp(selectedOrder.createdAt)}</div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2"><CircleDollarSign className="h-4 w-4 text-zinc-500" /><strong>Payment:</strong> {selectedOrder.paymentMethod}</div>
                                                <div className="flex items-center gap-2">
                                                    <strong>Status:</strong> <StatusBadge status={selectedOrder.orderStatus} />
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-3 border-t pt-4 text-zinc-800">Products</h3>
                                        <div className="space-y-2">
                                            {selectedOrder.orderItems.map(item => (
                                                <div key={item.product} className="border rounded-lg bg-white">
                                                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50" onClick={() => toggleItem(item.product)}>
                                                        <div className="flex items-center gap-4">
                                                            <img src={item.imageUrl} alt={item.name} className="w-16 h-20 object-cover rounded-md" />
                                                            <div>
                                                                <p className="font-semibold text-zinc-900">{item.name}</p>
                                                                <p className="text-sm text-zinc-600">${Number(item.price || 0).toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                        <ChevronDown className={`transition-transform ${openItems[item.product] ? 'rotate-180' : ''}`} />
                                                    </div>
                                                    {openItems[item.product] && (
                                                        <div className="px-4 pb-4 border-t pt-4 space-y-3 text-xs text-zinc-600">
                                                            {item.measurements && Object.keys(item.measurements).length > 0 && (
                                                                <div>
                                                                    <p className="font-semibold text-zinc-800">Measurements:</p>
                                                                    <ul className="list-disc list-inside ml-2">
                                                                        {Object.entries(item.measurements).map(([k, v]) => <li key={k}>{k}: {v}"</li>)}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            {item.selectedCustomizations && Object.keys(item.selectedCustomizations).length > 0 && (
                                                                <div>
                                                                    <p className="font-semibold text-zinc-800">Customizations:</p>
                                                                    <ul className="list-disc list-inside ml-2">
                                                                        {Object.entries(item.selectedCustomizations).map(([k, v]) => <li key={k}>{k}: {v}</li>)}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="mt-auto border-t p-6 text-right text-lg font-semibold text-zinc-900 bg-zinc-100">
                                Total Order Price: ${Number(selectedOrder?.totalPrice || 0).toFixed(2)}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminOrderListPage;

