import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Ruler, ShoppingBag, MapPin, Heart, Star, Settings as SettingsIcon, 
  Menu, X, Camera, Edit2, LogOut, ChevronRight 
} from 'lucide-react';

import { updateUserProfile } from '../features/auth/authSlice';
import MyMeasurements from '../pages/MyMeasurements';
import MyOrders from '../pages/MyOrdersPage';
import MyAddresses from '../pages/MyAddresses';
import MyWishlist from './MyWishlist';
// import MyReviews from './MyReviews'; // Ensure this is imported correctly if used

// --- Placeholders ---
const Settings = () => (
  <div className="bg-white border border-stone-200 p-8 rounded-sm text-center">
    <SettingsIcon className="mx-auto h-12 w-12 text-stone-300 mb-4" />
    <h3 className="font-marcellus text-xl text-stone-900">Account Settings</h3>
    <p className="text-stone-500 mt-2 text-sm font-light">Manage your password and preferences here.</p>
  </div>
);

const MyReviews = () => (
  <div className="bg-white border border-stone-200 p-8 rounded-sm text-center">
    <Star className="mx-auto h-12 w-12 text-stone-300 mb-4" />
    <h3 className="font-marcellus text-xl text-stone-900">My Reviews</h3>
    <p className="text-stone-500 mt-2 text-sm font-light">See what you've said about your purchases.</p>
  </div>
);

// --- Sub-components ---

const DashboardStats = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="bg-stone-900 text-white p-8 rounded-sm shadow-xl mb-8 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-900/20 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2 block">Welcome Back</span>
          <h1 className="font-marcellus text-3xl md:text-4xl text-white">
            Hello, {userInfo?.name?.split(' ')[0] || 'Guest'}
          </h1>
          <p className="text-stone-400 mt-2 font-light text-sm max-w-lg">
            Manage your personal style profile, track your orders, and update your measurements for the perfect fit.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white/10 backdrop-blur-sm p-4 rounded-sm border border-white/10 text-center min-w-[100px]">
              <p className="text-2xl font-marcellus text-white">0</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-400">Active Orders</p>
           </div>
           <div className="bg-white/10 backdrop-blur-sm p-4 rounded-sm border border-white/10 text-center min-w-[100px]">
              <p className="text-2xl font-marcellus text-white">0</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-400">Wishlist</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const ProfileForm = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(userInfo?.profileImage || null);
  const fileInputRef = useRef(null);

  const [name, setName] = useState(userInfo ? userInfo.name : '');
  const [email, setEmail] = useState(userInfo ? userInfo.email : '');
  const [phone, setPhone] = useState(userInfo?.phone || '');

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ name, email, phone, profileImage }));
    setIsEditing(false);
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-sm p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-6">
        <h2 className="font-marcellus text-2xl text-stone-900">Personal Details</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-amber-700 flex items-center gap-2 transition-colors"
        >
          {isEditing ? <X size={16} /> : <Edit2 size={16} />}
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Image */}
        <div className="flex-shrink-0 relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-stone-100 border-4 border-white shadow-lg">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300 bg-stone-50">
                 <User size={48} />
              </div>
            )}
          </div>
          <button
            onClick={handleImageUpload}
            className="absolute bottom-0 right-0 bg-stone-900 text-white p-2.5 rounded-full hover:bg-amber-700 transition-colors shadow-md border-2 border-white"
            title="Change Photo"
          >
            <Camera size={16} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSave} className="flex-1 w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm text-stone-800 focus:outline-none focus:border-amber-700 focus:bg-white disabled:opacity-60 disabled:bg-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm text-stone-800 focus:outline-none focus:border-amber-700 focus:bg-white disabled:opacity-60 disabled:bg-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                placeholder="+91 00000 00000"
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm text-stone-800 focus:outline-none focus:border-amber-700 focus:bg-white disabled:opacity-60 disabled:bg-transparent transition-all"
              />
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="submit"
                className="bg-stone-900 text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-amber-700 rounded-sm transition-colors shadow-lg"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation Links Configuration
  const navLinks = [
    { path: '/profile/my-profile', label: 'My Profile', icon: User },
    { path: '/profile/measurements', label: 'Measurements', icon: Ruler },
    { path: '/profile/orders', label: 'My Orders', icon: ShoppingBag },
    { path: '/profile/addresses', label: 'Addresses', icon: MapPin },
    { path: '/profile/wishlist', label: 'Wishlist', icon: Heart },
    { path: '/profile/reviews', label: 'My Reviews', icon: Star },
    { path: '/profile/settings', label: 'Settings', icon: SettingsIcon },
  ];

  if (!userInfo) return null; // Or redirect to login

  const isActive = (path) => {
      if (path === '/profile/my-profile' && location.pathname === '/profile') return true;
      return location.pathname === path;
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen font-montserrat text-stone-800">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Dashboard Header */}
        <DashboardStats />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* --- Sidebar Navigation --- */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden mb-6">
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-full flex items-center justify-between bg-white border border-stone-200 p-4 rounded-sm shadow-sm"
                >
                    <span className="font-bold text-stone-900 uppercase tracking-wide text-xs flex items-center gap-2">
                        <Menu size={16} /> Menu
                    </span>
                    <ChevronRight size={16} className={`transform transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`} />
                </button>
            </div>

            {/* Nav Menu */}
            <nav className={`bg-white border border-stone-200 rounded-sm overflow-hidden shadow-sm lg:block ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                <div className="p-4 border-b border-stone-100 bg-stone-50/50 hidden lg:block">
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Navigation</span>
                </div>
                <ul className="flex flex-col">
                    {navLinks.map((link) => {
                        const active = isActive(link.path);
                        return (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all border-l-4 ${
                                        active 
                                            ? 'border-amber-700 bg-amber-50/10 text-amber-900' 
                                            : 'border-transparent text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                                    }`}
                                >
                                    <link.icon size={18} strokeWidth={active ? 2 : 1.5} />
                                    {link.label}
                                </Link>
                            </li>
                        );
                    })}
                    <li className="mt-4 border-t border-stone-100 pt-2 pb-2">
                        <button className="w-full flex items-center gap-3 px-6 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left">
                            <LogOut size={18} /> Sign Out
                        </button>
                    </li>
                </ul>
            </nav>
          </aside>

          {/* --- Main Content Area --- */}
          <main className="flex-1 w-full min-w-0">
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <Routes>
                        <Route index element={<ProfileForm />} />
                        <Route path="my-profile" element={<ProfileForm />} />
                        <Route path="measurements" element={<MyMeasurements />} />
                        <Route path="orders" element={<MyOrders />} />
                        <Route path="addresses" element={<MyAddresses />} />
                        <Route path="wishlist" element={<MyWishlist />} />
                        <Route path="reviews" element={<MyReviews />} />
                        <Route path="settings" element={<Settings />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;