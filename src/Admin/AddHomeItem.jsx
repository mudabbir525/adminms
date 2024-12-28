import React, { useState, useEffect } from 'react';

const AddHomeItems = () => {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category_type: '',
        veg_non: '',
        image: null,
    });
    const [preview, setPreview] = useState('');
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/getHomeCategory.php');
            const data = await response.json();
            if (data.success) {
                setCategories(data.categories);
            } else {
                showMessage(data.message || 'Failed to load categories.', 'error');
            }
        } catch (error) {
            showMessage('Failed to fetch categories. Please try again.', 'error');
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000); // Clear message after 5 seconds
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'price') {
            const formattedValue = value.replace(/[^0-9.]/g, '');
            if (formattedValue.split('.').length <= 2) {
                setFormData(prev => ({ ...prev, [name]: formattedValue }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showMessage('Image size should be less than 5MB', 'error');
                return;
            }
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.price || !formData.category_type || 
        !formData.veg_non || !formData.image) {
        showMessage('Please fill all required fields', 'error');
        return;
    }

    setLoading(true);
    const form = new FormData();
    Object.keys(formData).forEach(key => {
        form.append(key, formData[key]);
    });

    try {
        const response = await fetch('https://mahaspice.desoftimp.com/ms3/addHomeItem.php', {
            method: 'POST',
            body: form,
        });

        const responseText = await response.text();
        let data;
        
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Response parsing error:', responseText);
            throw new Error('Invalid server response');
        }
        
        if (data.success) {
            showMessage('Item added successfully!', 'success');
            setFormData({
                title: '',
                price: '',
                category_type: '',
                veg_non: '',
                image: null,
            });
            setPreview('');
        } else {
            throw new Error(data.message || 'Unknown error occurred');
        }
    } catch (error) {
        showMessage(error.message || 'Failed to process request', 'error');
        console.error('Submit error:', error);
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
                        <h2 className="text-4xl font-bold text-white text-center">
                            Add New Item
                        </h2>
                    </div>
                    
                    <div className="p-8">
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-xl text-center animate-fadeIn
                                ${message.type === 'success' 
                                    ? 'bg-green-50 text-green-700 border-2 border-green-200'
                                    : 'bg-red-50 text-red-700 border-2 border-red-200'
                                }`}>
                                <p className="text-sm font-medium">{message.text}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    placeholder="Enter item title"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">
                                    Price (₹)
                                </label>
                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    placeholder="Enter price"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">
                                    Category
                                </label>
                                <select
                                    name="category_type"
                                    value={formData.category_type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.category_type}>
                                            {category.category_type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">
                                    Veg/Non-Veg
                                </label>
                                <select
                                    name="veg_non"
                                    value={formData.veg_non}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                >
                                    <option value="">Select type</option>
                                    <option value="veg">Veg</option>
                                    <option value="non-veg">Non-Veg</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">
                                    Image
                                </label>
                                <div
                                    onClick={() => document.getElementById('imageUpload').click()}
                                    className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition-all duration-200"
                                >
                                    <div className="text-center">
                                        <input
                                            type="file"
                                            id="imageUpload"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <p className="text-gray-500">Click to upload image</p>
                                        <p className="text-xs text-gray-400 mt-1">Max size: 5MB</p>
                                    </div>
                                </div>
                            </div>

                            {preview && (
                                <div className="mt-4">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full max-h-64 object-contain rounded-xl shadow-lg"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full px-6 py-4 rounded-xl text-white font-bold text-lg
                                    ${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200'
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </span>
                                ) : 'Add Item'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddHomeItems;