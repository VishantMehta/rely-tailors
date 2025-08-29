import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { orderListRequest, orderListSuccess, orderListFail } from '../features/orders/orderSlice';
import api from '../api/AxiosAPI';

// --- Helper Components & Functions ---

// Helper to format date strings into a more readable format.
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Helper to generate a color-coded status badge based on the order status.
const StatusBadge = ({ status }) => {
    let colors = '';
    switch (status) {
        case 'Pending Confirmation':
            colors = 'bg-yellow-100 text-yellow-800 border-yellow-200';
            break;
        case 'Confirmed':
        case 'Processing':
            colors = 'bg-blue-100 text-blue-800 border-blue-200';
            break;
        case 'Shipped':
            colors = 'bg-indigo-100 text-indigo-800 border-indigo-200';
            break;
        case 'Delivered':
            colors = 'bg-green-100 text-green-800 border-green-200';
            break;
        case 'Cancelled':
            colors = 'bg-red-100 text-red-800 border-red-200';
            break;
        default:
            colors = 'bg-slate-100 text-slate-800 border-slate-200';
    }
    return (
        <span className={`px-3 py-1 text-xs font-bold leading-none rounded-full border ${colors}`}>
            {status}
        </span>
    );
};

// --- Main Component ---

const MyOrdersPage = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                dispatch(orderListRequest());
                const { data } = await api.get('/orders/myorders');
                // Sort orders from newest to oldest
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                dispatch(orderListSuccess(sortedData));
            } catch (err) {
                dispatch(orderListFail(err.response?.data?.message || err.message));
            }
        };
        fetchMyOrders();
    }, [dispatch]);

    const renderOrders = () => {
        if (orders.length === 0) {
            return (
                <div className="text-center bg-white p-12 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">No Orders Found</h2>
                    <p className="text-slate-500 mb-6">You haven't placed any orders yet. Let's change that!</p>
                    <Link to="/products" className="bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors">
                        Start Shopping
                    </Link>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {/* --- Desktop Header (hidden on mobile) --- */}
                <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase bg-slate-50 rounded-lg">
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                </div>

                {/* --- Orders List --- */}
                {orders.map(order => (
                    <div key={order._id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300" data-aos="fade-up">
                        {/* --- Mobile Card Layout --- */}
                        <div className="p-4 border-b border-slate-200 md:hidden">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-slate-800 text-lg">#{order._id.substring(18)}</span>
                                <StatusBadge status={order.orderStatus} />
                            </div>
                            <div className="text-sm text-slate-500 space-y-1">
                                <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                                <p><strong>Total:</strong>
                                    <span className="font-bold text-slate-700 ml-1">
                                        ${Number(order.totalPrice || 0).toFixed(2)}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="p-4 md:hidden">
                            <Link to={`/orders/${order._id}`} className="block w-full text-center bg-slate-800 text-white font-bold py-2.5 px-4 rounded-md hover:bg-slate-700 transition-colors">
                                View Details
                            </Link>
                        </div>

                        {/* --- Desktop List Layout --- */}
                        <div className="hidden md:grid grid-cols-5 gap-4 items-center px-6 py-5">
                            <p className="font-mono text-sm text-slate-700 font-semibold">#{order._id}</p>
                            <p className="text-slate-600">{formatDate(order.createdAt)}</p>
                            <p className="font-semibold text-slate-800">${Number(order.totalPrice || 0).toFixed(2)}</p>
                            <div><StatusBadge status={order.orderStatus} /></div>
                            <div className="text-right">
                                <Link to={`/orders/${order._id}`} className="font-bold text-slate-800 hover:underline">
                                    View Details →
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-[#f2f2f2] min-h-screen">
            <div className="container mx-auto px-4 sm:px-8 py-8">
                <h1 className="font-marcellus text-3xl md:text-4xl text-slate-900 mb-8" data-aos="fade-down">My Orders</h1>
                {loading ? (
                    <p className="text-center text-slate-600">Loading your orders...</p>
                ) : error ? (
                    <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>
                ) : (
                    renderOrders()
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;