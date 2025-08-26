import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/AxiosAPI';
const AdminProductEditPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [basePrice, setBasePrice] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [customizations, setCustomizations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/api/products/${productId}`);
                setName(data.name);
                setBasePrice(data.basePrice);
                setImageUrl(data.imageUrl);
                setCategory(data.category);
                setDescription(data.description);
                setCustomizations(data.customizations || []);
                setLoading(false);
            } catch (err) {
                setError('Product not found or error fetching data.');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true);
        try {
            await api.put(
                `/products/${productId}`,
                { name, basePrice, imageUrl, category, description, customizations }
            );
            setLoadingUpdate(false);
            navigate('/admin/productlist');
        } catch (err) {
            alert('Product could not be updated.');
            setLoadingUpdate(false);
        }
    };

    // --- Handlers for Customizations ---
    const addCustomization = () => {
        setCustomizations([...customizations, { name: '', options: [] }]);
    };

    const handleCustomizationNameChange = (index, value) => {
        const newCustomizations = [...customizations];
        newCustomizations[index].name = value;
        setCustomizations(newCustomizations);
    };

    const addOption = (custIndex) => {
        const newCustomizations = [...customizations];
        newCustomizations[custIndex].options.push({ optionName: '', additionalPrice: 0 });
        setCustomizations(newCustomizations);
    };

    const handleOptionChange = (custIndex, optIndex, field, value) => {
        const newCustomizations = [...customizations];
        newCustomizations[custIndex].options[optIndex][field] = value;
        setCustomizations(newCustomizations);
    };

    const removeOption = (custIndex, optIndex) => {
        const newCustomizations = [...customizations];
        newCustomizations[custIndex].options.splice(optIndex, 1);
        setCustomizations(newCustomizations);
    };

    const removeCustomization = (custIndex) => {
        const newCustomizations = [...customizations];
        newCustomizations.splice(custIndex, 1);
        setCustomizations(newCustomizations);
    };


    return (
        <div className="bg-[#f2f2f2] min-h-screen">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <Link to="/admin/productlist" className="text-sm font-bold text-slate-600 hover:text-slate-900 mb-4 inline-block">
                    &larr; Go Back
                </Link>
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h1 className="font-marcellus text-3xl sm:text-4xl text-slate-900 mb-6">
                        Edit Product
                    </h1>

                    {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                        <form onSubmit={submitHandler}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Details */}
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-bold text-slate-700">Name</label>
                                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="basePrice" className="block mb-2 text-sm font-bold text-slate-700">Base Price</label>
                                    <input type="number" id="basePrice" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="imageUrl" className="block mb-2 text-sm font-bold text-slate-700">Image URL</label>
                                    <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="category" className="block mb-2 text-sm font-bold text-slate-700">Category</label>
                                    <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block mb-2 text-sm font-bold text-slate-700">Description</label>
                                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full p-2 border border-slate-300 rounded-md"></textarea>
                                </div>
                            </div>

                            {/* Customizations Section */}
                            <div className="mt-8 border-t pt-6">
                                <h2 className="font-marcellus text-2xl text-slate-900 mb-4">Customizations</h2>
                                {customizations.map((cust, custIndex) => (
                                    <div key={custIndex} className="bg-slate-50 p-4 rounded-md mb-4 border">
                                        <div className="flex justify-between items-center mb-4">
                                            <input
                                                type="text"
                                                placeholder="Customization Name (e.g., Fabric)"
                                                value={cust.name}
                                                onChange={(e) => handleCustomizationNameChange(custIndex, e.target.value)}
                                                className="w-full p-2 border border-slate-300 rounded-md font-semibold"
                                            />
                                            <button type="button" onClick={() => removeCustomization(custIndex)} className="ml-4 text-red-500 hover:text-red-700 font-bold">Remove</button>
                                        </div>
                                        {cust.options.map((opt, optIndex) => (
                                            <div key={optIndex} className="flex items-center space-x-2 mb-2">
                                                <input type="text" placeholder="Option Name" value={opt.optionName} onChange={(e) => handleOptionChange(custIndex, optIndex, 'optionName', e.target.value)} className="w-1/2 p-2 border border-slate-200 rounded-md text-sm" />
                                                <input type="number" placeholder="Additional Price" value={opt.additionalPrice} onChange={(e) => handleOptionChange(custIndex, optIndex, 'additionalPrice', e.target.value)} className="w-1/3 p-2 border border-slate-200 rounded-md text-sm" />
                                                <button type="button" onClick={() => removeOption(custIndex, optIndex)} className="text-red-500 text-xs">Remove</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addOption(custIndex)} className="mt-2 text-sm text-blue-600 hover:underline">+ Add Option</button>
                                    </div>
                                ))}
                                <button type="button" onClick={addCustomization} className="w-full p-2 border-2 border-dashed rounded-md hover:bg-slate-100 transition-colors">+ Add Customization Category</button>
                            </div>

                            <button type="submit" className="mt-8 w-full bg-slate-900 text-white font-bold py-3 px-8 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50" disabled={loadingUpdate}>
                                {loadingUpdate ? 'Updating...' : 'Update Product'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProductEditPage;
