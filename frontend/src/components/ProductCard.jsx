import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 ease-in-out group relative">
      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden h-[28rem]">
          <img 
            src={product.imageUrl || 'https://placehold.co/600x800/f2f2f2/334155?text=Rely+Tailors'} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-500 flex items-center justify-center">
              <div className="flex items-center space-x-4 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <button className="bg-white text-slate-900 font-bold py-3 px-6 rounded-md text-sm uppercase tracking-wider hover:bg-slate-200 transition-colors">
                      Add to Cart
                  </button>
                  <button 
                    onClick={(e) => {
                        e.preventDefault(); // Prevent navigation when clicking the button
                        setIsFavorited(!isFavorited);
                    }}
                    className="bg-white/80 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                    </svg>
                  </button>
              </div>
          </div>
        </div>
      </Link>
      
      <div className="p-6 text-center">
        <h3 className="font-marcellus text-2xl text-slate-900 truncate">{product.name}</h3>
        <p className="text-sm text-slate-500 mt-2">{product.description}</p>
        <p className="text-slate-800 text-xl font-semibold mt-4">${product.basePrice}</p>
      </div>
    </div>
  );
};

export default ProductCard;
