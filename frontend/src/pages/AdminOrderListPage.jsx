import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderListRequest, orderListSuccess, orderListFail } from '../features/orders/orderSlice';
import api from '../api/AxiosAPI';

const AdminOrderListPage = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);

    const [refresh, setRefresh] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(null); // For modal
    const [modalLoading, setModalLoading] = useState(false);
    const [openItems, setOpenItems] = useState({}); // Track collapsible items in modal

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                dispatch(orderListRequest());
                const { data } = await api.get('/admin/orders');
                dispatch(orderListSuccess(data));
            } catch (err) {
                dispatch(orderListFail(err.response?.data?.message || err.message));
            }
        };
        fetchAllOrders();
    }, [dispatch, refresh]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus });
            setRefresh(prev => prev + 1);
        } catch (error) {
            alert('Failed to update order status.');
        }
    };

    const openOrderDetails = async (orderId) => {
        try {
            setModalLoading(true);
            const { data } = await api.get(`/orders/${orderId}`); // make sure admin can access it
            setSelectedOrder(data);
            setOpenItems({}); // Reset collapsible state for new order
            setModalLoading(false);
        } catch (err) {
            setModalLoading(false);
            alert('Failed to fetch order details');
        }
    };

    const closeModal = () => setSelectedOrder(null);

    const toggleItem = (productId) => {
        setOpenItems(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    return (
        <div className="bg-[#f2f2f2] min-h-screen">
            <div className="container mx-auto p-8">
                <h1 className="font-marcellus text-4xl text-slate-900 mb-8">Manage All Orders</h1>

                {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                    <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3">Order ID</th>
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium">{order._id}</td>
                                        <td className="px-6 py-4">{order.user?.name || 'N/A'}</td>
                                        <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="p-1 border rounded-md"
                                            >
                                                <option>Confirmed</option>
                                                <option>Processing</option>
                                                <option>Shipped</option>
                                                <option>Delivered</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => openOrderDetails(order._id)}
                                                className="font-bold text-slate-800 hover:underline"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-6 z-50 overflow-auto">
                        <div className="bg-white rounded-lg w-full max-w-3xl md:w-3/4 max-h-[90vh] overflow-y-auto shadow-2xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-slate-900">Order Details - {selectedOrder._id}</h2>
                                <button onClick={closeModal} className="text-red-500 font-bold hover:text-red-700 text-lg">✕</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm md:text-base">
                                <div>
                                    <p><strong>Customer:</strong> {selectedOrder.user.name}</p>
                                    <p><strong>Email:</strong> {selectedOrder.user.email}</p>
                                </div>
                                <div>
                                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                                    <p><strong>Order Status:</strong> {selectedOrder.orderStatus}</p>
                                    <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                                    <p><strong>Created At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold mb-3 border-b pb-2 text-slate-800">Products</h3>
                            <div className="space-y-4">
                                {selectedOrder.orderItems.map(item => (
                                    <div key={item.product} className="border rounded-lg shadow-sm bg-gray-50">
                                        <div
                                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100"
                                            onClick={() => toggleItem(item.product)}
                                        >
                                            <div className="flex items-center">
                                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                                <p className="font-semibold text-lg text-slate-900">{item.name}</p>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-600">{openItems[item.product] ? '−' : '+'}</span>
                                        </div>

                                        {openItems[item.product] && (
                                            <div className="px-4 pb-4">
                                                <p className="text-gray-700">Price: ${item.price.toFixed(2)}</p>

                                                {item.measurements && (
                                                    <div className="mt-2 text-gray-600">
                                                        <p className="font-semibold text-gray-800">Measurements:</p>
                                                        <ul className="list-disc list-inside ml-2">
                                                            {Object.entries(item.measurements).map(([key, value]) => (
                                                                <li key={key}>{key}: {value}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {item.selectedCustomizations && (
                                                    <div className="mt-2 text-gray-600">
                                                        <p className="font-semibold text-gray-800">Customizations:</p>
                                                        <ul className="list-disc list-inside ml-2">
                                                            {Object.entries(item.selectedCustomizations).map(([key, value]) => (
                                                                <li key={key}>{key}: {value}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                <p className="mt-2 font-semibold">Total: ${item.price.toFixed(2)}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 border-t pt-4 text-right text-lg font-semibold text-slate-900">
                                Total Order Price: ${selectedOrder.totalPrice.toFixed(2)}
                            </div>

                            <div className="mt-6 text-right">
                                <button
                                    onClick={closeModal}
                                    className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrderListPage;
