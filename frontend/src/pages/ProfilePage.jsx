import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { updateUserProfile } from '../features/auth/authSlice';
import MyMeasurements from '../pages/MyMeasurements';
import MyOrders from '../pages/MyOrdersPage';
import MyAddresses from '../pages/MyAddresses';
import MyWishlist from './MyWishlist';
import MyReviews from './MyReviews';

// --- Enhanced Background with SVG Effects ---
const BackgroundPattern = () => (
  <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
    <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <circle cx="10%" cy="20%" r="100" fill="url(#gradient)" opacity="0.3" />
      <circle cx="90%" cy="80%" r="150" fill="url(#gradient)" opacity="0.2" />
      <circle cx="70%" cy="30%" r="80" fill="url(#gradient)" opacity="0.25" />
    </svg>
  </div>
);

// --- Dashboard Components ---
const DashboardStats = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="font-marcellus text-2xl md:text-3xl text-slate-900">Your Tailoring Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Welcome back, <span className="font-semibold text-slate-900">{userInfo?.name || 'Valued Customer'}</span>! Your custom garments are in expert hands.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-md">
            Premium Fabrics Available
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm">Active Orders</p>
              <p className="font-marcellus text-2xl text-slate-900 mt-1">3</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm">Completed Garments</p>
              <p className="font-marcellus text-2xl text-slate-900 mt-1">12</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl border border-amber-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm">Upcoming Fittings</p>
              <p className="font-marcellus text-2xl text-slate-900 mt-1">2</p>
            </div>
            <div className="bg-amber-500 p-3 rounded-lg shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm">Tailoring Credits</p>
              <p className="font-marcellus text-2xl text-slate-900 mt-1">450</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CurrentProjects = () => {
  const projects = [
    {
      id: 1,
      name: 'Custom Suit',
      tailor: 'Master Tailor James',
      status: 'In Progress',
      deadline: '2023-08-23',
      progress: 75
    },
    {
      id: 2,
      name: 'Evening Gown',
      tailor: 'Designer Elena',
      status: 'Fitting Scheduled',
      deadline: '2024-04-11',
      progress: 40
    },
    {
      id: 3,
      name: 'Business Shirts',
      tailor: 'Expert Stitcher Maria',
      status: 'Fabric Selected',
      deadline: '2024-02-10',
      progress: 60
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Fitting Scheduled': return 'bg-amber-100 text-amber-800';
      case 'Fabric Selected': return 'bg-indigo-100 text-indigo-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="font-marcellus text-xl text-slate-900">Your Garments in Progress</h2>
        <Link to="/profile/orders" className="text-slate-700 hover:text-slate-900 text-sm font-medium flex items-center">
          View All Orders
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-slate-600 font-medium text-sm">GARMENT</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium text-sm">TAILOR</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium text-sm">STATUS</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium text-sm">EST. COMPLETION</th>
              <th className="text-left py-3 px-4 text-slate-600 font-medium text-sm">PROGRESS</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-medium text-slate-900">{project.name}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-slate-600">{project.tailor}</div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="text-slate-600">{project.deadline}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-gradient-to-r from-slate-900 to-slate-700 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-600">{project.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RecentActivity = () => {
  const activities = [
    { time: 'Yesterday', action: 'Fabric approved for your Evening Gown', icon: '🎯' },
    { time: '2 days ago', action: 'First fitting completed for Custom Suit', icon: '📦' },
    { time: '1 week ago', action: 'Design consultation scheduled for new project', icon: '📅' },
    { time: '2 weeks ago', action: 'Measurement session completed successfully', icon: '📏' }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20">
      <h2 className="font-marcellus text-xl text-slate-900 mb-6">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex group">
            <div className="flex-shrink-0 mr-4 relative">
              <div className="h-3 w-3 bg-slate-900 rounded-full mt-2 group-hover:scale-125 transition-transform"></div>
              {index !== activities.length - 1 && (
                <div className="absolute left-1.5 top-5 h-8 w-0.5 bg-slate-200"></div>
              )}
            </div>
            <div className="flex-1 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0 group-hover:translate-x-1 transition-transform">
              <div className="flex items-start">
                <span className="text-lg mr-3">{activity.icon}</span>
                <div>
                  <p className="text-slate-900 font-medium">{activity.action}</p>
                  <p className="text-slate-500 text-sm mt-1">{activity.time}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuickActions = () => {
  const actions = [
    { icon: '📅', title: 'Schedule Fitting', link: '/appointments', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: '👔', title: 'Start New Order', link: '/products', color: 'bg-green-500 hover:bg-green-600' },
    { icon: '📏', title: 'Update Measurements', link: '/profile/measurements', color: 'bg-amber-500 hover:bg-amber-600' },
    { icon: '💬', title: 'Message Tailor', link: '/contact', color: 'bg-purple-500 hover:bg-purple-600' }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20">
      <h2 className="font-marcellus text-xl text-slate-900 mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`flex flex-col items-center justify-center p-4 rounded-xl text-white ${action.color} transition-all transform hover:scale-105 shadow-md`}
          >
            <span className="text-2xl mb-2">{action.icon}</span>
            <span className="text-sm font-medium text-center">{action.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  return (
    <div className="space-y-6">
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CurrentProjects />
        </div>
        
        <div className="space-y-6">
          <RecentActivity />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

// --- Placeholder Components for Sidebar Navigation ---
const Settings = () => <div className="text-center p-10 bg-white rounded-lg shadow-md"><h2 className="font-marcellus text-2xl">Settings</h2><p className="text-slate-500 mt-2">This section is under construction.</p></div>;

// --- Sidebar Icon Components ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const RulerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>;
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const AddressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const WishlistIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const ReviewsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.28 9.421c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>;

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
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover shadow-md"
            />
            <button
              onClick={handleImageUpload}
              className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full hover:bg-slate-700 transition-colors shadow-md"
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
            <h1 className="font-marcellus text-2xl sm:text-3xl text-slate-900">{name}</h1>
            <p className="text-slate-500">{email}</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="mt-4 sm:mt-0 bg-slate-900 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-800 transition-colors shadow-md"
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
              className="w-full p-3 border border-slate-300 rounded-md disabled:bg-slate-100 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
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
              className="w-full p-3 border border-slate-300 rounded-md disabled:bg-slate-100 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
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
              className="w-full p-3 border border-slate-300 rounded-md disabled:bg-slate-100 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 text-right">
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-2 px-6 rounded-md hover:from-amber-600 hover:to-amber-700 transition-colors shadow-md"
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!userInfo) {
    return null;
  }

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "flex items-center gap-3 p-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-900 rounded-md font-bold shadow-sm"
      : "flex items-center gap-3 p-3 hover:bg-slate-100 rounded-md transition-colors";
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen font-montserrat relative">
      <BackgroundPattern />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-md w-full flex items-center justify-between"
          >
            <span className="font-medium">Dashboard Menu</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* --- Left Sidebar --- */}
          <aside className={`md:w-1/4 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`} data-aos="fade-right">
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20">
              <h2 className="font-marcellus text-xl md:text-2xl text-slate-900 mb-6">RELY TAILORS</h2>
              <nav className="space-y-2">
                <Link to="/profile" className={getLinkClass("/profile")} onClick={() => setIsMobileMenuOpen(false)}>
                  <DashboardIcon /> Overview
                </Link>
                <Link to="/profile/my-profile" className={getLinkClass("/profile/my-profile")} onClick={() => setIsMobileMenuOpen(false)}>
                  <UserIcon /> My Profile
                </Link>
                <Link to="/profile/measurements" className={getLinkClass("/profile/measurements")} onClick={() => setIsMobileMenuOpen(false)}>
                  <RulerIcon /> My Measurements
                </Link>
                <Link to="/profile/orders" className={getLinkClass("/profile/orders")} onClick={() => setIsMobileMenuOpen(false)}>
                  <OrdersIcon /> My Orders
                </Link>
                <Link to="/profile/addresses" className={getLinkClass("/profile/addresses")} onClick={() => setIsMobileMenuOpen(false)}>
                  <AddressIcon /> My Addresses
                </Link>
                <Link to="/profile/wishlist" className={getLinkClass("/profile/wishlist")} onClick={() => setIsMobileMenuOpen(false)}>
                  <WishlistIcon /> My Wishlist
                </Link>
                <Link to="/profile/reviews" className={getLinkClass("/profile/reviews")} onClick={() => setIsMobileMenuOpen(false)}>
                  <ReviewsIcon /> My Reviews
                </Link>
                <Link to="/profile/settings" className={getLinkClass("/profile/settings")} onClick={() => setIsMobileMenuOpen(false)}>
                  <SettingsIcon /> Settings
                </Link>
              </nav>
            </div>
          </aside>

          {/* --- Main Content --- */}
          <main className="flex-1" data-aos="fade-up">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="my-profile" element={<ProfileForm />} />
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