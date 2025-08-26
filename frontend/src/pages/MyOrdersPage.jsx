import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { orderListRequest, orderListSuccess, orderListFail } from '../features/orders/orderSlice';
import api from '../api/AxiosAPI';

const MyOrders = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                dispatch(orderListRequest());
                const { data } = await api.get('/orders/myorders');
                dispatch(orderListSuccess(data));
            } catch (err) {
                dispatch(orderListFail(err.response?.data?.message || err.message));
            }
        };
        fetchMyOrders();
    }, [dispatch]);

    return (
        <div className="bg-[#f2f2f2] min-h-screen">
            <div className="container mx-auto p-8">
                <h1 className="font-marcellus text-4xl text-slate-900 mb-8">My Orders</h1>
                {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                    <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3">Order ID</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id} className="bg-white border-b">
                                        <td className="px-6 py-4 font-medium">{order._id}</td>
                                        <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">${order.totalPrice.toFixed(2)}</td>
                                        <td className="px-6 py-4">{order.orderStatus}</td>
                                        <td className="px-6 py-4">
                                            <Link to={`/orders/${order._id}`} className="font-bold text-slate-800 hover:underline">Details</Link>
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

export default MyOrders;
