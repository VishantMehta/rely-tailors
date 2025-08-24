import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mx-auto text-center py-20">
      <h1 className="text-5xl font-extrabold text-gray-800">
        Custom Tailoring, Redefined
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Perfectly fitted clothing, crafted just for you.
      </p>
      <div className="mt-8">
        <Link
          to="/products"
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Explore Our Collections
        </Link>
      </div>
    </div>
  );
};

export default HomePage;