import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { updateUserProfile } from '../features/auth/authSlice'; // Import the new action

// --- Placeholder Components for Sidebar Navigation ---
// You should create these as new files in your pages folder.
const MyMeasurements = () => <div className="text-center p-10 bg-white rounded-lg shadow-md"><h2 className="font-marcellus text-2xl">My Measurements</h2><p className="text-slate-500 mt-2">This section is under construction.</p></div>;
const MyOrders = () => <div className="text-center p-10 bg-white rounded-lg shadow-md"><h2 className="font-marcellus text-2xl">My Orders</h2><p className="text-slate-500 mt-2">This section is under construction.</p></div>;
const MyAddresses = () => <div className="text-center p-10 bg-white rounded-lg shadow-md"><h2 className="font-marcellus text-2xl">My Addresses</h2><p className="text-slate-500 mt-2">This section is under construction.</p></div>;
const MyWishlist = () => <div className="text-center p-10 bg-white rounded-lg shadow-md"><h2 className="font-marcellus text-2xl">My Wishlist</h2><p className="text-slate-500 mt-2">This section is under construction.</p></div>;
const MyReviews = () => <div className="text-center p-10 bg-white rounded-lg shadow-md"><h2 className="font-marcellus text-2xl">My Reviews</h2><p className="text-slate-500 mt-2">This section is under construction.</p></div>;
const Settings = () => <div className="text-center p-10 bg-white rounded-lg shadow-md"><h2 className="font-marcellus text-2xl">Settings</h2><p className="text-slate-500 mt-2">This section is under construction.</p></div>;

// --- Background Cubes Component ---
const BackgroundCubes = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
        <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    </div>
);

// --- Sidebar Icon Components ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const RulerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>;
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const AddressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const WishlistIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const ReviewsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.28 9.421c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;


const ProfileForm = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(userInfo?.profileImage || 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1887&auto=format&fit=crop');
  const fileInputRef = useRef(null);

  // Form state now initializes from Redux store
  const [name, setName] = useState(userInfo ? userInfo.name : '');
  const [email, setEmail] = useState(userInfo ? userInfo.email : '');
  const [phone, setPhone] = useState(userInfo?.phone || '+1 123 456 7890');
  
  const handleSave = (e) => {
    e.preventDefault();
    // Dispatch the update action with the new data
    dispatch(updateUserProfile({ name, email, phone, profileImage }));
    setIsEditing(false);
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Use FileReader to convert image to base64 string for persistence
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow-lg border border-white/20">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-20 h-20 rounded-full object-cover"
            />
            <button 
              onClick={handleImageUpload}
              className="absolute bottom-0 right-0 bg-slate-900 text-white p-1 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="Upload profile picture"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              className="hidden" 
              accept="image/*"
            />
          </div>
          <div>
            <h1 className="font-marcellus text-3xl text-slate-900">{name}</h1>
            <p className="text-slate-500">{email}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className="mt-4 sm:mt-0 bg-slate-900 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-800 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-bold text-slate-600 mb-2">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border border-slate-300 rounded-md disabled:bg-slate-100"
            />
          </div>
           <div>
            <label htmlFor="email" className="block text-sm font-bold text-slate-600 mb-2">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border border-slate-300 rounded-md disabled:bg-slate-100"
            />
          </div>
           <div>
            <label htmlFor="phone" className="block text-sm font-bold text-slate-600 mb-2">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border border-slate-300 rounded-md disabled:bg-slate-100"
            />
          </div>
        </div>
        
        {isEditing && (
          <div className="mt-8 text-right">
            <button 
              type="submit" 
              className="bg-amber-500 text-slate-900 font-bold py-2 px-6 rounded-md hover:bg-amber-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};


const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!userInfo) {
    return null; // Or a loading spinner
  }

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "flex items-center gap-3 p-3 bg-slate-100 text-slate-900 rounded-md font-bold"
      : "flex items-center gap-3 p-3 hover:bg-slate-100 rounded-md transition-colors";
  };

  return (
    <div className="bg-[#f2f2f2] min-h-screen font-montserrat relative">
      <BackgroundCubes />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* --- Left Sidebar --- */}
          <aside className="md:w-1/4" data-aos="fade-right">
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white/20">
              <h2 className="font-marcellus text-2xl mb-6">Dashboard</h2>
              <nav className="space-y-2">
                <Link to="/profile" className={getLinkClass("/profile")}>
                  <UserIcon /> My Profile
                </Link>
                <Link to="/profile/measurements" className={getLinkClass("/profile/measurements")}>
                  <RulerIcon /> My Measurements
                </Link>
                <Link to="/profile/orders" className={getLinkClass("/profile/orders")}>
                  <OrdersIcon /> My Orders
                </Link>
                <Link to="/profile/addresses" className={getLinkClass("/profile/addresses")}>
                  <AddressIcon /> My Addresses
                </Link>
                <Link to="/profile/wishlist" className={getLinkClass("/profile/wishlist")}>
                  <WishlistIcon /> My Wishlist
                </Link>
                <Link to="/profile/reviews" className={getLinkClass("/profile/reviews")}>
                  <ReviewsIcon /> My Reviews
                </Link>
                <Link to="/profile/settings" className={getLinkClass("/profile/settings")}>
                  <SettingsIcon /> Settings
                </Link>
              </nav>
            </div>
          </aside>

          {/* --- Main Content --- */}
          <main className="flex-1" data-aos="fade-up">
            <Routes>
                <Route index element={<ProfileForm />} />
                <Route path="measurements" element={<MyMeasurements />} />
                <Route path="orders" element={<MyOrders />} />
                <Route path="addresses" element={<MyAddresses />} />
                <Route path="wishlist" element={<MyWishlist />} />
                <Route path="reviews" element={<MyReviews />} />
                <Route path="settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
