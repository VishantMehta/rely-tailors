import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, UploadCloud, Loader2, AlertCircle, Save } from 'lucide-react';
import api from '../api/AxiosAPI';

// --- Helper Components ---

const FormCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-zinc-200/80 mb-8">
        <h2 className="font-marcellus text-2xl text-zinc-800 mb-6 border-b pb-4">{title}</h2>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const FormInput = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
    <div>
        <label className="block mb-2 text-sm font-bold text-zinc-700">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 border border-zinc-300 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 transition-all"
        />
    </div>
);

const FormTextarea = ({ label, value, onChange, rows = 4 }) => (
    <div>
        <label className="block mb-2 text-sm font-bold text-zinc-700">{label}</label>
        <textarea
            value={value}
            onChange={onChange}
            rows={rows}
            className="w-full px-4 py-2.5 border border-zinc-300 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 transition-all"
        ></textarea>
    </div>
);

const LoadingSkeleton = () => (
    <div className="animate-pulse">
        <div className="bg-zinc-200 p-6 rounded-lg mb-8">
            <div className="h-8 w-1/3 bg-zinc-300 rounded mb-6"></div>
            <div className="h-12 bg-zinc-300 rounded mb-4"></div>
            <div className="h-12 bg-zinc-300 rounded"></div>
        </div>
        <div className="bg-zinc-200 p-6 rounded-lg mb-8">
            <div className="h-8 w-1/3 bg-zinc-300 rounded mb-6"></div>
            <div className="h-40 bg-zinc-300 rounded mb-4"></div>
        </div>
    </div>
);


// --- Main Component ---

const AdminProductEditPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    // Form State
    const [name, setName] = useState('');
    const [basePrice, setBasePrice] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [gallery, setGallery] = useState([]);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [customizations, setCustomizations] = useState([]);

    // Status State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/products/${productId}`);
                setName(data.name);
                setBasePrice(data.basePrice);
                setImageUrl(data.imageUrl);
                setGallery(data.gallery || []);
                setCategory(data.category);
                setDescription(data.description);
                setCustomizations(data.customizations || []);
            } catch (err) {
                setError('Product not found or error fetching data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await api.post('/upload', formData, config);
            setImageUrl(data.image);
            setGallery(prev => [...prev, data.image]);
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true);
        try {
            await api.put(`/products/${productId}`, {
                name,
                basePrice,
                imageUrl,
                gallery,
                category,
                description,
                customizations,
            });
            navigate('/admin/productlist');
        } catch (err) {
            console.error('Product could not be updated.', err);
            setLoadingUpdate(false);
        }
    };

    // --- Handlers for Customizations ---
    const addCustomization = () => setCustomizations([...customizations, { name: '', options: [{ optionName: '', additionalPrice: 0 }] }]);
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
        <div className="bg-zinc-100 min-h-screen font-sans">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <Link to="/admin/productlist" className="text-sm font-bold text-zinc-600 hover:text-zinc-900 mb-4 inline-flex items-center gap-2 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Product List
                    </Link>
                    <h1 className="font-marcellus text-3xl sm:text-4xl text-zinc-900 mb-6">
                        Edit Product
                    </h1>

                    {loading ? <LoadingSkeleton /> : error ? (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3"><AlertCircle className="h-5 w-5" /> {error}</div>
                    ) : (
                        <form onSubmit={submitHandler}>
                            <FormCard title="Product Information">
                                <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                <FormTextarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                <FormInput label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                            </FormCard>

                            <FormCard title="Pricing & Media">
                                <FormInput label="Base Price (₹)" type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
                                <div>
                                    <label className="block mb-2 text-sm font-bold text-zinc-700">Product Image</label>
                                    <div className="flex items-center gap-4">
                                        {imageUrl && <img src={imageUrl} alt="Product preview" className="w-24 h-24 object-cover rounded-md border" />}
                                        <div className="flex-1">
                                            <FormInput label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                                            <label htmlFor="image-upload" className="mt-2 w-full text-sm text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 cursor-pointer inline-flex items-center gap-2 border p-2 rounded-lg hover:bg-zinc-50">
                                                <UploadCloud className="h-5 w-5" />
                                                <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                                            </label>
                                            <input id="image-upload" type="file" onChange={uploadFileHandler} className="hidden" disabled={uploading} />
                                        </div>
                                    </div>
                                </div>
                            </FormCard>

                            <FormCard title="Customizations">
                                <div className="space-y-6">
                                    {customizations.map((cust, custIndex) => (
                                        <motion.div key={custIndex} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-50 p-4 rounded-md border">
                                            <div className="flex justify-between items-center mb-4">
                                                <input type="text" placeholder="Customization Name (e.g., Lapel Style)" value={cust.name} onChange={(e) => handleCustomizationNameChange(custIndex, e.target.value)} className="w-full px-4 py-2 border border-zinc-300 rounded-md font-semibold focus:ring-2 focus:ring-zinc-800" />
                                                <button type="button" onClick={() => removeCustomization(custIndex)} className="ml-4 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"><Trash2 className="h-5 w-5" /></button>
                                            </div>
                                            <div className="space-y-3 pl-4 border-l-2">
                                                {cust.options.map((opt, optIndex) => (
                                                    <div key={optIndex} className="flex items-center gap-3">
                                                        <input type="text" placeholder="Option Name" value={opt.optionName} onChange={(e) => handleOptionChange(custIndex, optIndex, 'optionName', e.target.value)} className="w-1/2 p-2 border border-zinc-200 rounded-md text-sm" />
                                                        <input type="number" placeholder="Additional Price" value={opt.additionalPrice} onChange={(e) => handleOptionChange(custIndex, optIndex, 'additionalPrice', e.target.value)} className="w-1/3 p-2 border border-zinc-200 rounded-md text-sm" />
                                                        <button type="button" onClick={() => removeOption(custIndex, optIndex)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="h-4 w-4" /></button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => addOption(custIndex)} className="mt-2 text-sm text-zinc-600 hover:text-zinc-900 font-semibold inline-flex items-center gap-1"><Plus className="h-4 w-4" /> Add Option</button>
                                            </div>
                                        </motion.div>
                                    ))}
                                    <button type="button" onClick={addCustomization} className="w-full p-3 border-2 border-dashed rounded-lg hover:bg-zinc-100 transition-colors text-zinc-600 font-semibold flex items-center justify-center gap-2">
                                        <Plus className="h-5 w-5" />
                                        Add Customization Category
                                    </button>
                                </div>
                            </FormCard>

                            <div className="mt-8 flex justify-end">
                                <button type="submit" className="bg-zinc-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-zinc-700 transition-colors disabled:bg-zinc-400 flex items-center gap-2" disabled={loadingUpdate}>
                                    {loadingUpdate ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                    {loadingUpdate ? 'Updating...' : 'Update Product'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProductEditPage;