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
      { path: 'products/:id', element: <ProductDetailPage /> },

      // --- Private Routes (for logged-in users) ---
      {
        path: '',
        element: <PrivateRoute />,
        children: [
          // Add /* to allow nested routes within ProfilePage
          { path: 'profile/*', element: <ProfilePage /> },
        ],
      },

      // --- Admin Routes ---
      {
        path: '/admin',
        element: <AdminRoute />,
        children: [
          { path: 'productlist', element: <AdminProductListPage /> },
          { path: 'product/:id/edit', element: <AdminProductEditPage /> },
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
