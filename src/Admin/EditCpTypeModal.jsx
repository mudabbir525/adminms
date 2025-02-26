import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Clock, Zap, X, Save, AlertTriangle } from 'lucide-react';

const EditCPTypeModal = ({ cpType, onClose }) => {
    const modalRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [initialFormData, setInitialFormData] = useState(null);
    
    const [formData, setFormData] = useState({
        id: '',
        cp_name: '',
        cp_type: '',
        veg_non_veg: '',
        meal_time: '',
        is_superfast: '',
        description: '',
        price: '',
        image: null
    });
    const [previewImage, setPreviewImage] = useState(null);

    // Track if form has been modified
    const hasChanges = () => {
        if (!initialFormData) return false;
        return Object.keys(initialFormData).some(key => {
            if (key === 'image') return false;
            return initialFormData[key] !== formData[key];
        }) || formData.image !== null;
    };

    useEffect(() => {
        if (cpType) {
            const initialData = {
                id: cpType.id?.toString() || '',
                cp_name: cpType.cp_name || '',
                cp_type: cpType.cp_type || '',
                veg_non_veg: cpType.veg_non_veg || '',
                meal_time: cpType.meal_time || '',
                is_superfast: cpType.is_superfast || '',
                description: cpType.description || '',
                price: cpType.price?.toString() || '',
                image: null
            };
            setFormData(initialData);
            setInitialFormData(initialData);
            
            if (cpType.image_address) {
                setPreviewImage(`https://adminmahaspice.in/ms3/${cpType.image_address}`);
            }
        }
    }, [cpType]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClose = () => {
        if (hasChanges()) {
            setShowConfirmDialog(true);
        } else {
            onClose();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (!formData.id) {
                throw new Error('CP Type ID is required');
            }

            const formDataToSubmit = new FormData();
            
            // Append all form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    formDataToSubmit.append(key, value);
                }
            });

            const response = await axios({
                method: 'post',  // Changed to POST as PHP handles both PUT and POST
                url: 'https://adminmahaspice.in/ms3/editcptypes.php',
                data: formDataToSubmit,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                onClose();
                window.location.reload();
            } else {
                throw new Error(response.data.error || 'Failed to update CP Type');
            }
        } catch (err) {
            console.error('Update error:', err);
            setError(err.response?.data?.error || err.message || 'Failed to update CP Type');
        } finally {
            setIsSubmitting(false);
        }
    };

    const ConfirmDialog = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                    <h3 className="text-lg font-semibold">Unsaved Changes</h3>
                </div>
                <p className="text-gray-600 mb-6">You have unsaved changes. Do you want to save them before closing?</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => onClose()}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        Discard
                    </button>
                    <button
                        onClick={() => setShowConfirmDialog(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
            {showConfirmDialog && <ConfirmDialog />}
            
            <div 
                ref={modalRef}
                className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto relative"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Edit CP Type</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <input type="hidden" name="id" value={formData.id} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                CP Name
                            </label>
                            <input
                                type="text"
                                name="cp_name"
                                value={formData.cp_name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type
                            </label>
                            <input
                                type="text"
                                name="cp_type"
                                value={formData.cp_type}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Veg/Non-Veg
                            </label>
                            <select
                                name="veg_non_veg"
                                value={formData.veg_non_veg}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="Veg">Veg</option>
                                <option value="Non-Veg">Non-Veg</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <span className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    Meal Time
                                </span>
                            </label>
                            <select
                                name="meal_time"
                                value={formData.meal_time}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                required
                            >
                                <option value="">Select Meal Time</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <span className="flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-gray-500" />
                                    Superfast Delivery
                                </span>
                            </label>
                            <select
                                name="is_superfast"
                                value={formData.is_superfast}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                required
                            >
                                <option value="">Select Speed</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image
                        </label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                        {previewImage && (
                            <img 
                                src={previewImage} 
                                alt="Preview" 
                                className="mt-4 h-32 w-32 object-cover rounded-md border"
                            />
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCPTypeModal;