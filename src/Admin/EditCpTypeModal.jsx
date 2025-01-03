import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditCPTypeModal = ({ cpType, onClose, onUpdate = () => {} }) => {
    const [formData, setFormData] = useState({
        id: '',
        cp_name: '',
        cp_type: '',
        veg_non_veg: '',
        description: '',
        price: '',
        image: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Populate form with existing data when modal opens
        if (cpType) {
            setFormData({
                id: cpType.id || '',
                cp_name: cpType.cp_name || '',
                cp_type: cpType.cp_type || '',
                veg_non_veg: cpType.veg_non_veg || '',
                description: cpType.description || '',
                price: cpType.price || '',
                image: null
            });
            setPreviewImage(`https://mahaspice.desoftimp.com/ms3/${cpType.image_address}`);
        }
    }, [cpType]);

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
            
            // Create image preview
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
    
        try {
            const formDataToSubmit = new FormData();
            
            // Append all fields correctly
            formDataToSubmit.append('id', formData.id);
            formDataToSubmit.append('cp_name', formData.cp_name);
            formDataToSubmit.append('cp_type', formData.cp_type);
            formDataToSubmit.append('veg_non_veg', formData.veg_non_veg);
            formDataToSubmit.append('description', formData.description || '');
            formDataToSubmit.append('price', formData.price);
            
            // Append image if selected
            if (formData.image) {
                formDataToSubmit.append('image', formData.image);
            }
    
            const response = await axios.put(
                'https://mahaspice.desoftimp.com/ms3/cptypes.php', 
                formDataToSubmit,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
    
            // Call the update callback to refresh the list
            // Added safe invocation with optional chaining
            onUpdate && onUpdate();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update CP Type');
            console.error('Update error:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Edit CP Type</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">CP Name</label>
                        <input
                            type="text"
                            name="cp_name"
                            value={formData.cp_name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Type</label>
                        <input
                            type="text"
                            name="cp_type"
                            value={formData.cp_type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Veg/Non-Veg</label>
                        <select
                            name="veg_non_veg"
                            value={formData.veg_non_veg}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>

                    {/* <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        {previewImage && (
                            <img 
                                src={previewImage} 
                                alt="Preview" 
                                className="mt-2 w-32 h-32 object-cover rounded-md"
                            />
                        )}
                    </div> */}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCPTypeModal;