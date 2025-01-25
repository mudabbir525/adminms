import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, CheckCircle, XCircle, Calendar, Tag } from 'lucide-react';

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    termsAndConditions: '',
    startDate: '',
    endDate: '',
    image: null,
    isActive: false
});
    const [editingOffer, setEditingOffer] = useState(null);
    const [alert, setAlert] = useState({ type: '', message: '' });

    // Alert display function
    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert({ type: '', message: '' }), 3000);
    };

    // Fetch offers
    const fetchOffers = async () => {
        try {
            const response = await axios.get('https://mahaspice.desoftimp.com/ms3/get_offers.php');
            setOffers(response.data.offers || []); 
        } catch (error) {
            console.error('Error fetching offers', error);
            showAlert('error', 'Failed to fetch offers');
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' 
                ? checked 
                : type === 'file' 
                    ? files[0] 
                    : (value || null)
        }));
    };

    // Submit offer
    const handleSubmitOffer = async (e) => {
        e.preventDefault();
        
        const formDataToSubmit = new FormData();
        
        // Construct full description
        const fullDescription = `**Offer Description: ${formData.title || ''}**

**Short Description:**
${formData.shortDescription || ''}

**Terms and Conditions:**
${formData.termsAndConditions || ''}`;

        // Append form data
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'image' && value) {
                formDataToSubmit.append('image', value);
            } else if (key !== 'image') {
                formDataToSubmit.append(key, 
                    value === null || value === '' ? '' : value
                );
            }
        });

        formDataToSubmit.append('description', fullDescription);
        formDataToSubmit.append('is_active', formData.isActive ? 1 : 0);

        try {
            const url = editingOffer 
                ? `https://mahaspice.desoftimp.com/ms3/update_offers.php?id=${editingOffer}`
                : 'https://mahaspice.desoftimp.com/ms3/add_offers.php';

            await axios.post(url, formDataToSubmit, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Reset form
            setFormData({
                title: '',
                shortDescription: '',
                termsAndConditions: '',
                startDate: '',
                endDate: '',
                image: null,
                isActive: true
            });
            setEditingOffer(null);
            fetchOffers();
            
            showAlert('success', editingOffer ? 'Offer updated successfully' : 'Offer added successfully');
        } catch (error) {
            console.error('Error submitting offer', error);
            showAlert('error', 'Failed to submit offer');
        }
    };

    // Edit offer
    const handleEditOffer = async (id) => {
        try {
            const response = await axios.get(`https://mahaspice.desoftimp.com/ms3/get_offer_by_id.php?id=${id}`);
            const offer = response.data.offer;
            
            // Parse description
            const descriptionParts = offer.description.split('**Terms and Conditions:**');
            const titleMatch = offer.description.match(/\*\*Offer Description: (.*?)\*\*/);
            const shortDescriptionMatch = offer.description.match(/\*\*Short Description:\n(.*?)\n\*\*/s);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setFormData({
                title: titleMatch ? titleMatch[1] : '',
                shortDescription: shortDescriptionMatch ? shortDescriptionMatch[1].trim() : '',
                termsAndConditions: descriptionParts[1] ? descriptionParts[1].trim() : '',
                startDate: offer.start_date || '',
                endDate: offer.end_date || '',
                image: null,
                isActive: offer.is_active === '1'
            });
            setEditingOffer(id);
        } catch (error) {
            console.error('Error fetching offer details', error);
            showAlert('error', 'Failed to fetch offer details');
        }
    };

    // Delete offer
    const handleDeleteOffer = async (id) => {
    try {
        const response = await axios.post('https://mahaspice.desoftimp.com/ms3/delete_offers.php', 
            { id }, 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        if (response.data.success) {
            fetchOffers();
            showAlert('success', 'Offer deleted successfully');
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error deleting offer', error);
        showAlert('error', error.response?.data?.message || 'Failed to delete offer');
    }
};

    return (
        <div className="p-6 bg-gray-100 min-h-screen relative">
            {/* Alert Notification */}
            {alert.message && (
                <div className={`
                    fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg 
                    ${alert.type === 'success' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'}
                `}>
                    <div className="flex items-center">
                        {alert.type === 'success' ? <CheckCircle className="mr-2 h-5 w-5" /> : <XCircle className="mr-2 h-5 w-5" />}
                        {alert.message}
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                {/* Offer Form */}
                <form onSubmit={handleSubmitOffer} className="p-6 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Offer Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                required
                            />
                        </div>

                        {/* Short Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Short Description
                            </label>
                            <input
                                type="text"
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pl-10"
                                />
                                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pl-10"
                                />
                                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Terms and Conditions
                            </label>
                            <textarea
                                name="termsAndConditions"
                                value={formData.termsAndConditions}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                rows="6"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Offer Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleInputChange}
                                className="mt-1 block w-full text-sm text-gray-500 
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-violet-50 file:text-violet-700
                                    hover:file:bg-violet-100"
                            />
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                                Active Offer
                            </label>
                        </div>
                    </div>
                    
                    {/* Submit Buttons */}
                    <div className="mt-6 flex space-x-4">
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            {editingOffer ? 'Update Offer' : 'Add Offer'}
                        </button>
                        {editingOffer && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingOffer(null);
                                    setFormData({
                                        title: '',
                                        shortDescription: '',
                                        termsAndConditions: '',
                                        startDate: '',
                                        endDate: '',
                                        image: null,
                                        isActive: false
                                    });
                                }}
                                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {/* Offers List */}
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Tag className="mr-2 h-6 w-6 text-indigo-600" />
                        Current Offers
                    </h2>
                    {offers.length === 0 ? (
                        <p className="text-gray-500">No offers found</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {offers.map((offer) => (
                                <div 
                                    key={offer.id} 
                                    className="bg-white border rounded-lg shadow-md overflow-hidden"
                                >
                                    {offer.img_address && (
                                        <img 
                                            src={`https://mahaspice.desoftimp.com/ms3/${offer.img_address}`} 
                                            alt="Offer" 
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span 
                                                className={`text-xs px-2 py-1 rounded ${
                                                    offer.is_active === '1'
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {offer.is_active === '1' ? 'Active' : 'Inactive'}
                                            </span>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditOffer(offer.id)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                    title="Edit Offer"
                                                >
                                                    <Edit2 className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOffer(offer.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Delete Offer"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                            {offer.description}
                                        </p>
                                        {offer.start_date && offer.end_date && (
                                            <div className="mt-2 text-xs text-gray-500 flex items-center">
                                                <Calendar className="mr-1 h-4 w-4" />
                                                {offer.start_date} to {offer.end_date}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Offers;