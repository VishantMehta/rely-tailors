import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { clearCart, fetchUserCart } from '../features/cart/cartSlice';
import { ChevronDown } from "lucide-react";
import relyLogo from '../assets/rely.png'; // Import your logo image

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
    const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const adminDropdownRef = useRef(null);
    const userDropdownRef = useRef(null);

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchUserCart());
        }
    }, [dispatch, userInfo]);

    // Close dropdowns if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
                setIsAdminDropdownOpen(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const logoutHandler = () => {
        dispatch(logout());
        dispatch(clearCart());
        setIsMenuOpen(false);
        setIsUserDropdownOpen(false);
        navigate('/login');
    };

    return (
        <nav className="bg-[#f2f2f2] text-slate-800 h-24 font-montserrat border-b border-slate-200 relative z-50">
            <div className="container mx-auto px-6 h-full flex justify-between items-center">
                {/* Left Side: Logo */}
                <Link to="/">
                    <span className="hidden md:block text-3xl font-marcellus tracking-wider">RELY TAILORS</span>
                    <img src={relyLogo} alt="Rely Tailors Logo" className="block md:hidden h-20 w-auto"/>
                </Link>

                {/* Center: Main Navigation (Desktop) */}
                <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest">
                    <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
                    <Link to="/products" className="hover:text-amber-600 transition-colors">Shop</Link>
                    <Link to="/about" className="hover:text-amber-600 transition-colors">About</Link>
                    <Link to="/contact" className="hover:text-amber-600 transition-colors">Contact</Link>
                </div>

                {/* Right Side: User Actions (Desktop) */}
                <div className="hidden md:flex items-center space-x-6">
                    {/* Admin Menu */}
                    {userInfo && userInfo.role === 'admin' && (
                        <div className="relative" ref={adminDropdownRef}>
                            <button onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)} className="flex items-center space-x-2 cursor-pointer hover:text-amber-600">
                                <AdminIcon />
                                <span>Admin</span>
                                <ChevronDown size={16} className={`transition-transform duration-200 ${isAdminDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 transition-all duration-300 border border-slate-200 z-50 ${isAdminDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                                <Link to="/admin/productlist" onClick={() => setIsAdminDropdownOpen(false)} className="block px-4 py-2 text-sm hover:bg-slate-100">Products</Link>
                                <Link to="/admin/orders" onClick={() => setIsAdminDropdownOpen(false)} className="block px-4 py-2 text-sm hover:bg-slate-100">Orders</Link>
                                <Link to="/admin/userlist" onClick={() => setIsAdminDropdownOpen(false)} className="block px-4 py-2 text-sm hover:bg-slate-100">Users</Link>
                            </div>
                        </div>
                    )}

                    {userInfo ? (
                        <div className="relative" ref={userDropdownRef}>
                            <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex items-center space-x-2 cursor-pointer hover:text-amber-600">
                                <UserIcon />
                                <span>{userInfo.name.split(' ')[0]}</span>
                                <ChevronDown size={16} className={`transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 transition-all duration-300 border border-slate-200 z-50 ${isUserDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                                <Link to="/profile" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm hover:bg-slate-100">My Profile</Link>
                                <Link to="/my-orders" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm hover:bg-slate-100">My Orders</Link>
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
                        <span>({cartItems ? cartItems.length : 0})</span>
                    </Link>
                    <button className="hover:text-amber-600">
                        <SearchIcon />
                    </button>
                </div>

                {/* Hamburger Menu Button (Mobile) */}
                <div className="md:hidden flex items-center gap-4">
                     <Link to="/checkout" className="flex items-center space-x-1 hover:text-amber-600">
                        <CartIcon />
                        <span>({cartItems ? cartItems.length : 0})</span>
                    </Link>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none z-50 relative">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <div className={`absolute top-0 left-0 w-full bg-[#f2f2f2] border-b border-slate-200 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} h-screen`}>
                <div className="flex flex-col space-y-4 p-6 text-sm uppercase tracking-widest">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600 py-2">Home</Link>
                    <Link to="/products" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600 py-2">Shop</Link>
                    <Link to="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600 py-2">About</Link>
                    <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600 py-2">Contact</Link>
                    
                    <hr className="border-slate-200" />
                    
                    {userInfo ? (
                        <>
                            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600 py-2">My Profile</Link>
                            <Link to="/my-orders" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600 py-2">My Orders</Link>
                            
                            {userInfo.role === 'admin' && (
                                <>
                                    <hr className="border-slate-200" />
                                    <div className="pl-4 border-l-2 border-amber-600">
                                        <p className="text-xs text-gray-500 mb-2">ADMIN</p>
                                        <Link to="/admin/productlist" onClick={() => setIsMenuOpen(false)} className="block hover:text-amber-600 py-2">Products</Link>
                                        <Link to="/admin/orders" onClick={() => setIsMenuOpen(false)} className="block hover:text-amber-600 py-2">Orders</Link>
                                        <Link to="/admin/userlist" onClick={() => setIsMenuOpen(false)} className="block hover:text-amber-600 py-2">Users</Link>
                                    </div>
                                </>
                            )}
                            
                            <button onClick={() => { logoutHandler(); setIsMenuOpen(false); }} className="text-left hover:text-amber-600 py-2">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-600 py-2">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

