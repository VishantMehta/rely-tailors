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
                <div data-aos="fade-down">
                    <h1 className="font-marcellus text-4xl text-slate-900 mb-2">Order #{order._id}</h1>
                    <p className="text-slate-500 mb-8">Status: <span className="font-bold">{order.orderStatus}</span></p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md" data-aos="fade-up">
                    <h2 className="font-marcellus text-2xl mb-6">Order Items</h2>
                    {order.orderItems.map(item => (
                        <div key={item._id} className="flex items-start sm:items-center gap-6 border-b py-6 last:border-b-0">
                            <img src={item.imageUrl} alt={item.name} className="w-24 h-32 object-cover rounded-md"/>
                            <div className="flex-1">
                                <p className="font-bold text-lg">{item.name}</p>
                                <div className="text-sm text-slate-500 mt-2">
                                    {Object.entries(item.selectedCustomizations).map(([key, value]) => (
                                        <p key={key}><span className="font-semibold">{key}:</span> {value}</p>
                                    ))}
                                </div>
                            </div>
                             <p className="font-semibold text-lg ml-auto">${item.price.toFixed(2)}</p>
                        </div>
                    ))}
                     <div className="flex justify-end mt-8 pt-6 border-t">
                        <div className="w-full max-w-xs space-y-2">
                             <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="font-semibold">Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl">
                                <span>Total</span>
                                <span>${order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
