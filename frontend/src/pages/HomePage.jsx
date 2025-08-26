import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { mensuitImage, blazerImage, kurtaImage, poloImage, indowesternImage, shirt, wedding, formal, linen, cashmere, nehru, linensuit, shirts, polot, insta1, insta2, insta3, insta4, rely } from '../assets';
import weddingVideo from '../assets/weddingvideo.mp4';

// Mock data can live outside the component
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

const gridItems = [
    {
        _id: '1',
        title: 'Wedding Attire',
        image: wedding,
        link: '/products/wedding',
    },
    {
        _id: '2',
        title: 'Formal Wear',
        image: formal,
        link: '/products/formal',
    },
   {
    _id: '3',
    title: 'Tailored Suits',
    image: rely,
    link: '/products/tailored-suits',
}

];

const newArrivals = [
    {
        _id: '1',
        name: 'Linen Blend Suit',
        price: '450.00',
        image: linensuit
    },
    {
        _id: '2',
        name: 'Silk Nehru Jacket',
        price: '250.00',
        image: nehru
    },
    {
        _id: '3',
        name: 'Custom Monogrammed Shirt',
        price: '150.00',
        image: shirts
    },
    {
        _id: '4',
        name: 'WindowPayne Utility Jacket',
        price: '200.00',
        image: cashmere
    },
    {
        _id: '5',
        name: 'Panel Polo T-Shirt',
        price: '150.00',
        image: polot
    },
    {
        _id: '6',
        name: 'Cuban Linen Shirt',
        price: '200.00',
        image: linen
    },
];

const testimonials = [
  {
    quote: "Best fitted white denim shirt, more white denim than expected, flexible crazy soft.",
    author: "DENIM CRAZE"
  },
  {
    quote: "Absolutely loved the tailoring, exceeded my expectations and felt premium.",
    author: "UPTOP"
  },
  {
    quote: "Stylish, comfortable, and elegant. Perfect fit for my big day!",
    author: "BRIDEGROOM"
  },
  {
    quote: "Faisal tailored my sherwani perfectly, the fitting was flawless and everyone praised it.",
    author: "Faisal Khan"
  },
  {
    quote: "Adnan’s craftsmanship is next level. My three-piece suit felt like it was made just for me.",
    author: "Adnan Ali"
  },
  {
    quote: "Shahnawaz made my wedding outfit exactly how I imagined. The embroidery was breathtaking.",
    author: "Shahnawaz Sheikh"
  },
  {
    quote: "Sharzil designed my formal wear with such precision. Every detail was on point.",
    author: "Sharzil Ahmed"
  },
  {
    quote: "Suraj gave me the most comfortable kurta I’ve ever worn. Truly premium stitching.",
    author: "Suraj Verma"
  },
  {
    quote: "The linen shirt I got tailored was so light and airy, perfect for summer weddings.",
    author: "Rahul Mehra"
  },
  {
    quote: "Best bespoke tailoring experience. They really understood my style and fit preference.",
    author: "Imran Qureshi"
  },
  {
    quote: "Got a blazer stitched for an event, and people couldn’t stop asking me where it was from!",
    author: "Arjun Sharma"
  },
  {
    quote: "From measurement to delivery, everything was seamless. The fabric quality is unmatched.",
    author: "Zeeshan Ansari"
  }
];


const instagramPosts = [
  { 
    _id: '1', 
    image: insta1
    // link: 'https://unsplash.com/photos/photo-1550241533-348a8a69a023' 
  },
  { 
    _id: '2', 
    image: insta2
    // link: 'https://unsplash.com/photos/photo-1520975954732-35dd22299612' 
  },
  { 
    _id: '3', 
    image: insta3 
    // link: 'https://unsplash.com/photos/photo-1611335292899-525d348394d1' 
  },
  { 
    _id: '4', 
    image: insta4
    // link: 'https://unsplash.com/photos/photo-1579302482452-a63d9121981e' 
  },
  { 
    _id: '5', 
    image: 'https://images.unsplash.com/photo-1521341057461-6eb5f40b07ab?q=80&w=1887&auto=format&fit=crop' 
    // no link
  },
  { 
    _id: '6', 
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1888&auto=format&fit=crop' 
    // no link
  },
];


// This component is now self-contained and can be used easily.
const TestimonialCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-sm font-semibold tracking-widest text-black mb-8">
          WE LOVE GOOD COMPLIMENTS
        </h2>
        
        <Slider {...settings}>
          {testimonials.map((item, index) => (
            <div key={index} className="px-4">
              <p className="text-2xl md:text-3xl text-slate-600 italic leading-relaxed mb-6">
                “{item.quote}”
              </p>
              <p className="text-sm font-medium text-slate-500 uppercase">
                {item.author}
              </p>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

// SVG Icons for the features section
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-4 text-black-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const RulerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-4 text-black-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 8h16M4 16h16" /></svg>;
const ScissorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-4 text-black-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879a1 1 0 01-1.414 0L2 12m12.121-5.879L19 19" /></svg>;
const FabricIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-4 text-black-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M10 4l-2 1m2-1l-2-1m2 1v2.5M7 14l-2 1m2-1l-2-1m2 1v2.5m10 0l2-1m-2 1l2 1m-2-1v-2.5m-10 0l-2 1m-2-1l-2-1m2 1v-2.5" /></svg>;

// Social Icons for Footer
const FacebookIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>;
const TwitterIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>;
const InstagramIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.795 2.013 10.148 2 12.315 2zm-1.161 1.545a3.27 3.27 0 01-2.17.93c-1.368.048-2.27.29-2.904.532-.7.27-1.255.635-1.813 1.192-.56.56-.92 1.113-1.192 1.813-.242.633-.484 1.536-.532 2.904-.048 1.067-.06 1.412-.06 3.56s.012 2.493.06 3.56c.048 1.368.29 2.27.532 2.904.27.7.635 1.255 1.192 1.813.56.56 1.113.92 1.813 1.192.633.242 1.536.484 2.904.532 1.067.048 1.412.06 3.56.06s2.493-.012 3.56-.06c1.368-.048 2.27-.29 2.904-.532.7-.27 1.255-.635-1.813-1.192.56-.56.92-1.113 1.192-1.813.242-.633.484-1.536.532-2.904.048-1.067.06-1.412.06-3.56s-.012-2.493-.06-3.56c-.048-1.368-.29-2.27-.532-2.904-.27-.7-.635-1.255-1.192-1.813-.56-.56-1.113-.92-1.813-1.192-.633-.242-1.536-.484-2.904-.532-1.067-.048-1.412-.06-3.56-.06zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 1.802a3.333 3.333 0 110 6.666 3.333 3.333 0 010-6.666zm5.338-3.205a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" /></svg>;


const HomePage = () => {
  const categoryScrollRef = useRef(null);
  const arrivalsScrollRef = useRef(null);
  
  const [isCategoryPaused, setCategoryPaused] = useState(false);
  const [isArrivalsPaused, setArrivalsPaused] = useState(false);

  const handleScroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = ref.current.offsetWidth * 0.8;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Auto-scroll for Categories
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
    }, 3000); 
    return () => clearInterval(scrollInterval);
  }, [isCategoryPaused]);

  // Auto-scroll for New Arrivals
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
    }, 3500); // Slightly different timing
    return () => clearInterval(scrollInterval);
  }, [isArrivalsPaused]);


  return (
    <div className="bg-[#f2f2f2] text-slate-800 font-montserrat">
      {/* Hero Section */}
      <div className="container mx-auto text-center pt-16 pb-12 px-4" data-aos = "fade-up">
        <h1 className="font-marcellus text-6xl md:text-7xl mb-4 text-slate-900">Rely Tailors</h1>
        <p className="max-w-2xl mx-auto text-slate-600">
          With over 35 years of masterful craftsmanship, we create more than just suits; we tailor experiences. Each stitch is a testament to our legacy of quality and precision, ensuring you look and feel exceptional.
        </p>
      </div>

      {/* Category Image Carousel */}
      <div className="relative mb-24" data-aos="fade-up">
           <button onClick={() => handleScroll(categoryScrollRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/50 hover:bg-white rounded-full p-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
           </button>
          <div 
            ref={categoryScrollRef} 
            className="flex space-x-12 overflow-x-auto pb-4 horizontal-scrollbar px-4"
            onMouseEnter={() => setCategoryPaused(true)}
            onMouseLeave={() => setCategoryPaused(false)}
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
           <button onClick={() => handleScroll(categoryScrollRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/50 hover:bg-white rounded-full p-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
           </button>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
              <div data-aos="fade-up" data-aos-delay="0">
                  <CalendarIcon />
                  <h3 className="font-marcellus text-2xl">Book An Appointment</h3>
                  <p className="text-sm text-black text-500 mt-2">Schedule a private consultation with our master tailors at your convenience.</p>
              </div>
               <div data-aos="fade-up" data-aos-delay="100">
                  <RulerIcon />
                  <h3 className="font-marcellus text-2xl">Perfect Fit Guarantee</h3>
                  <p className="text-sm text-black text-500 mt-2">We ensure every garment is tailored to your exact measurements for a flawless fit.</p>
              </div>
               <div data-aos="fade-up" data-aos-delay="200">
                  <ScissorIcon />
                  <h3 className="font-marcellus text-2xl">Expert Alterations</h3>
                  <p className="text-sm text-black text-500 mt-2">Our skilled team provides meticulous alterations to perfect your existing wardrobe.</p>
              </div>
               <div data-aos="fade-up" data-aos-delay="300">
                  <FabricIcon />
                  <h3 className="font-marcellus text-2xl">Premium Fabrics</h3>
                  <p className="text-sm text-black text-500 mt-2">Choose from a curated selection of the world's finest and most luxurious materials.</p>
              </div>
          </div>
      </div>

      {/* Image Grid Section */}
      <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {gridItems.map(item => (
                  <div key={item._id} className="group relative overflow-hidden">
                      <Link to={item.link}>
                          <img src={item.image} alt={item.title} className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end justify-start p-6">
                              <h3 className="text-white font-marcellus text-2xl">{item.title}</h3>
                          </div>
                      </Link>
                  </div>
              ))}
          </div>
      </div>

      {/* New Arrivals Section */}
      <div className="bg-white py-24" data-aos="fade-up">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
                <h2 className="font-marcellus text-4xl text-black text-900">Our New Arrivals</h2>
                <Link to="/products" className="text-lg text- black font-bold tracking-widest uppercase border-b-2 border-slate-400 hover:border-amber-600 transition-colors ml-4">
                    View All Products
                </Link>
            </div>
            <div className="relative">
                <button onClick={() => handleScroll(arrivalsScrollRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/50 hover:bg-white rounded-full p-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div 
                    ref={arrivalsScrollRef} 
                    className="flex space-x-8 overflow-x-auto pb-4 horizontal-scrollbar px-4"
                    onMouseEnter={() => setArrivalsPaused(true)}
                    onMouseLeave={() => setArrivalsPaused(false)}
                >
                    {newArrivals.map(product => (
                        <div key={product._id} className="group flex-shrink-0 w-80 text-center">
                            <Link to={`/products/${product._id}`}>
                                <div className="overflow-hidden">
                                    <img src={product.image} alt={product.name} className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <h3 className="font-marcellus text-xl mt-4">{product.name}</h3>
                                <p className="text-slate-500">${product.price}</p>
                            </Link>
                        </div>
                    ))}
                </div>
                <button onClick={() => handleScroll(arrivalsScrollRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/50 hover:bg-white rounded-full p-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
      </div>
      {/* Wedding Collection Section */}
      <div className="bg-[#f2f2f2] py-24">
        <div className="container mx-auto px-4">
            <div className="bg-white p-12 md:p-12 mx-8 md:mx-20 flex flex-col md:flex-row items-center gap-12">

               <div className="md:w-1/2" data-aos="fade-right">
    <video 
        src={weddingVideo} // Use the imported video variable
        alt="Groom getting ready for his wedding"
        className="w-full h-[500px] object-cover" // Use h-full for better coverage
        autoPlay
        loop
        muted
        playsInline
    />
</div>
                <div className="md:w-1/2" data-aos="fade-left">
                    <h2 className="font-marcellus text-5xl text-black text-900 text-left">The Wedding <br /> Collection</h2>
                  <p className="text-black text-600 my-4">
  For the most important day of your life, settle for nothing less than absolute perfection. Our wedding collection brings together timeless elegance and modern sophistication, offering bespoke suits and tuxedos designed to make you the center of attention. From handpicked fabrics to precision tailoring, every piece is crafted with care, ensuring a flawless fit that reflects your personal style. Whether you envision a classic, regal look or a bold, contemporary statement, we tailor each detail to perfection—so you not only look extraordinary but also feel confident, comfortable, and unforgettable on your big day.
</p>

                  <Link 
  to="/products/wedding" 
  className="inline-block bg-black text-white hover:bg-white hover:text-black border border-transparent hover:border-black font-light py-3 px-8 rounded-sm transition-colors duration-300 text-sm uppercase tracking-widest"
>
                      Shop Collection
                  </Link>
                </div>
            </div>
        </div>
      </div>

      <TestimonialCarousel />

      {/* Instagram & Newsletter Section */}
      <div className="bg-white py-24 text-center">
        <div className="container mx-auto px-4">
            <h2 className="font-marcellus text-4xl text-slate-900">Sign Up For Our Newsletter</h2>
            <form className="max-w-md mx-auto mt-8 flex">
                <input type="email" placeholder="Your Email Address" className="w-full p-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400" />
                <button 
  type="submit" 
  className="bg-slate-900 text-white font-bold p-3 uppercase tracking-widest hover:bg-slate-800 transition-colors w-40"
>
  Sign Up
</button>

            </form>
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-6">
            {instagramPosts.map(post => (
                <a href="#" key={post._id} className="group overflow-hidden">
                    <img src={post.image} alt="Instagram post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                </a>
            ))}
        </div>
         <a href="#" className="inline-block mt-12 bg-slate-900 text-white font-bold py-3 px-8 rounded-sm hover:bg-slate-800 transition-colors duration-300 text-sm uppercase tracking-widest">
            Follow us on Instagram
        </a>
      </div>



    </div>
  );
};

export default HomePage;
