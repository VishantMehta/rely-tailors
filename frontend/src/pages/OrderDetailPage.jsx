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

    const handleWhatsAppConfirm = () => {
        if (!order) return;

        // IMPORTANT: Replace with the owner's actual phone number
        const ownerPhoneNumber = '919876543210';

        const message = `Hi, I've just placed Order #${order._id}. I'd like to confirm the details and payment.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${ownerPhoneNumber}?text=${encodedMessage}`;

        // Opens WhatsApp in a new tab without leaving your site
        window.open(whatsappUrl, '_blank');
    };

    if (loading) return <p className="text-center p-8">Loading order details...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;
    if (!order) return null;

    return (
        <div className="bg-[#f2f2f2] min-h-screen">
            <div className="container mx-auto p-8">
                <div data-aos="fade-down">
                    <h1 className="font-marcellus text-4xl text-slate-900 mb-2">Order #{order._id}</h1>
                    <p className="text-slate-500 mb-4">Status: <span className="font-bold">{order.orderStatus}</span></p>

                    {order.orderStatus === 'Pending Confirmation' && (
                        <div className="mb-8" data-aos="fade-up">
                            <button
                                onClick={handleWhatsAppConfirm}
                                className="w-full md:w-auto bg-green-500 text-white font-bold py-3 px-8 rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-3"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                                </svg>
                                Confirm Your Order on WhatsApp
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md" data-aos="fade-up">
                    <h2 className="font-marcellus text-2xl mb-6">Order Items</h2>
                    {order.orderItems.map(item => (
                        <div key={item._id || item.product} className="flex items-start sm:items-center gap-6 border-b py-6 last:border-b-0">
                            <img src={item.imageUrl} alt={item.name} className="w-24 h-32 object-cover rounded-md" />
                            <div className="flex-1">
                                <p className="font-bold text-lg">{item.name}</p>
                                <div className="text-sm text-slate-500 mt-2">
                                    {Object.entries(item.selectedCustomizations || {}).map(([key, value]) => (
                                        <p key={key}><span className="font-semibold">{key}:</span> {value}</p>
                                    ))}
                                </div>
                            </div>
                            {/* FIX: Ensure item.price is a number before calling toFixed */}
                            <p className="font-semibold text-lg ml-auto">${Number(item.price || 0).toFixed(2)}</p>
                        </div>
                    ))}
                    <div className="flex justify-end mt-8 pt-6 border-t">
                        <div className="w-full max-w-xs space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                {/* FIX: Ensure order.totalPrice is a number before calling toFixed */}
                                <span className="font-semibold">${Number(order.totalPrice || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="font-semibold">Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl">
                                <span>Total</span>
                                {/* FIX: Ensure order.totalPrice is a number before calling toFixed */}
                                <span>${Number(order.totalPrice || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;