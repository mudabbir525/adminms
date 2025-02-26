import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditSectionThree = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [updateStatus, setUpdateStatus] = useState({});

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('https://adminmahaspice.in/ms3/getSectionThree.php');
            setItems(response.data);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to fetch items');
        }
    };

    const handleImageUpdate = async (id, imageFile) => {
        if (!imageFile) return;

        setUpdateStatus(prev => ({ ...prev, [id]: 'saving' }));

        try {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('image', imageFile);

            const response = await axios.post('https://adminmahaspice.in/ms3/updateSectionThree.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success) {
                setUpdateStatus(prev => ({ ...prev, [id]: 'success' }));
                await fetchItems(); // Refresh the items
                setTimeout(() => {
                    setUpdateStatus(prev => ({ ...prev, [id]: '' }));
                }, 2000);
            } else {
                throw new Error(response.data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUpdateStatus(prev => ({ ...prev, [id]: 'error' }));
            setTimeout(() => {
                setUpdateStatus(prev => ({ ...prev, [id]: '' }));
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Section Three</h1>
                    <p className="text-gray-600">Update images for section three content</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="relative group">
                                <img
                                    src={`https://adminmahaspice.in/ms3/${item.image}?${new Date().getTime()}`}
                                    alt={item.title}
                                    className="w-full h-48 object-cover"
                                />
                                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <span className="bg-white text-gray-800 px-4 py-2 rounded-md">
                                        Change Image
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpdate(item.id, e.target.files[0])}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">{item.title}</h3>
                                
                                {updateStatus[item.id] && (
                                    <div className={`mt-3 text-center text-sm ${
                                        updateStatus[item.id] === 'success' ? 'text-green-600' : 
                                        updateStatus[item.id] === 'error' ? 'text-red-600' : 
                                        'text-blue-600'
                                    }`}>
                                        {updateStatus[item.id] === 'success' ? '✓ Updated successfully' :
                                        updateStatus[item.id] === 'error' ? '✗ Update failed' :
                                        'Saving...'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditSectionThree;


