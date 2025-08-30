import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { f2 } from '../assets/index';

// Animated Background Component
const BackgroundCubes = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <ul className="circles">
      <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
    </ul>
  </div>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out',
      offset: 120,
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="bg-white font-montserrat text-slate-800 overflow-x-hidden">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* --- Hero Section --- */}
      <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 py-24 md:py-32 overflow-hidden">
        <BackgroundCubes />
        <div className="container mx-auto px-6 text-center relative z-10" data-aos="fade-up">
          <h1 className="font-marcellus text-4xl md:text-5xl lg:text-6xl text-white mb-4">Get in Touch With Us</h1>
          <p className="text-slate-200 mt-4 max-w-2xl mx-auto text-lg md:text-xl">
            We'd love to hear from you. Our team is always ready to provide you with the highest quality tailoring services.
          </p>
        </div>
      </div>

      {/* --- Main Content Section --- */}
      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* --- Left Side: Contact Details --- */}
            <div className="lg:w-2/5 space-y-8" data-aos="fade-right" data-aos-delay="200">
              <div className="bg-slate-50 p-8 rounded-lg shadow-sm">
                <h2 className="font-marcellus text-3xl text-slate-900 mb-6">Contact Information</h2>
                <p className="text-slate-600 mb-8">Fill out the form or contact us directly using the information below.</p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-slate-800 text-amber-500 w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Our Location</h3>
                      <p className="text-slate-600">123 Fashion Avenue, Suite 101<br />New York, NY 10001</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-slate-800 text-amber-500 w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Phone Number</h3>
                      <p className="text-slate-600">(123) 456-7890<br />(098) 765-4321</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-slate-800 text-amber-500 w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Email Address</h3>
                      <p className="text-slate-600">info@relytailors.com<br />appointments@relytailors.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-slate-800 text-amber-500 w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Working Hours</h3>
                      <p className="text-slate-600">Mon - Fri: 9am - 7pm<br />Saturday: 10am - 5pm<br />Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-slate-900 mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-slate-800 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="bg-slate-800 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="bg-slate-800 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="bg-slate-800 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors">
                      <i className="fab fa-pinterest"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="w-full h-64 lg:h-80 bg-slate-200 rounded-lg overflow-hidden shadow-sm" data-aos="zoom-in" data-aos-delay="600">
                <iframe
                  title="Rely Tailors Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.220198021099!2d-73.98823138459395!3d40.75797497932691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6452555%3A0x1963f4534f3a1a7a!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1662586337882!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>

            {/* --- Right Side: Contact Form --- */}
            <div className="lg:w-3/5" data-aos="fade-left" data-aos-delay="400">
              <div className="bg-white p-8 md:p-10 rounded-lg shadow-sm border border-slate-100">
                <h2 className="font-marcellus text-3xl text-slate-900 mb-2">Send Us a Message</h2>
                <p className="text-slate-600 mb-8">Have questions about our tailoring services? Fill out the form below and we'll get back to you as soon as possible.</p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      required
                      className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full bg-slate-900 text-white font-bold py-3 px-8 rounded-md hover:bg-black hover:text-amber-500 transition-colors duration-300 text-sm uppercase tracking-widest"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* --- Come & Say Hi Section --- */}
      <div className="bg-[#f2f2f2] py-24 relative overflow-hidden">
        <BackgroundCubes />
        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <div className="w-full md:w-1/2" data-aos="fade-right">
              <h2 className="font-marcellus text-4xl md:text-5xl text-slate-900">Come & Say Hi</h2>
              <h3 className="font-semibold text-xl mt-6 md:mt-8 mb-2">Rely Tailors</h3>
              <p className="text-slate-600">
                123 Fashion Avenue, Suite 101<br />
                New York, NY 10001
              </p>
            </div>
            <div className="w-full md:w-1/2" data-aos="fade-left">
              <img
                src={f2}
                alt="A stylish man in a custom suit"
                className="w-full h-auto max-h-96 object-contain rounded-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
