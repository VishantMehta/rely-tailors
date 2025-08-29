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

// Define your routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // --- Public Routes ---
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'products', element: <ProductsPage /> },
      // ADD THIS ROUTE
      { path: 'products/category/:categoryName', element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },

      // --- Private Routes (for logged-in users) ---
      {
        path: '',
        element: <PrivateRoute />,
        children: [
          { path: 'profile/*', element: <ProfilePage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'my-orders', element: <MyOrdersPage /> },
          { path: 'orders/:id', element: <OrderDetailPage /> },
        ],
      },

      // --- Admin Routes ---
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          { path: 'productlist', element: <AdminProductListPage /> },
          { path: 'product/:id/edit', element: <AdminProductEditPage /> },
          { path: 'orders', element: <AdminOrderListPage /> },
          { path: 'userlist', element: <AdminUserListPage /> },
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