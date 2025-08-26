import React from 'react';

const CheckoutPage = () => {
  return (
    <div className="bg-[#f2f2f2] min-h-screen">
      <div className="container mx-auto p-8 text-center">
        <h1 className="font-marcellus text-4xl text-slate-900">Order Summary</h1>
        <div className="mt-8 bg-white p-10 rounded-lg shadow-md">
          <p className="text-slate-500">Your shopping cart is currently empty. The checkout and order summary will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
