import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './index.css';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/Admroute';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminProductListPage from './pages/AdminProductListPage';
import AdminProductEditPage from './pages/AdminProductEditPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminOrderListPage from './pages/AdminOrderListPage';
import AboutPage from './pages/AboutPage';
import AdminUserListPage from './pages/AdminUserListPage';
import ContactPage from './pages/ContactPage';
import MyAddresses from './pages/MyAddresses';
import MyWishlist from './pages/MyWishlist'; // Add this import

// Error Boundary wrapper for routes
const ErrorBoundaryWrapper = ({ children }) => (
  <ErrorBoundary>{children}</ErrorBoundary>
);

// Define your routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-red-500 mb-6">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
            <a href="/" className="bg-slate-900 text-white py-3 px-6 rounded-lg hover:bg-slate-800 transition-colors font-medium">
              Go Home
            </a>
          </div>
        </div>
      </ErrorBoundary>
    ),
    children: [
      // --- Public Routes ---
      { index: true, element: <ErrorBoundaryWrapper><HomePage /></ErrorBoundaryWrapper> },
      { path: 'login', element: <ErrorBoundaryWrapper><LoginPage /></ErrorBoundaryWrapper> },
      { path: 'register', element: <ErrorBoundaryWrapper><RegisterPage /></ErrorBoundaryWrapper> },
      { path: 'products', element: <ErrorBoundaryWrapper><ProductsPage /></ErrorBoundaryWrapper> },
      { path: 'products/category/:categoryName', element: <ErrorBoundaryWrapper><ProductsPage /></ErrorBoundaryWrapper> },
      { path: 'products/:id', element: <ErrorBoundaryWrapper><ProductDetailPage /></ErrorBoundaryWrapper> },
      { path: 'about', element: <ErrorBoundaryWrapper><AboutPage /></ErrorBoundaryWrapper> },
      { path: 'contact', element: <ErrorBoundaryWrapper><ContactPage /></ErrorBoundaryWrapper> },

      // --- Private Routes (for logged-in users) ---
      {
        path: '',
        element: <PrivateRoute />,
        children: [
          { path: 'profile/*', element: <ErrorBoundaryWrapper><ProfilePage /></ErrorBoundaryWrapper> },
          { path: 'checkout', element: <ErrorBoundaryWrapper><CheckoutPage /></ErrorBoundaryWrapper> },
          { path: 'my-orders', element: <ErrorBoundaryWrapper><MyOrdersPage /></ErrorBoundaryWrapper> },
          { path: 'orders/:id', element: <ErrorBoundaryWrapper><OrderDetailPage /></ErrorBoundaryWrapper> },
          { path: 'my-addresses', element: <ErrorBoundaryWrapper><MyAddresses /></ErrorBoundaryWrapper> },
          { path: 'wishlist', element: <ErrorBoundaryWrapper><MyWishlist /></ErrorBoundaryWrapper> }, // Add wishlist route
        ],
      },

      // --- Admin Routes ---
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          { path: 'productlist', element: <ErrorBoundaryWrapper><AdminProductListPage /></ErrorBoundaryWrapper> },
          { path: 'product/:id/edit', element: <ErrorBoundaryWrapper><AdminProductEditPage /></ErrorBoundaryWrapper> },
          { path: 'orders', element: <ErrorBoundaryWrapper><AdminOrderListPage /></ErrorBoundaryWrapper> },
          { path: 'userlist', element: <ErrorBoundaryWrapper><AdminUserListPage /></ErrorBoundaryWrapper> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);