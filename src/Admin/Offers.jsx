import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [formData, setFormData] = useState({
        image: null,
        description: '',
        is_active: true
    });

    const baseUrl = 'https://mahaspice.desoftimp.com/ms3/';

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const response = await fetch(`${baseUrl}get_offers.php`);
            const data = await response.json();
            if (Array.isArray(data.offers)) {
                setOffers(data.offers);
            } else {
                setOffers([]);
            }
        } catch (error) {
            console.error('Error fetching offers:', error);
            setOffers([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataObj = new FormData();
        formDataObj.append('image', formData.image);
        formDataObj.append('description', formData.description);
        formDataObj.append('is_active', formData.is_active ? '1' : '0');

        try {
            const response = await fetch(`${baseUrl}add_offers.php`, {
                method: 'POST',
                body: formDataObj
            });
            const data = await response.json();
            if (data.success) {
                fetchOffers();
                setShowAddModal(false);
                setFormData({ image: null, description: '', is_active: true });
            }
        } catch (error) {
            console.error('Error adding offer:', error);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const formDataObj = new FormData();
        formDataObj.append('id', selectedOffer.id);
        formDataObj.append('description', formData.description);
        formDataObj.append('is_active', formData.is_active ? '1' : '0');
        if (formData.image) {
            formDataObj.append('image', formData.image);
        }

        try {
            const response = await fetch(`${baseUrl}update_offers.php`, {
                method: 'POST',
                body: formDataObj
            });
            const data = await response.json();
            if (data.success) {
                fetchOffers();
                setShowEditModal(false);
            }
        } catch (error) {
            console.error('Error updating offer:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            try {
                const response = await fetch(`${baseUrl}delete_offers.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id })
                });
                const data = await response.json();
                if (data.success) {
                    fetchOffers();
                }
            } catch (error) {
                console.error('Error deleting offer:', error);
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, image: file }));
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Offers Management</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <Plus size={20} /> Add New Offer
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offers && offers.map(offer => (
                    <div key={offer.id} className="border rounded-lg p-4">
                        <img
                            src={`${baseUrl}uploads/offers/${offer.img_address}`}
                            alt="Offer"
                            className="w-full h-48 object-contain rounded mb-2"
                        />
                        <p className="mb-2">{offer.description}</p>
                        <div className="flex justify-between items-center">
                            <span className={`px-2 py-1 rounded ${offer.is_active === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {offer.is_active === '1' ? 'Active' : 'Inactive'}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedOffer(offer);
                                        setFormData({
                                            description: offer.description,
                                            is_active: offer.is_active === '1',
                                            image: null
                                        });
                                        setShowEditModal(true);
                                    }}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                                >
                                    <Pencil size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(offer.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Add New Offer</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="mr-2"
                                    />
                                    Active
                                </label>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Add Offer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Offer</h2>
                        <form onSubmit={handleEdit}>
                            <div className="mb-4">
                                <label className="block mb-2">Image (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="mr-2"
                                    />
                                    Active
                                </label>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Update Offer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Offers;