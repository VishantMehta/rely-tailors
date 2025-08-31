import React from 'react';
import { Link } from 'react-router-dom';

const FacebookIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>;
const TwitterIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>;
const InstagramIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363.416 2.427.465C9.795 2.013 10.148 2 12.315 2zm-1.161 1.545a3.27 3.27 0 01-2.17.93c-1.368.048-2.27.29-2.904.532-.7.27-1.255.635-1.813 1.192-.56.56-.92 1.113-1.192 1.813-.242.633-.484 1.536-.532 2.904-.048 1.067-.06 1.412-.06 3.56s.012 2.493.06 3.56c.048 1.368.29 2.27.532 2.904.27.7.635 1.255 1.192 1.813.56.56 1.113.92 1.813 1.192.633.242 1.536.484 2.904.532 1.067.048 1.412.06 3.56.06s2.493-.012 3.56-.06c1.368-.048 2.27-.29 2.904-.532.7-.27 1.255-.635-1.813-1.192.56-.56.92-1.113 1.192-1.813.242-.633.484-1.536.532-2.904.048-1.067.06-1.412.06-3.56s-.012-2.493-.06-3.56c-.048-1.368-.29-2.27-.532-2.904-.27-.7-.635-1.255-1.192-1.813-.56-.56-1.113-.92-1.813-1.192-.633-.242-1.536-.484-2.904-.532-1.067-.048-1.412-.06-3.56-.06zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 1.802a3.333 3.333 0 110 6.666 3.333 3.333 0 010-6.666zm5.338-3.205a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" /></svg>;

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white font-montserrat">
      <div className="container mx-auto py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          <div className="md:col-span-1">
            <h3 className="font-marcellus text-2xl mb-4">RELY TAILORS</h3>
            <p className="text-sm text-slate-400">
              Crafting timeless elegance and perfect fits for the discerning gentleman since 1988.
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4">Shop</h4>
            <div className="flex flex-col space-y-3 text-sm text-slate-400">
              <Link to="/products/suits" className="hover:text-amber-500 transition-colors">Suits</Link>
              <Link to="/products/blazers" className="hover:text-amber-500 transition-colors">Blazers</Link>
              <Link to="/products/shirts" className="hover:text-amber-500 transition-colors">Shirts</Link>
              <Link to="/products/accessories" className="hover:text-amber-500 transition-colors">Accessories</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4">Company</h4>
            <div className="flex flex-col space-y-3 text-sm text-slate-400">
              <Link to="/about" className="hover:text-amber-500 transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-amber-500 transition-colors">Contact</Link>
              <Link to="/appointments" className="hover:text-amber-500 transition-colors">Book Appointment</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4">Join Our Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4">
              Receive updates on new arrivals and exclusive offers.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-slate-700 text-white px-4 py-2 rounded-l-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-full text-sm"
              />
              <button
                type="submit"
                className="bg-amber-500 text-slate-900 px-6 py-2 rounded-r-sm font-bold hover:bg-amber-600 transition-colors text-sm"
              >
                Sign Up
              </button>
            </form>

          </div>
        </div>

        <div className="mt-16 border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 space-y-4 md:space-y-0">
            <p>&copy; 2025 Rely Tailors. All Rights Reserved.</p>
            
            {/* DEVELOPER CREDITS AS A PARAGRAPH */}
            <p className="text-slate-500">
                Designed & Developed by Tabish & Vishant
            </p>

            <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors"><FacebookIcon /></a>
                <a href="#" className="hover:text-white transition-colors"><TwitterIcon /></a>
                <a href="#" className="hover:text-white transition-colors"><InstagramIcon /></a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;