import React, { useState, useEffect } from 'react';
import api from '../api/AxiosAPI';

const MyAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: ''
  });

  // Fetch addresses on page load
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/addresses');
      setAddresses(res.data);
    } catch (err) {
      console.error('Error fetching addresses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddAddress = () => {
    setIsAdding(true);
    setFormData({
      fullName: '',
      addressLine1: '',
      city: '',
      state: '',
      postalCode: '',
      phoneNumber: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/addresses', formData);
      setAddresses(res.data); // backend returns updated list
      setIsAdding(false);
    } catch (err) {
      console.error('Error adding address', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await api.delete(`/addresses/${id}`);
      setAddresses(res.data);
    } catch (err) {
      console.error('Error deleting address', err);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-marcellus text-2xl md:text-3xl text-slate-900">My Addresses</h2>
        <button
          onClick={handleAddAddress}
          className="bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-700 transition text-sm uppercase tracking-widest"
        >
          Add New Address
        </button>
      </div>

      {/* Add Address Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border p-6 rounded-lg">
          <div className="md:col-span-2">
            <label className="block mb-1">Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded" />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">Address Line 1</label>
            <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">City</label>
            <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">State</label>
            <input type="text" name="state" value={formData.state} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">Postal Code</label>
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">Phone Number</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded" />
          </div>
          <div className="md:col-span-2 flex gap-4 pt-4">
            <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded hover:bg-slate-700">Save</button>
            <button type="button" onClick={() => setIsAdding(false)} className="border px-6 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}

      {/* Addresses List */}
      {loading ? (
        <p>Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <p>No addresses found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map(addr => (
            <div key={addr._id} className="border rounded-lg p-5">
              <h3 className="font-medium">{addr.fullName}</h3>
              <p className="text-slate-600 mt-2">
                {addr.addressLine1}
                <br />
                {addr.city}, {addr.state} {addr.postalCode}
              </p>
              <p className="text-slate-600 mt-2">{addr.phoneNumber}</p>
              <div className="flex space-x-4 mt-4">
                <button onClick={() => handleDelete(addr._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAddresses;
