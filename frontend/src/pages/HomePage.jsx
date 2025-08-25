import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mensuitImage, blazerImage, kurtaImage, poloImage, indowesternImage, shirt } from '../assets';

// Mock data for the category carousel
const categories = [
  {
    _id: '1',
    name: 'Suits',
    image: mensuitImage,
    description: 'Perfectly tailored suits for the modern gentleman. Custom-fit for any occasion.',
  },
  {
    _id: '2',
    name: 'Blazers',
    image: blazerImage,
    description: 'Versatile blazers that combine classic style with contemporary design.',
  },
  {
    _id: '3',
    name: 'Kurtas',
    image: kurtaImage,
    description: 'Elegant and comfortable kurtas, crafted from the finest fabrics for a regal look.',
  },
  {
    _id: '4',
    name: 'Polo T-Shirts',
    image: poloImage,
    description: 'Premium polo t-shirts that offer a perfect blend of comfort and casual style.',
  },
   {
    _id: '5',
    name: 'Indo Western',
    image: indowesternImage,
    description: 'A fusion of traditional and modern styles for a unique and sophisticated look.',
  },
  {
    _id: '6',
    name: 'Shirts',
    image: shirt,
    description: 'Crisp, custom-fitted shirts designed for unparalleled comfort and elegance.',
  },
];

const HomePage = () => {
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (!isPaused && scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        
        // If scrolled to the end, smoothly go back to the start
        if (scrollLeft + clientWidth >= scrollWidth - 1) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Otherwise, scroll by the width of one card + gap
          scrollContainerRef.current.scrollBy({ left: 320 + 48, behavior: 'smooth' });
        }
      }
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(scrollInterval);
  }, [isPaused]);


  return (
    <div className="bg-[#f2f2f2] text-slate-800 font-montserrat py-16 px-4">
      <div className="container mx-auto text-center">
        <h1 className="font-marcellus text-6xl md:text-7xl mb-4 text-slate-900">Rely Tailors</h1>
        <p className="max-w-2xl mx-auto text-slate-600">
          With over 35 years of masterful craftsmanship, we create more than just suits; we tailor experiences. Each stitch is a testament to our legacy of quality and precision, ensuring you look and feel exceptional.
        </p>

        {/* Category Image Carousel */}
        <div className="relative mt-16">
           <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/50 hover:bg-white rounded-full p-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
           </button>
          <div 
            ref={scrollContainerRef} 
            className="flex space-x-12 overflow-x-auto pb-4 horizontal-scrollbar px-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {categories.map((category) => (
              <div key={category._id} className="group flex-shrink-0 w-80 text-left">
                <Link to={`/products/category/${category.name.toLowerCase().replace(' ', '-')}`}>
                  <div className="overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-[32rem] object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                  </div>
                  <h3 className="font-marcellus text-2xl mt-4 text-slate-900">{category.name}</h3>
                  <p className="text-sm text-slate-500 mt-2 h-10">{category.description}</p>
                  <div className="inline-flex items-center mt-4 text-xs font-bold tracking-widest uppercase text-slate-700 group-hover:text-amber-600 transition-colors">
                    <span>Discover Now</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </Link>
              </div>
            ))}
          </div>
           <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/50 hover:bg-white rounded-full p-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
           </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
