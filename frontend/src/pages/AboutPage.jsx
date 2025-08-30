import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { insta1, insta2, insta3 } from '../assets/index';
import AOS from 'aos';
import 'aos/dist/aos.css';
// import ProductsPage from './ProductsPage';
import chote from '../assets/chote.webp';

// Animated Background Component
const BackgroundCubes = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <ul className="circles">
      <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
    </ul>
  </div>
);

// Service Card Component
const ServiceCard = ({ title, description, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 h-full">
    <div className="text-3xl mb-3 text-slate-700">{icon}</div>
    <h3 className="font-semibold text-lg mb-2 text-slate-800">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const AboutPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out',
      offset: 120,
    });
  }, []);

  return (
    <div className="bg-white font-montserrat text-slate-800 overflow-x-hidden">

      {/* --- Hero Section --- */}
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right" data-aos-delay="200" className="flex justify-center">
            <div className="relative w-full max-w-md">
              <img
                src={insta1}
                alt="A master tailor measuring fabric"
                className="w-full h-90 object-contain rounded-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-slate-800 text-white p-4 rounded-lg shadow-lg">
                <span className="block text-2xl font-bold">35+</span>
                <span className="text-sm">Years Experience</span>
              </div>
            </div>
          </div>
          <div data-aos="fade-left" data-aos-delay="400">
            <h1 className="font-marcellus text-4xl md:text-5xl text-slate-900 leading-tight tracking-tight">
              Precision Tailoring <br /> for the Modern Individual
            </h1>
            <p className="text-slate-600 mt-6 leading-relaxed">
              At Rely Tailors, we believe that clothing should be an extension of your personality.
              Our master craftsmen combine traditional techniques with contemporary design to create
              garments that not only fit perfectly but tell your unique story.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-slate-100 p-3 rounded-lg">
                <span className="font-semibold text-slate-900 block">5000+</span>
                <span className="text-sm text-slate-600">Satisfied Clients</span>
              </div>
              <div className="bg-slate-100 p-3 rounded-lg">
                <span className="font-semibold text-slate-900 block">100%</span>
                <span className="text-sm text-slate-600">Handcrafted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Our Values Section --- */}
      <div className="bg-slate-50 py-16 md:py-24 relative">
        <BackgroundCubes />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="font-marcellus text-3xl md:text-4xl text-slate-900 mb-4">Our Tailoring Philosophy</h2>
            <p className="text-slate-600 max-w-3xl mx-auto">We combine time-honored techniques with innovative approaches to create garments that stand the test of time.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">✂️</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Precision Craftsmanship</h3>
              <p className="text-slate-600 text-sm">Every stitch is placed with intention, ensuring durability and perfect fit that lasts for years.</p>
            </div>

            <div className="text-center" data-aos="fade-up" data-aos-delay="400">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Sustainable Practices</h3>
              <p className="text-slate-600 text-sm">We source quality fabrics responsibly and minimize waste through made-to-order production.</p>
            </div>

            <div className="text-center" data-aos="fade-up" data-aos-delay="600">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">👔</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Personalized Experience</h3>
              <p className="text-slate-600 text-sm">From consultation to final fitting, we guide you through creating your perfect garment.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Meet the Artisans Section --- */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div data-aos="zoom-in" data-aos-delay="300" className="flex justify-center">
            <div className="relative w-full max-w-md">
              <img
                src={chote}
                alt="Tailor at work"
                className="w-full h-90 object-contain rounded-lg shadow-md"
              />
              <div className="absolute -bottom-4 -left-4 bg-amber-600 text-white p-3 rounded-lg shadow-lg">
                <span className="block text-sm">Master Tailor</span>
                <span className="text-xs">Since 1995</span>
              </div>
            </div>
          </div>
          <div data-aos="fade-left" data-aos-delay="500">
            <h2 className="font-marcellus text-3xl md:text-4xl text-slate-900 mb-6">
              Meet the Artisans <br /> Behind Your Garments
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              At Rely Tailors, every stitch tells a story. Behind each custom suit is a team of
              passionate artisans who have honed their skills over decades. Our master tailors blend
              timeless techniques with contemporary sensibilities to create garments that truly reflect your personality.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              From the initial measurements to the final press, our process is guided by precision and care.
              We take pride in our attention to detail—whether it's the perfect lapel roll, the precise sleeve pitch,
              or the flawless drape of the trousers.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-slate-800 text-white font-semibold py-4 px-8 rounded-sm shadow-md hover:bg-slate-900 transition-all duration-300 text-sm uppercase tracking-widest"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* --- Services Section with SVG Background --- */}
      <div className="bg-[#f2f2f2] py-16 md:py-24 relative">
        <BackgroundCubes />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="font-marcellus text-3xl md:text-4xl text-slate-900 mb-4">Our Tailoring Services</h2>
            <p className="text-slate-600 max-w-3xl mx-auto">We offer a comprehensive range of tailoring services to meet all your sartorial needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              icon="👔"
              title="Bespoke Suiting"
              description="Complete custom suits crafted from scratch based on your precise measurements and style preferences."
            />
            <ServiceCard
              icon="👚"
              title="Shirt Making"
              description="Custom shirts with options for collar styles, cuffs, plackets, and fabric selection for perfect fit and comfort."
            />
            <ServiceCard
              icon="🔧"
              title="Alterations & Repairs"
              description="Expert alterations to refine the fit of your existing garments and quality repairs to extend their lifespan."
            />
            <ServiceCard
              icon="🎩"
              title="Formal Wear"
              description="Elegant tuxedos and formal attire for special occasions, tailored to make you stand out."
            />
            <ServiceCard
              icon="🧵"
              title="Restoration Services"
              description="Breathing new life into cherished garments through careful restoration and refurbishment."
            />
            <ServiceCard
              icon="📏"
              title="Personal Fittings"
              description="In-person or virtual consultations to ensure perfect measurements and style choices."
            />
          </div>
        </div>
      </div>

      {/* --- Our Craft Section --- */}
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right" data-aos-delay="200">
            <h2 className="font-marcellus text-3xl md:text-4xl text-slate-900 mb-6">
              The Rely Tailors <br /> Difference
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Since 1988, Rely Tailors has been more than just a brand; it's a legacy. Founded on
              precision, artistry, and respect for classic menswear, we've dedicated over three decades
              to perfecting the craft of bespoke tailoring.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              What sets us apart is our commitment to the entire process—from selecting the finest fabrics
              from renowned mills to the hand-stitched details that ensure superior quality and comfort.
              Our garments are investments designed to last for decades, not just seasons.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <span className="text-green-600 text-lg mr-2">✓</span>
                <p className="text-slate-600 text-sm">Premium fabrics from world-renowned mills</p>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 text-lg mr-2">✓</span>
                <p className="text-slate-600 text-sm">Traditional techniques with modern aesthetics</p>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 text-lg mr-2">✓</span>
                <p className="text-slate-600 text-sm">Lifetime adjustments on all bespoke garments</p>
              </div>
            </div>
            <Link
              to="/products"
              className="inline-block bg-slate-800 text-white font-semibold py-4 px-8 rounded-sm shadow-md hover:bg-slate-900 transition-all duration-300 text-sm uppercase tracking-widest"
            >
              Explore Our Creations
            </Link>
          </div>
          <div data-aos="fade-left" data-aos-delay="400" className="flex justify-center">
            <div className="relative w-full max-w-md">
              <img
                src={insta2}
                alt="A stylish man in a custom suit"
                className="w-full h-90 object-contain rounded-lg shadow-md"
              />
              <div className="absolute -bottom-4 -right-4 bg-slate-800 text-white p-3 rounded-lg shadow-lg">
                <span className="block text-sm">Custom Fit Guarantee</span>
                <span className="text-xs">Perfect Fit Every Time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Testimonials Section with SVG Background --- */}
      <div className="bg-slate-900 text-white py-16 md:py-24 relative">
        <BackgroundCubes />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="font-marcellus text-3xl md:text-4xl mb-4">Client Testimonials</h2>
            <p className="text-slate-300 max-w-3xl mx-auto">Hear what our clients have to say about their experience with Rely Tailors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-6 rounded-lg" data-aos="fade-up" data-aos-delay="200">
              <div className="text-yellow-400 text-lg mb-3">★★★★★</div>
              <p className="text-slate-300 italic mb-4 text-sm">"My Rely Tailors suit fits perfectly and receives compliments every time I wear it. The attention to detail is remarkable."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-700 rounded-full mr-3 flex items-center justify-center">M</div>
                <div>
                  <h4 className="font-semibold text-sm">Michael Thompson</h4>
                  <p className="text-xs text-slate-400">Business Executive</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg" data-aos="fade-up" data-aos-delay="400">
              <div className="text-yellow-400 text-lg mb-3">★★★★★</div>
              <p className="text-slate-300 italic mb-4 text-sm">"The team at Rely Tailors transformed my wedding day look. Their expertise in formal wear is unmatched."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-700 rounded-full mr-3 flex items-center justify-center">J</div>
                <div>
                  <h4 className="font-semibold text-sm">James Wilson</h4>
                  <p className="text-xs text-slate-400">Bridegroom</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg" data-aos="fade-up" data-aos-delay="600">
              <div className="text-yellow-400 text-lg mb-3">★★★★★</div>
              <p className="text-slate-300 italic mb-4 text-sm">"I've been a client for over 10 years. Their consistency, quality, and personal service keep me coming back."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-700 rounded-full mr-3 flex items-center justify-center">R</div>
                <div>
                  <h4 className="font-semibold text-sm">Robert Chen</h4>
                  <p className="text-xs text-slate-400">Long-term Client</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CTA Section --- */}
      <div className="bg-amber-50 py-16 md:py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-marcellus text-3xl md:text-4xl text-slate-900 mb-4" data-aos="fade-up">Experience the Art of Bespoke Tailoring</h2>
          <p className="max-w-3xl mx-auto text-slate-700 mb-8" data-aos="fade-up" data-aos-delay="200">
            Schedule a consultation with our master tailors and discover the difference that personalized, handcrafted clothing can make.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4" data-aos="fade-up" data-aos-delay="400">
            <Link
              to="/contact"
              className="inline-block bg-slate-900 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-slate-800 transition-all duration-300 text-sm uppercase tracking-widest"
            >
              Book an Appointment
            </Link>
            <Link
              to="/products"
              className="inline-block border border-slate-900 text-slate-900 font-semibold py-3 px-8 rounded-lg hover:bg-slate-900 hover:text-white transition-all duration-300 text-sm uppercase tracking-widest"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;