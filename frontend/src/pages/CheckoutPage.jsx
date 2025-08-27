import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, clearCart } from '../features/cart/cartSlice';
import api from '../api/AxiosAPI';

// --- Background Cubes Component ---
const BackgroundCubes = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
        <ul className="circles">
            <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
        </ul>
    </div>
);

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    // Calculate prices
    const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
    const shipping = subtotal > 500 ? 0 : 50; // Example shipping logic
    const total = subtotal + shipping;

    const placeOrderHandler = async () => {
        try {
            const orderItems = cartItems.map(item => ({
                name: item.name,
                imageUrl: item.imageUrl,
                price: item.price,
                product: item.product,
                measurements: userInfo.measurements, // Assuming measurements are on user object
                selectedCustomizations: item.selectedCustomizations,
            }));

            const { data } = await api.post('/orders', {
                orderItems,
                totalPrice: total,
            });

            dispatch(clearCart());
            navigate(`/orders/${data._id}`);
        } catch (error) {
            alert('Could not place order.');
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#f2f2f2] font-montserrat text-slate-800">
            <BackgroundCubes />
            <div className="relative z-10 container mx-auto px-4 py-12">
                <div data-aos="fade-down" className="text-center mb-12">
                    <h1 className="font-marcellus text-5xl text-slate-900">Checkout</h1>
                    <p className="text-slate-500 mt-2">Please review your order details below.</p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center bg-white p-10 rounded-lg shadow-md" data-aos="fade-up">
                        <p className="text-slate-500">Your cart is empty.</p>
                        <Link to="/products" className="inline-block mt-4 bg-slate-900 text-white font-bold py-3 px-8 rounded-md hover:bg-slate-800 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Side: Order Summary */}
                        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md p-8 rounded-lg shadow-lg border border-white/20" data-aos="fade-right">
                            <h2 className="font-marcellus text-3xl text-slate-900 mb-6">Order Summary</h2>
                            <div className="space-y-6">
                                {cartItems.map(item => (
                                    <div key={item.cartId} className="flex items-start gap-6 border-b pb-6">
                                        <img src={item.imageUrl} alt={item.name} className="w-24 h-32 object-cover rounded-md"/>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{item.name}</h3>
                                            <div className="text-xs text-slate-500 mt-1">
                                                {Object.entries(item.selectedCustomizations).map(([key, value]) => (
                                                    <p key={key}><span className="font-semibold">{key}:</span> {value}</p>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-lg">${item.price.toFixed(2)}</p>
                                            <button onClick={() => dispatch(removeFromCart(item.cartId))} className="text-red-500 text-xs hover:underline mt-2">Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Price & Checkout */}
                        <div className="lg:col-span-1" data-aos="fade-left">
                            <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow-lg border border-white/20">
                                <h2 className="font-marcellus text-3xl text-slate-900 mb-6">Total</h2>
                                <div className="space-y-4 text-slate-600">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                    </div>
                                     <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="font-semibold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-900 font-bold text-xl border-t pt-4">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={placeOrderHandler}
                                    className="w-full mt-8 bg-slate-900 text-white font-bold py-3 px-8 rounded-md hover:bg-slate-800 transition-colors duration-300 text-sm uppercase tracking-widest"
                                >
                                    Confirm & Place Order
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;
