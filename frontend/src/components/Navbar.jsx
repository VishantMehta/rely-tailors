import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">RelyTailors</Link>
        <div className="flex gap-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/products" className="hover:text-gray-300">Products</Link>
          <Link to="/login" className="hover:text-gray-300">Login</Link>
          <Link to="/register" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;