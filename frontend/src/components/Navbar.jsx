import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { clearCart, fetchUserCart } from '../features/cart/cartSlice';
// Icon SVGs for the navbar
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);
const AdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart); // <-- Add this line
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //for fixing
    useEffect(() => {
        if (userInfo) {
            dispatch(fetchUserCart());
        }
    }, [dispatch, userInfo]);

    const logoutHandler = () => {

        dispatch(logout());
        dispatch(clearCart());
        setIsMenuOpen(false);
        navigate('/login');
    };

    return (
        <nav className="bg-[#f2f2f2] text-slate-800 h-24 font-montserrat border-b border-slate-200 relative z-50">
            <div className="container mx-auto px-6 h-full flex justify-between items-center">
                {/* Left Side: Logo */}
                <Link to="/" className="text-3xl font-marcellus tracking-wider">RELY TAILORS</Link>

                {/* Center: Main Navigation (Desktop) */}
                <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest">
                    <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
                    <Link to="/products" className="hover:text-amber-600 transition-colors">Shop</Link>
                    <Link to="#" className="hover:text-amber-600 transition-colors">About</Link>
                    <Link to="#" className="hover:text-amber-600 transition-colors">Contact</Link>
                </div>

                {/* Right Side: User Actions (Desktop) */}
                <div className="hidden md:flex items-center space-x-6">
                    {/* Admin Menu */}
                    {userInfo && userInfo.role === 'admin' && (
                        <div className="relative group h-24 flex items-center">
                            <Link to="/admin/productlist" className="flex items-center space-x-2 cursor-pointer hover:text-amber-600">
                                <AdminIcon />
                                <span>Admin</span>
                            </Link>
                            <div className="absolute top-full right-0 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto border border-slate-200 z-50">
                                <Link to="/admin/productlist" className="block px-4 py-2 text-sm hover:bg-slate-100">Products</Link>
                                <Link to="/admin/orders" className="block px-4 py-2 text-sm hover:bg-slate-100">Orders</Link>
                                <Link to="/admin/userlist" className="block px-4 py-2 text-sm hover:bg-slate-100">Users</Link>
                            </div>
                        </div>
                    )}

                    {userInfo ? (
                        <div className="relative group h-24 flex items-center">
                            <Link to="/profile" className="flex items-center space-x-2 cursor-pointer hover:text-amber-600">
                                <UserIcon />
                                <span>{userInfo.name.split(' ')[0]}</span>
                            </Link>
                            <div className="absolute top-full right-0 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto border border-slate-200 z-50">
                                <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-slate-100">My Profile</Link>
                                <Link to="/my-orders" className="block px-4 py-2 text-sm hover:bg-slate-100">My Orders</Link>
                                <button onClick={logoutHandler} className="w-full text-left block px-4 py-2 text-sm hover:bg-slate-100">
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="hover:text-amber-600 transition-colors text-sm uppercase tracking-widest">
                            Login
                        </Link>
                    )}
                    <Link to="/checkout" className="flex items-center space-x-1 hover:text-amber-600">
                        <CartIcon />
                        <span>({cartItems.length})</span>
                    </Link>
                    <button className="hover:text-amber-600">
                        <SearchIcon />
                    </button>
                </div>

                {/* Hamburger Menu Button (Mobile) */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none z-50 relative">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <div className={`absolute top-0 left-0 w-full bg-[#f2f2f2] border-b border-slate-200 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} pt-24`}>
                <div className="flex flex-col space-y-4 p-6 text-sm uppercase tracking-widest">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600">Home</Link>
                    <Link to="/products" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600">Shop</Link>
                    <Link to="#" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600">About</Link>
                    <Link to="#" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600">Contact</Link>
                    <hr className="border-slate-200" />
                    {userInfo ? (
                        <>
                            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600">My Profile</Link>
                            <Link to="/my-orders" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600">My Orders</Link>
                            {userInfo.role === 'admin' && (
                                <>
                                    <hr className="border-slate-200" />
                                    <Link to="/admin/productlist" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600">Admin Products</Link>
                                </>
                            )}
                            <button onClick={logoutHandler} className="text-left hover:text-amber-600">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
