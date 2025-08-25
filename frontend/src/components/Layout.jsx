import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer'; // Make sure this is your enhanced footer
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles

const Layout = () => {
  // This effect will run once when the layout is first loaded
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true,      // Whether animation should happen only once
    });
  }, []);

  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
