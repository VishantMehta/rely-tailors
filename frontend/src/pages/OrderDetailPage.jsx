import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/AxiosAPI';

const OrderDetailPage = () => {
    const { id: orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/orders/${orderId}`);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                setError('Could not fetch order details.');
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading) return <p className="text-center p-8">Loading order details...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;
    if (!order) return null;

    return (
        <div className="bg-[#f2f2f2] min-h-screen">
            <div className="container mx-auto p-8">
                <h1 className="font-marcellus text-4xl text-slate-900 mb-4">Order #{order._id}</h1>
                <p className="text-slate-500 mb-8">Status: <span className="font-bold">{order.orderStatus}</span></p>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="font-marcellus text-2xl mb-4">Order Items</h2>
                    {order.orderItems.map(item => (
                        <div key={item._id} className="flex items-center gap-6 border-b py-4">
                            <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md"/>
                            <div>
                                <p className="font-bold">{item.name}</p>
                                <p className="text-sm text-slate-500">Price: ${item.price.toFixed(2)}</p>
                                <div className="text-xs mt-2">
                                    {Object.entries(item.selectedCustomizations).map(([key, value]) => (
                                        <p key={key}><span className="font-semibold">{key}:</span> {value}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                     <div className="text-right mt-6 font-bold text-xl">
                        Total: ${order.totalPrice.toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
