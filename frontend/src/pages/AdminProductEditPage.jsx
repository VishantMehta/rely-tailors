import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Plus, Trash2, UploadCloud, Loader2, AlertCircle, Save, 
    Image as ImageIcon, DollarSign, Layers, Type, FileText 
} from 'lucide-react';
import api from '../api/AxiosAPI';

// --- Helper Components ---

const FormCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-200 mb-6">
        <div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4">
            {Icon && <div className="p-2 bg-stone-50 rounded-full text-stone-500"><Icon size={18} /></div>}
            <h2 className="font-marcellus text-xl text-stone-800">{title}</h2>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const FormInput = ({ label, value, onChange, type = 'text', placeholder = '', icon: Icon }) => (
    <div>
        <label className="block mb-2 text-xs font-bold uppercase tracking-widest text-stone-500">{label}</label>
        <div className="relative">
            {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"><Icon size={16} /></div>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full ${Icon ? 'pl-10' : 'px-4'} py-3 border border-stone-200 rounded-sm bg-stone-50 text-sm focus:bg-white focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 transition-all placeholder-stone-400 text-stone-700`}
            />
        </div>
    </div>
);

const FormTextarea = ({ label, value, onChange, rows = 4 }) => (
    <div>
        <label className="block mb-2 text-xs font-bold uppercase tracking-widest text-stone-500">{label}</label>
        <textarea
            value={value}
            onChange={onChange}
            rows={rows}
            className="w-full px-4 py-3 border border-stone-200 rounded-sm bg-stone-50 text-sm focus:bg-white focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 transition-all placeholder-stone-400 text-stone-700 resize-none"
        ></textarea>
    </div>
);

const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
        <div className="h-8 w-1/4 bg-stone-200 rounded mb-8"></div>
        <div className="bg-white p-6 rounded-sm border border-stone-200 h-64"></div>
        <div className="bg-white p-6 rounded-sm border border-stone-200 h-48"></div>
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
        <div className="bg-[#FDFBF7] min-h-screen font-montserrat text-stone-800">
            <div className="container mx-auto p-4 sm:p-8 lg:p-12">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                             <Link to="/admin/productlist" className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-amber-700 mb-3 inline-flex items-center gap-2 transition-colors">
                                <ArrowLeft className="h-3 w-3" /> Back to Product List
                            </Link>
                            <h1 className="font-marcellus text-3xl sm:text-4xl text-stone-900">Edit Product</h1>
                        </div>
                        <div className="flex gap-3">
                             {/* Optional: Add 'View Live' button or similar here */}
                        </div>
                    </div>

                    {loading ? <LoadingSkeleton /> : error ? (
                        <div className="bg-red-50 text-red-700 p-4 rounded-sm border border-red-100 flex items-center gap-3">
                            <AlertCircle className="h-5 w-5" /> {error}
                        </div>
                    ) : (
                        <form onSubmit={submitHandler}>
                            
                            {/* 1. Basic Info */}
                            <FormCard title="Product Information" icon={Type}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <FormInput label="Product Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Royal Blue Silk Saree" />
                                    </div>
                                    <FormInput label="Category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Saree" icon={Layers} />
                                    <FormInput label="Base Price (₹)" type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} icon={DollarSign} />
                                    <div className="md:col-span-2">
                                        <FormTextarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={6} />
                                    </div>
                                </div>
                            </FormCard>

                            {/* 2. Media Upload */}
                            <FormCard title="Product Imagery" icon={ImageIcon}>
                                <div>
                                    <label className="block mb-3 text-xs font-bold uppercase tracking-widest text-stone-500">Main Image</label>
                                    <div className="flex flex-col sm:flex-row items-start gap-6 p-4 border border-dashed border-stone-300 rounded-sm bg-stone-50/50">
                                        <div className="w-32 h-32 bg-stone-100 border border-stone-200 rounded-sm flex items-center justify-center overflow-hidden shrink-0">
                                            {imageUrl ? (
                                                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="text-stone-300 h-10 w-10" />
                                            )}
                                        </div>
                                        <div className="flex-1 w-full">
                                            <div className="relative mb-3">
                                                 <input 
                                                    type="text" 
                                                    value={imageUrl} 
                                                    onChange={(e) => setImageUrl(e.target.value)} 
                                                    placeholder="Enter image URL or upload"
                                                    className="w-full pl-3 pr-3 py-2 text-sm border border-stone-200 rounded-sm bg-white focus:outline-none focus:border-amber-700"
                                                 />
                                            </div>
                                            <label className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold uppercase tracking-widest rounded-sm cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                                                {uploading ? 'Uploading...' : 'Choose File'}
                                                <input type="file" onChange={uploadFileHandler} className="hidden" disabled={uploading} />
                                            </label>
                                            <p className="text-xs text-stone-400 mt-2 font-light">
                                                Recommended: 800x1000px, JPG or PNG.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </FormCard>

                            {/* 3. Customizations */}
                            <FormCard title="Customization Options" icon={FileText}>
                                <div className="space-y-6">
                                    <AnimatePresence>
                                        {customizations.map((cust, custIndex) => (
                                            <motion.div 
                                                key={custIndex} 
                                                initial={{ opacity: 0, height: 0 }} 
                                                animate={{ opacity: 1, height: 'auto' }} 
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-stone-50 border border-stone-200 rounded-sm overflow-hidden"
                                            >
                                                <div className="p-4 bg-stone-100 border-b border-stone-200 flex justify-between items-center">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Customization Name (e.g. Size)" 
                                                        value={cust.name} 
                                                        onChange={(e) => handleCustomizationNameChange(custIndex, e.target.value)} 
                                                        className="bg-transparent border-none font-bold text-stone-800 placeholder-stone-400 focus:ring-0 w-2/3"
                                                    />
                                                    <button type="button" onClick={() => removeCustomization(custIndex)} className="text-stone-400 hover:text-red-600 transition-colors p-1">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                
                                                <div className="p-4 space-y-3">
                                                    {cust.options.map((opt, optIndex) => (
                                                        <div key={optIndex} className="flex items-center gap-3">
                                                            <div className="flex-1">
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="Option (e.g. Small)" 
                                                                    value={opt.optionName} 
                                                                    onChange={(e) => handleOptionChange(custIndex, optIndex, 'optionName', e.target.value)} 
                                                                    className="w-full px-3 py-2 border border-stone-200 rounded-sm text-sm focus:border-amber-700 focus:outline-none"
                                                                />
                                                            </div>
                                                            <div className="w-32 relative">
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">₹</span>
                                                                <input 
                                                                    type="number" 
                                                                    placeholder="Price" 
                                                                    value={opt.additionalPrice} 
                                                                    onChange={(e) => handleOptionChange(custIndex, optIndex, 'additionalPrice', e.target.value)} 
                                                                    className="w-full pl-6 pr-3 py-2 border border-stone-200 rounded-sm text-sm focus:border-amber-700 focus:outline-none"
                                                                />
                                                            </div>
                                                            <button type="button" onClick={() => removeOption(custIndex, optIndex)} className="text-stone-300 hover:text-red-500 p-2">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => addOption(custIndex)} className="mt-2 text-xs font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider inline-flex items-center gap-1">
                                                        <Plus size={12} /> Add Option
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    
                                    <button 
                                        type="button" 
                                        onClick={addCustomization} 
                                        className="w-full py-4 border-2 border-dashed border-stone-300 rounded-sm text-stone-500 hover:border-amber-700 hover:text-amber-700 hover:bg-stone-50 transition-all text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} /> Add Customization Category
                                    </button>
                                </div>
                            </FormCard>

                            {/* Action Bar */}
                            <div className="sticky bottom-6 bg-white p-4 rounded-sm shadow-xl border border-stone-200 flex justify-between items-center z-10">
                                <span className="text-xs text-stone-500 hidden sm:inline">Ensure all details are correct before saving.</span>
                                <div className="flex gap-3 ml-auto">
                                    <button 
                                        type="button" 
                                        onClick={() => navigate('/admin/productlist')} 
                                        className="px-6 py-3 border border-stone-300 text-stone-700 text-xs font-bold uppercase tracking-widest hover:bg-stone-50 rounded-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-8 py-3 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-amber-700 rounded-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                        disabled={loadingUpdate}
                                    >
                                        {loadingUpdate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {loadingUpdate ? 'Saving...' : 'Update Product'}
                                    </button>
                                </div>
                            </div>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProductEditPage;