import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader } from 'lucide-react';

const EditHomeItems = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category_type: '',
        veg_non: 'veg',
        image_path: ''
    });
    const [currentImage, setCurrentImage] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const itemResponse = await fetch(`https://mahaspice.desoftimp.com/ms3/getHomeItemsById.php?id=${id}`);
                const itemData = await itemResponse.json();

                const categoryResponse = await fetch('https://mahaspice.desoftimp.com/ms3/getHomeCategory.php');
                const categoryData = await categoryResponse.json();

                if (itemData.success && categoryData.success) {
                    const item = itemData.item;
                    setFormData({
                        title: item.title || '',
                        price: item.price || '',
                        category_type: item.category_type || '',
                        veg_non: item.veg_non || 'veg',
                        image_path: item.image_path || ''
                    });

                    setCategories(categoryData.categories || []);

                    if (item.image_path) {
                        setCurrentImage(`https://mahaspice.desoftimp.com/ms3/uploads/homeCategory/${item.image_path}`);
                    }
                }
            } catch (error) {
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

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
            setNewImage(file);
            const previewUrl = URL.createObjectURL(file);
            setCurrentImage(previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });
            formDataToSend.append('id', id);
            
            if (newImage) {
                formDataToSend.append('image', newImage);
            }

            const response = await fetch('https://mahaspice.desoftimp.com/ms3/updateHomeItem.php', {
                method: 'POST',
                body: formDataToSend,
            });

            const data = await response.json();
            if (data.success) {
                navigate('/');
            } else {
                setError(data.message || 'Failed to update item');
            }
        } catch (error) {
            setError('Failed to update item');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="animate-spin w-8 h-8 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Edit Menu Item</h1>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price (₹)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                name="category_type"
                                value={formData.category_type}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.category_type}>
                                        {category.category_type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                                name="veg_non"
                                value={formData.veg_non}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                                <option value="veg">Veg</option>
                                <option value="non-veg">Non-veg</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image
                            </label>
                            {currentImage && (
                                <img 
                                    src={currentImage} 
                                    alt="Current" 
                                    className="w-32 h-32 object-cover rounded-lg mb-2"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 transition-colors"
                        >
                            {isSaving ? (
                                <>
                                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditHomeItems;