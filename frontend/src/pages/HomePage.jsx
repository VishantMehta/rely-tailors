import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Keeping your original asset imports
import { mensuitImage, blazerImage, kurtaImage, poloImage, indowesternImage, shirt, wedding, formal, linen, cashmere, nehru, linensuit, shirts, polot, insta1, insta2, insta3, insta4, rely, tabish1 } from '../assets/index';
import weddingVideo from '../assets/weddingVideo.mp4';
import kurtiImage from '../assets/kurti.jpeg';
import lehngaImage from '../assets/lehnga.jpeg';
import sareeImage from '../assets/saree.jpeg';
import dupattaImage from '../assets/dupatta.jpeg'; 
import suitImage from '../assets/suit.jpeg';
import suit from '../assets/1.jpeg';
import kurti from '../assets/2.jpeg';
import lehnga from '../assets/3.jpeg';
import banarasi from '../assets/banarasi.jpeg';
import desi from '../assets/desi.jpeg';
import sareee from '../assets/sareee.jpeg';
import lehngaaa from '../assets/lehngaaa.jpeg';
import kurtii from '../assets/kurtii.jpeg';
import home from '../assets/home.jpeg';

// Data Arrays (Kept mostly same, added sale tags logic if needed later)
const categories = [
  { _id: '1', name: 'Kurti', image: home, description: 'Chic, comfortable styles designed for your everyday elegance.' },
  { _id: '2', name: 'Lehnga', image: lehngaImage, description: 'Regal silhouettes and intricate embroidery for your grandest moments.' },
  { _id: '3', name: 'Saree', image: sareeImage, description: 'Six yards of timeless grace blending heritage with modern style.' },
  // { _id: '4', name: 'Dupatta', image: dupattaImage, description: 'Exquisite drapes to add a luxurious finish to any ensemble.' },
  { _id: '5', name: 'Suit', image: suitImage, description: 'Beautifully tailored suits that perfectly balance tradition and trend.' },
];

const gridItems = [
  { _id: '1', title: 'Royal Lehengas', image: suit, link: '/products/category/Lehengas' },
  { _id: '2', title: 'Silk Sarees', image: kurti, link: '/products/category/Sarees' },
  { _id: '3', title: 'Designer Kurtis', image: lehnga, link: '/products/category/Kurtis' }
];

const newArrivals = [
  { _id: '68b15e83966360f5b90c2936', name: 'Royal Velvet Lehenga', price: '8500.00', image: lehngaaa },
  { _id: '68b17de7843fba334ca746db', name: 'Banarasi Silk Saree', price: '4500.00', image: banarasi },
  { _id: '68b17e15843fba334ca74730', name: 'Chikankari Kurti Set', price: '1800.00', image: kurtii },
  { _id: '68b17e5d843fba334ca74778', name: 'Embroidered Anarkali', price: '6200.00', image: sareee },
  { _id: '68b17e62843fba334ca747be', name: 'Phulkari Heavy Dupatta', price: '950.00', image: dupattaImage },
  { _id: '68b17e65843fba334ca74804', name: 'Floral Organza Saree', price: '4500.00', image: desi },
];

const testimonials = [
  { quote: "The velvet Lehenga I bought for my sister's wedding was stunning. The embroidery detailing is unmatched!", author: "Ayesha Khan" },
  { quote: "I've never worn a Saree that drapes so effortlessly. The silk quality is pure luxury.", author: "Priya Sharma" },
  { quote: "Finally found a brand that understands ethnic chic. My Anarkali suit fits like a dream.", author: "Zara Malik" },
  { quote: "The bridal collection at R Rivaaz is breathtaking. My wedding outfit was everything I imagined.", author: "Sneha Reddy" },
  { quote: "Ordered a casual Kurti set for office wear. It's so comfortable yet stylish enough for evening outings.", author: "Fatima Siddiqui" },
];

const instagramPosts = [
  { _id: '1', image: insta1 },
  { _id: '2', image: insta2 },
  { _id: '3', image: insta3 },
  { _id: '4', image: insta4 },
  { _id: '5', image: 'https://images.unsplash.com/photo-1521341057461-6eb5f40b07ab?q=80&w=1887&auto=format&fit=crop' },
  { _id: '6', image: tabish1 },
];

// Components
const TestimonialCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    customPaging: i => (
      <div className="w-2 h-2 mx-1 rounded-full bg-stone-300 hover:bg-amber-700 transition-colors"></div>
    )
  };

  return (
    <section className="bg-[#fcf8f5] py-20 px-6 border-t border-b border-stone-100">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-xs font-bold tracking-[0.3em] text-amber-700 mb-10 uppercase">
          Love Notes from our Clients
        </h2>
        <Slider {...settings}>
          {testimonials.map((item, index) => (
            <div key={index} className="px-4 pb-8">
              <div className="text-4xl text-amber-800/20 mb-4 font-serif">“</div>
              <p className="text-xl md:text-3xl text-stone-700 font-marcellus leading-relaxed mb-8">
                {item.quote}
              </p>
              <div className="h-[1px] w-12 bg-amber-700 mx-auto mb-4"></div>
              <p className="text-sm font-semibold text-stone-900 uppercase tracking-wider">
                {item.author}
              </p>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

// Replaced Techy Cubes with a Soft Gradient for a "Women's Store" Vibe
const GoldenGlowBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-100/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
  </div>
);

// Styled Icons
const FeatureIconWrapper = ({ children, title, desc }) => (
  <div data-aos="fade-up" className="group p-6 rounded-lg hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-stone-100">
    <div className="text-stone-800 group-hover:text-amber-700 transition-colors duration-300 mb-6 flex justify-center transform group-hover:scale-110">
      {children}
    </div>
    <h3 className="font-marcellus text-xl text-stone-900 mb-3">{title}</h3>
    <p className="text-sm text-stone-500 font-light leading-relaxed">{desc}</p>
  </div>
);

const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const RulerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 8h16M4 16h16" /></svg>;
const ScissorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879a1 1 0 01-1.414 0L2 12m12.121-5.879L19 19" /></svg>;
const FabricIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;

const HomePage = () => {
  const categoryScrollRef = useRef(null);
  const arrivalsScrollRef = useRef(null);
  const [isCategoryPaused, setCategoryPaused] = useState(false);
  const [isArrivalsPaused, setArrivalsPaused] = useState(false);

  // Reusing your existing scroll logic
  const handleScroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = ref.current.offsetWidth * 0.8;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (!isCategoryPaused && categoryScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 1) {
          categoryScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          categoryScrollRef.current.scrollBy({ left: 320 + 48, behavior: 'smooth' });
        }
      }
    }, 4000); // Slowed down slightly for elegance
    return () => clearInterval(scrollInterval);
  }, [isCategoryPaused]);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (!isArrivalsPaused && arrivalsScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = arrivalsScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 1) {
          arrivalsScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          arrivalsScrollRef.current.scrollBy({ left: 320 + 32, behavior: 'smooth' });
        }
      }
    }, 4500);
    return () => clearInterval(scrollInterval);
  }, [isArrivalsPaused]);

  return (
    // Changed bg-gray-50 to bg-[#FDFBF7] for a warm Ivory look
    <div className="HomePageWrapper bg-[#FDFBF7] text-stone-800 font-montserrat overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-4" data-aos="fade-up">
         {/* Subtle background decoration */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-gradient-to-b from-rose-50 to-transparent -z-10 opacity-50 blur-3xl rounded-full"></div>
         
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-amber-700 text-sm font-bold tracking-[0.3em] uppercase mb-4">Est. 2023</h2>
          <h1 className="font-marcellus text-6xl sm:text-7xl md:text-8xl mb-6 text-stone-900 tracking-tight">
            Rरिwaaz
          </h1>
          <div className="h-[1px] w-24 bg-stone-300 mx-auto mb-8"></div>
          <p className="text-stone-600 text-lg sm:text-xl font-light leading-relaxed mb-10">
             Discover our exclusive collection of handpicked Sarees, designer Lehengas, and intricately embroidered Suits. 
             Where heritage meets modern elegance.
          </p>
          <Link to="/products" className="inline-block border border-stone-800 px-10 py-4 text-sm font-bold tracking-widest uppercase hover:bg-stone-800 hover:text-white transition-all duration-300">
            Shop The Collection
          </Link>
        </div>
      </div>

      {/* Category Image Carousel */}
      <div className="relative mb-24 px-4" data-aos="fade-up">
        <button onClick={() => handleScroll(categoryScrollRef, 'left')} className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        
        <div
          ref={categoryScrollRef}
          className="flex space-x-6 md:space-x-10 overflow-x-auto pb-8 pt-4 horizontal-scrollbar px-4"
          onMouseEnter={() => setCategoryPaused(true)}
          onMouseLeave={() => setCategoryPaused(false)}
        >
          {categories.map((category) => (
            <div key={category._id} className="group flex-shrink-0 w-72 md:w-80 text-left cursor-pointer">
              <Link to={`/products/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="overflow-hidden rounded-sm relative shadow-sm">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-[28rem] md:h-[32rem] object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent z-20">
                     <h3 className="font-marcellus text-2xl text-white">{category.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-stone-500 mt-4 h-10 font-light leading-snug">{category.description}</p>
                <div className="inline-flex items-center mt-2 text-xs font-bold tracking-widest uppercase text-stone-800 group-hover:text-amber-700 transition-colors border-b border-transparent group-hover:border-amber-700 pb-1">
                  <span>Explore</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <button onClick={() => handleScroll(categoryScrollRef, 'right')} className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white shadow-lg rounded-full p-3 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

     {/* Features Section - Refined */}
      <div className="container mx-auto px-4 py-16 border-t border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <FeatureIconWrapper title="On-Time Delivery" desc="We ensure your outfit reaches you promptly before your special occasion.">
            <CalendarIcon />
          </FeatureIconWrapper>
          <FeatureIconWrapper title="Custom Stitching" desc="Get your Lehengas and Suits stitched to your exact measurements.">
            <RulerIcon />
          </FeatureIconWrapper>
          <FeatureIconWrapper title="Handcrafted Detail" desc="Intricate embroidery and flawless finishing by master artisans.">
            <ScissorIcon />
          </FeatureIconWrapper>
          <FeatureIconWrapper title="Premium Fabrics" desc="Curated selection of the finest silks, georgettes, and velvets.">
            <FabricIcon />
          </FeatureIconWrapper>
        </div>
      </div>

      {/* Image Grid Section - Typography Polish */}
      <div className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gridItems.map(item => (
            <div key={item._id} className="group relative overflow-hidden h-96 md:h-[30rem]">
              <Link to={item.link}>
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/10 transition-colors"></div>
                <div className="absolute bottom-8 left-8">
                  <span className="block text-white text-xs tracking-widest uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">Shop Category</span>
                  <h3 className="text-white font-marcellus text-3xl">{item.title}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="bg-white py-20 border-t border-stone-100" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
               <h4 className="text-amber-700 font-bold tracking-widest text-xs uppercase mb-2">Fresh Collections</h4>
               <h2 className="font-marcellus text-4xl text-stone-900">New Arrivals</h2>
            </div>
            <Link to="/products" className="text-sm font-bold tracking-widest uppercase border-b border-stone-300 hover:border-amber-700 hover:text-amber-700 transition-colors pb-1 mt-4 md:mt-0">
              View All Products
            </Link>
          </div>
          
          <div className="relative">
             {/* Left Arrow */}
            <button onClick={() => handleScroll(arrivalsScrollRef, 'left')} className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-20 bg-white hover:text-amber-700 shadow-md rounded-full p-2 transition-colors border border-stone-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            
            <div
              ref={arrivalsScrollRef}
              className="flex space-x-8 overflow-x-auto pb-8 pt-2 horizontal-scrollbar px-2"
              onMouseEnter={() => setArrivalsPaused(true)}
              onMouseLeave={() => setArrivalsPaused(false)}
            >
              {newArrivals.map(product => (
                <div key={product._id} className="group flex-shrink-0 w-64 md:w-72">
                  <Link to={`/products/${product._id}`}>
                    <div className="overflow-hidden relative mb-4">
                      {/* Badge */}
                      <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 text-[10px] font-bold tracking-widest uppercase z-10">New</div>
                      <img src={product.image} alt={product.name} className="w-full h-80 md:h-96 object-cover group-hover:scale-105 transition-transform duration-500" />
                      {/* Hover Button */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white/95 py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                         <span className="text-xs font-bold uppercase tracking-widest text-stone-800">View Details</span>
                      </div>
                    </div>
                    <h3 className="font-marcellus text-lg text-stone-900 truncate">{product.name}</h3>
                    <p className="text-stone-500 font-light mt-1">₹{product.price}</p>
                  </Link>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button onClick={() => handleScroll(arrivalsScrollRef, 'right')} className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-20 bg-white hover:text-amber-700 shadow-md rounded-full p-2 transition-colors border border-stone-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Wedding Collection Section - Updated Content & Design */}
      <div className="bg-[#1c1c1c] text-white py-12 md:py-24 relative overflow-hidden">
        <GoldenGlowBackground />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-[#1c1c1c]/50 backdrop-blur-sm border border-white/10 p-6 md:p-12 mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2" data-aos="fade-right">
              <div className="relative aspect-[4/5] md:aspect-square overflow-hidden shadow-2xl border border-white/10">
                <video
                  src={weddingVideo}
                  alt="Bride getting ready"
                  className="w-full h-full object-cover"
                  autoPlay loop muted playsInline
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/2 text-left" data-aos="fade-left">
              <span className="text-amber-200 font-bold tracking-widest text-xs uppercase mb-4 block">The Bridal Edit</span>
              <h2 className="font-marcellus text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
                Royal Wedding <br/> Collection
              </h2>
              <p className="text-stone-300 text-base sm:text-lg font-light leading-relaxed mb-8">
                For the most important day of your life, settle for nothing less than absolute perfection. 
                Our bridal collection features hand-embroidered Lehengas and regal Sarees, 
                blending timeless traditions with contemporary silhouettes. Crafted with love 
                to make you the center of attention.
              </p>
              <Link
                to="/products/category/wedding"
                className="inline-block bg-white text-black hover:bg-amber-100 font-medium py-4 px-10 transition-colors duration-300 text-sm uppercase tracking-widest"
              >
                View Bridal Collection
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialCarousel />

      {/* Instagram & Newsletter Section */}
      <div className="bg-white py-24 text-center overflow-hidden" data-aos="fade-up">
        <div className="container mx-auto px-4 relative mb-20">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[12rem] md:text-[14rem] font-marcellus text-stone-50 opacity-100 z-0">JOIN US</span>
          </div>
          <div className="relative z-10 max-w-lg mx-auto bg-white/90 backdrop-blur-sm p-6 rounded-xl">
            <h2 className="font-marcellus text-3xl sm:text-4xl text-stone-900 mb-2">Unlock Exclusive Offers</h2>
            <p className="text-stone-500 mb-8 font-light">Sign up for our newsletter to receive updates on new arrivals and special sales.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input type="email" placeholder="Your Email Address" className="flex-1 p-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-400 placeholder-stone-400" />
              <button
                type="submit"
                className="bg-stone-900 text-white font-bold p-3 px-8 uppercase tracking-widest hover:bg-amber-700 transition-colors"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 border-t border-b border-white">
          {instagramPosts.map(post => (
            <a href="#" key={post._id} className="group overflow-hidden relative h-64">
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 z-10 transition-colors flex items-center justify-center">
                 <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-0 group-hover:scale-100 duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.072 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </div>
              <img src={post.image} alt="Instagram post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
            </a>
          ))}
        </div>
        <a href="https://www.instagram.com/rriwaaz?igsh=MW42NThrcmQ5bDRocw==" className="inline-block mt-12 text-stone-900 border-b border-stone-900 pb-1 font-bold text-sm uppercase tracking-widest hover:text-amber-700 hover:border-amber-700 transition-colors">
          Follow us on Instagram
        </a>
      </div>
    </div>
  );
};

export default HomePage;