import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-amber-400/20 transition-shadow duration-300 group">
      <Link to={`/products/${product._id}`}>
        <div className="overflow-hidden">
          <img 
            src={product.image || 'https://placehold.co/600x400/1e293b/ffffff?text=Product'} 
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 text-white">
          <h3 className="text-lg font-bold truncate">{product.name}</h3>
          <p className="text-amber-400 text-xl font-semibold mt-2">${product.price}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
