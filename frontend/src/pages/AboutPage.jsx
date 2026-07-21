import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  Scissors, 
  Feather, 
  Gem, 
  ShoppingBag, 
  Gift, 
  Spool, 
  Quote 
} from 'lucide-react';

// Importing your R Rivaaz assets
import shadi from '../assets/shadi.jpg';
import shadi2 from '../assets/shadi2.jpg';

// --- Sub-Components ---

const StatBox = ({ number, label }) => (
  <div className="border-l-2 border-amber-700 pl-4">
    <span className="font-marcellus text-3xl text-stone-900 block">{number}</span>
    <span className="text-xs uppercase tracking-widest text-stone-500">{label}</span>
  </div>
);

const ValueCard = ({ icon: Icon, title, description, delay }) => (
  <div 
    data-aos="fade-up" 
    data-aos-delay={delay}
    className="text-center p-8 bg-white border border-stone-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
  >
    <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center mx-auto mb-6 text-amber-700">
      <Icon size={28} strokeWidth={1.5} />
    </div>
    <h3 className="font-marcellus text-xl mb-3 text-stone-900">{title}</h3>
    <p className="text-stone-600 text-sm leading-relaxed font-light">{description}</p>
  </div>
);

const ServiceCard = ({ title, description, icon: Icon }) => (
  <div className="group bg-white p-8 transition-all duration-300 border border-stone-100 hover:border-amber-700/30 hover:shadow-xl relative overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-0 bg-amber-700 group-hover:h-full transition-all duration-300"></div>
    <div className="text-stone-400 group-hover:text-amber-700 transition-colors mb-4">
      <Icon size={32} strokeWidth={1.2} />
    </div>
    <h3 className="font-marcellus text-lg mb-2 text-stone-900">{title}</h3>
    <p className="text-stone-500 text-sm leading-relaxed font-light">{description}</p>
  </div>
);

const AboutPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
      offset: 100,
    });
  }, []);

  return (
    <div className="bg-[#FDFBF7] font-montserrat text-stone-800 overflow-x-hidden">

      {/* --- Hero Section --- */}
      <div className="relative pt-12 pb-20 md:py-32 overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            {/* Image Side */}
            <div data-aos="fade-right" className="relative order-2 md:order-1">
              <div className="absolute inset-0 border border-amber-700/30 translate-x-4 translate-y-4 z-0"></div>
              <img
                src={shadi}
                alt="Intricate Indian Bridal Wear"
                className="w-full h-[500px] object-cover relative z-10 shadow-xl"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-6 shadow-xl z-20 max-w-[200px] border-t-4 border-amber-700 hidden md:block">
                <p className="font-marcellus text-3xl text-stone-900 mb-1">5+</p>
                <p className="text-xs uppercase tracking-widest text-stone-500">Years of Heritage & Excellence</p>
              </div>
            </div>

            {/* Text Side */}
            <div data-aos="fade-left" className="order-1 md:order-2">
              <span className="text-amber-700 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Our Story</span>
              <h1 className="font-marcellus text-5xl md:text-6xl text-stone-900 leading-tight mb-8">
                Weaving Tradition into <span className="italic font-light text-stone-500">Modern Grace</span>
              </h1>
              <p className="text-stone-600 mb-6 leading-relaxed text-lg font-light">
                At <strong>RRiwaaz</strong>, we believe every garment tells a story. 
                We blend the rich heritage of Indian craftsmanship with contemporary silhouettes 
                to create ensembles that celebrate the modern woman. 
              </p>
              <p className="text-stone-600 mb-10 leading-relaxed text-lg font-light">
                From the royal drape of a Kanjivaram Saree to the intricate Zardosi of a Bridal Lehenga, 
                we craft art you can wear.
              </p>
              
              <div className="grid grid-cols-2 gap-8 mt-8 border-t border-stone-200 pt-8">
                <StatBox number="5000+" label="Happy Clients" />
                <StatBox number="100%" label="Handcrafted" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Our Values Section --- */}
      <div className="bg-white py-24 relative border-t border-stone-100">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto" data-aos="fade-up">
            <h2 className="font-marcellus text-4xl text-stone-900 mb-4">Our Philosophy</h2>
            <div className="w-24 h-[1px] bg-amber-700 mx-auto mb-6"></div>
            <p className="text-stone-500 font-light">Where age-old traditions meet modern elegance. We stand by three core pillars.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={Gem} 
              title="Intricate Karigari" 
              description="Our master artisans spend hours perfecting every bead, thread, and sequin to ensure your outfit shines with authenticity."
              delay="100"
            />
            <ValueCard 
              icon={Feather} 
              title="Authentic Fabrics" 
              description="We source the finest silks, georgettes, and organzas directly from weavers across the country, ensuring pure luxury."
              delay="200"
            />
            <ValueCard 
              icon={Scissors} 
              title="Custom Fitting" 
              description="Every body is unique. We ensure your Lehengas and Suits are tailored to your exact measurements for a flawless fit."
              delay="300"
            />
          </div>
        </div>
      </div>

      {/* --- Meet the Designers Section --- */}
      <div className="py-24 bg-[#FDFBF7]">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div data-aos="fade-right" className="order-2 md:order-1">
            <h2 className="font-marcellus text-4xl md:text-5xl text-stone-900 mb-6">
              Designed for the <br /> <span className="text-amber-800">Royal in You</span>
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6 font-light text-lg">
              At RRiwaaz, fashion is an emotion. Behind every collection is a dedicated team of designers 
              and <em>kaarigars</em> (artisans) who breathe life into fabric. We honor the legacy of Indian textiles 
              while innovating with cuts and colors that appeal to the contemporary woman.
            </p>
            <p className="text-stone-600 leading-relaxed mb-8 font-light text-lg">
              Whether it's the heavy Zardosi work for a bride or a breezy Chikankari Kurti for a summer lunch, 
              precision is our promise. We don't just make clothes; we create heirlooms.
            </p>
            <Link
              to="/contact"
              className="inline-block border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300"
            >
              Book a Styling Session
            </Link>
          </div>

          <div data-aos="zoom-in" className="flex justify-center order-1 md:order-2 relative">
             <div className="absolute inset-0 bg-stone-900/5 translate-x-4 translate-y-4"></div>
            <img
              src={shadi2}
              alt="Artisan working on embroidery"
              className="w-full h-[600px] object-cover relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>

        </div>
      </div>

      {/* --- Services Section --- */}
      <div className="bg-white py-24 border-t border-stone-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
             <div data-aos="fade-right">
                <span className="text-amber-700 font-bold tracking-[0.2em] text-xs uppercase mb-2 block">What We Offer</span>
                <h2 className="font-marcellus text-4xl text-stone-900">Collections & Services</h2>
             </div>
             <p className="text-stone-500 max-w-md text-right font-light mt-4 md:mt-0" data-aos="fade-left">
                From bridal trousseaus to everyday ethnic chic, we cover all your fashion needs.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up">
            <ServiceCard
              icon={Gem}
              title="Bridal Couture"
              description="Exquisite Lehengas and heavy Suits designed to make your special day truly unforgettable."
            />
            <ServiceCard
              icon={Spool}
              title="Custom Stitching"
              description="Get your dream outfit stitched to perfection. You choose the design; we bring it to life."
            />
            <ServiceCard
              icon={Feather}
              title="Hand Embroidery"
              description="Specializing in Zardosi, Phulkari, and Mirror work to add that royal touch to your garments."
            />
            <ServiceCard
              icon={ShoppingBag}
              title="Sarees & Drapes"
              description="A curated collection of Banarasi, Silk, and Designer Sarees for every occasion."
            />
            <ServiceCard
              icon={Scissors}
              title="Expert Alterations"
              description="Expert fitting adjustments to ensure your existing ethnic wear fits you like a glove."
            />
            <ServiceCard
              icon={Gift}
              title="Trousseau Packing"
              description="Elegant packaging services to present your wedding gifts and outfits with style."
            />
          </div>
        </div>
      </div>

      {/* --- Testimonials Section (Dark Theme) --- */}
      <div className="bg-[#1c1c1c] text-stone-300 py-24 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-900/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
             <Quote size={40} className="text-amber-700/50 mx-auto mb-6" />
            <h2 className="font-marcellus text-4xl text-white mb-4">Client Love</h2>
            <p className="text-stone-400 font-light">Stories from women who chose RRiwaaz.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "The velvet Lehenga I bought for my sister's wedding was stunning. The fitting was flawless right out of the box!", author: "Ayesha Khan", loc: "Delhi" },
              { text: "Finally found a brand that understands ethnic chic. My office wear Kurtis are so comfortable and stylish.", author: "Priya Sharma", loc: "Mumbai" },
              { text: "I was skeptical about ordering a Saree online, but the silk quality is pure luxury. RRiwaaz is now my go-to.", author: "Zara Malik", loc: "Bangalore" }
            ].map((item, index) => (
              <div key={index} className="bg-stone-800/50 p-8 border border-stone-700/50 hover:border-amber-700/50 transition-colors" data-aos="fade-up" data-aos-delay={index * 150}>
                <div className="text-amber-500 text-xs tracking-widest mb-4">★★★★★</div>
                <p className="text-stone-300 italic mb-6 text-lg font-marcellus leading-relaxed">"{item.text}"</p>
                <div>
                  <h4 className="font-bold text-white uppercase text-xs tracking-widest">{item.author}</h4>
                  <p className="text-xs text-stone-500 mt-1">{item.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- CTA Section --- */}
      <div className="bg-amber-50 py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-marcellus text-4xl text-stone-900 mb-6" data-aos="fade-up">Embrace the RRiwaaz Elegance</h2>
          <p className="max-w-2xl mx-auto text-stone-600 mb-10 font-light text-lg" data-aos="fade-up" data-aos-delay="100">
            Explore our latest collection or book a video consultation to get your outfit customized from the comfort of your home.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6" data-aos="fade-up" data-aos-delay="200">
            <Link
              to="/products"
              className="bg-stone-900 text-white hover:bg-amber-700 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-stone-900/20"
            >
              Shop Collection
            </Link>
            <Link
              to="/contact"
              className="bg-white text-stone-900 border border-stone-200 hover:border-stone-900 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;