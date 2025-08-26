import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // Using the global axios instance

const MyMeasurements = () => {
    const [measurements, setMeasurements] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Form state for new measurements
    const [formData, setFormData] = useState({
        profileName: 'My Measurements',
        neck: '',
        chest: '',
        waist: '',
        hips: '',
        sleeveLength: '',
        shoulderWidth: '',
        shirtLength: '',
        trouserLength: '',
        inseam: '',
    });

    useEffect(() => {
        const fetchMeasurements = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/measurements');
                if (data) {
                    setMeasurements(data);
                    setFormData(data); // Pre-fill the form with existing data
                }
                setLoading(false);
            } catch (err) {
                setError('Could not fetch measurements. Please add your measurements below.');
                setLoading(false);
            }
        };
        fetchMeasurements();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/measurements', formData);
            setMeasurements(data);
            setIsEditing(false); // Exit edit mode after saving
            alert('Measurements saved successfully!');
        } catch (err) {
            alert('Error saving measurements.');
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow-lg border border-white/20" data-aos="fade-up">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                <h2 className="font-marcellus text-3xl text-slate-900">My Measurements</h2>
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="bg-slate-900 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-800 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
            </div>
            
            {loading ? <p>Loading measurements...</p> : error && !measurements._id ? <p className="text-center text-slate-500 mb-6">{error}</p> : null}

            <form onSubmit={submitHandler}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Map over the schema fields to generate inputs */}
                    {Object.keys(formData).filter(key => key !== '_id' && key !== 'user' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt').map(key => (
                         <div key={key}>
                            <label htmlFor={key} className="block text-sm font-bold text-slate-600 mb-2 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            <input 
                                type={key === 'profileName' ? 'text' : 'number'}
                                id={key}
                                name={key}
                                value={formData[key] || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full p-3 border border-slate-300 rounded-md disabled:bg-slate-100"
                                placeholder="Inches"
                            />
                        </div>
                    ))}
                </div>
                 {isEditing && (
                  <div className="mt-8 text-right">
                    <button type="submit" className="bg-amber-500 text-slate-900 font-bold py-2 px-6 rounded-md hover:bg-amber-600 transition-colors">
                      Save Measurements
                    </button>
                  </div>
                )}
            </form>
        </div>
    );
};

export default MyMeasurements;
