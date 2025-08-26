import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderListRequest, orderListSuccess, orderListFail } from '../features/orders/orderSlice';
import api from '../api/AxiosAPI';

const AdminOrderListPage = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);
    
    // Local state to trigger re-fetch after update
    const [refresh, setRefresh] = useState(0); 

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
            setRefresh(prev => prev + 1); // Trigger a re-fetch
        } catch (error) {
            alert('Failed to update order status.');
        }
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
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id} className="bg-white border-b">
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrderListPage;
