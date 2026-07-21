import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { clearCart, fetchUserCart } from '../features/cart/cartSlice';
import { ChevronDown, X, Menu } from "lucide-react"; // Using Lucide for UI icons
import { relyLogo } from '../assets/index';

// Enhanced Icons (Thinner strokes for luxury feel)
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);
const AdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const AnnouncementBar = () => (
    <div className="bg-stone-900 text-amber-50 text-xs text-center py-2 uppercase tracking-widest font-montserrat">
        Free Shipping on Orders Over ₹4999 | World Wide Delivery
    </div>
);

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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

    // Handle scroll effect for sticky navbar shadow
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        <header className="sticky top-0 z-50 font-montserrat">
            <AnnouncementBar />
            
            {/* Main Navbar - Cream Background */}
            <nav className={`bg-[#FDFBF7] text-stone-800 h-24 transition-all duration-300 ${scrolled ? 'shadow-md border-b-0' : 'border-b border-stone-200'}`}>
                <div className="container mx-auto px-6 h-full flex justify-between items-center">
                    
                    {/* Left Side: Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <span className="hidden md:block text-4xl font-marcellus text-stone-900 tracking-tight">
                           Rरिwaaz
                        </span>
                        <img src={relyLogo} alt="RRiwaaz Logo" className="block md:hidden h-12 w-auto object-contain" />
                    </Link>

                    {/* Center: Main Navigation (Desktop) */}
                    <div className="hidden md:flex items-center space-x-10 text-xs font-bold uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-amber-700 transition-colors relative group">
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-amber-700 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link to="/products" className="hover:text-amber-700 transition-colors relative group">
                            Shop
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-amber-700 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link to="/about" className="hover:text-amber-700 transition-colors relative group">
                            Our Story
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-amber-700 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link to="/contact" className="hover:text-amber-700 transition-colors relative group">
                            Contact
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-amber-700 transition-all group-hover:w-full"></span>
                        </Link>
                    </div>

                    {/* Right Side: User Actions (Desktop) */}
                    <div className="hidden md:flex items-center space-x-8">
                        {/* Admin Menu */}
                        {userInfo && userInfo.role === 'admin' && (
                            <div className="relative" ref={adminDropdownRef}>
                                <button onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)} className="flex items-center space-x-1 cursor-pointer hover:text-amber-700 transition-colors text-xs uppercase tracking-wider font-bold">
                                    <AdminIcon />
                                    <span>Admin</span>
                                </button>
                                <div className={`absolute top-full right-0 mt-4 w-48 bg-white rounded-sm shadow-xl py-2 transition-all duration-200 border border-stone-100 z-50 ${isAdminDropdownOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}`}>
                                    <Link to="/admin/productlist" onClick={() => setIsAdminDropdownOpen(false)} className="block px-6 py-3 text-sm hover:bg-stone-50 hover:text-amber-700 transition-colors">Products</Link>
                                    <Link to="/admin/orders" onClick={() => setIsAdminDropdownOpen(false)} className="block px-6 py-3 text-sm hover:bg-stone-50 hover:text-amber-700 transition-colors">Orders</Link>
                                    <Link to="/admin/userlist" onClick={() => setIsAdminDropdownOpen(false)} className="block px-6 py-3 text-sm hover:bg-stone-50 hover:text-amber-700 transition-colors">Users</Link>
                                </div>
                            </div>
                        )}

                        {userInfo ? (
                            <div className="relative" ref={userDropdownRef}>
                                <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex items-center space-x-2 cursor-pointer hover:text-amber-700 transition-colors">
                                    <UserIcon />
                                    <span className="text-xs uppercase tracking-widest font-bold">{userInfo.name.split(' ')[0]}</span>
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`absolute top-full right-0 mt-4 w-52 bg-white rounded-sm shadow-xl py-2 transition-all duration-200 border border-stone-100 z-50 ${isUserDropdownOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}`}>
                                    <div className="px-6 py-3 border-b border-stone-100 mb-2">
                                        <p className="text-xs text-stone-500">Signed in as</p>
                                        <p className="text-sm font-bold truncate">{userInfo.email}</p>
                                    </div>
                                    <Link to="/profile" onClick={() => setIsUserDropdownOpen(false)} className="block px-6 py-3 text-sm hover:bg-stone-50 hover:text-amber-700 transition-colors">My Profile</Link>
                                    <Link to="/my-orders" onClick={() => setIsUserDropdownOpen(false)} className="block px-6 py-3 text-sm hover:bg-stone-50 hover:text-amber-700 transition-colors">My Orders</Link>
                                    <button onClick={logoutHandler} className="w-full text-left block px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="hover:text-amber-700 transition-colors text-xs font-bold uppercase tracking-widest">
                                Login
                            </Link>
                        )}
                        
                        <Link to="/checkout" className="group flex items-center relative hover:text-amber-700 transition-colors">
                            <CartIcon />
                            {cartItems && cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-amber-700 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full group-hover:bg-stone-900 transition-colors">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Hamburger Menu Button (Mobile) */}
                    <div className="md:hidden flex items-center gap-6">
                        <Link to="/checkout" className="relative text-stone-800">
                            <CartIcon />
                            {cartItems && cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-amber-700 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none z-50 relative hover:text-amber-700 transition-colors">
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Panel */}
                <div className={`fixed inset-0 bg-[#FDFBF7] z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-32 px-8 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col space-y-6 text-sm uppercase tracking-widest font-bold text-stone-800">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-700 border-b border-stone-200 pb-2">Home</Link>
                        <Link to="/products" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-700 border-b border-stone-200 pb-2">Shop Collection</Link>
                        <Link to="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-700 border-b border-stone-200 pb-2">Our Story</Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-700 border-b border-stone-200 pb-2">Contact</Link>

                        {userInfo ? (
                            <>
                                <div className="pt-4 text-xs text-stone-400">ACCOUNT</div>
                                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-700 py-2">My Profile</Link>
                                <Link to="/my-orders" onClick={() => setIsMenuOpen(false)} className="hover:text-amber-700 py-2">My Orders</Link>

                                {userInfo.role === 'admin' && (
                                    <div className="bg-stone-100 p-4 rounded-sm mt-4">
                                        <p className="text-xs text-stone-500 mb-3 font-bold">ADMIN PANEL</p>
                                        <Link to="/admin/productlist" onClick={() => setIsMenuOpen(false)} className="block hover:text-amber-700 py-2 text-xs">Manage Products</Link>
                                        <Link to="/admin/orders" onClick={() => setIsMenuOpen(false)} className="block hover:text-amber-700 py-2 text-xs">Manage Orders</Link>
                                        <Link to="/admin/userlist" onClick={() => setIsMenuOpen(false)} className="block hover:text-amber-700 py-2 text-xs">Manage Users</Link>
                                    </div>
                                )}

                                <button onClick={() => { logoutHandler(); setIsMenuOpen(false); }} className="text-left text-red-600 py-4 mt-4 font-bold">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-stone-900 text-white text-center py-4 mt-8 hover:bg-amber-700 transition-colors">
                                Login / Register
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;