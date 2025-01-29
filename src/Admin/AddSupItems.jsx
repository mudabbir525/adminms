import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Filter, Search, X, CheckCircle2, XCircle } from 'lucide-react';
import EventSelectionForm from './EventSelectionForm';

const SuperfastItems = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [uniqueTypes, setUniqueTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [error, setError] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

    const [newItem, setNewItem] = useState({
        id: '',
        type: '',
        category_id: '',
        event_name: '',
        event_category: '',
        item_name: '',
        item_price: '',
        is_veg: ''
    });

    const BASE_URL = 'https://mahaspice.desoftimp.com/ms3/';

    // Fetch initial data
    useEffect(() => {
        fetchCategories();
        fetchItems();
    }, []);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}getsf_categories.php`);
            if (response.data.success) {
                setCategories(response.data.categories);
                const types = [...new Set(response.data.categories.map(category => category.type))];
                setUniqueTypes(types);
            } else {
                setError(response.data.message || 'Failed to fetch categories');
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to fetch categories');
        }
    };

    // Fetch items
    const fetchItems = async () => {
        try {
            const response = await axios.get(`${BASE_URL}getsf_items_with_category.php`);
            if (response.data.success) {
                setItems(response.data.items);
                setFilteredItems(response.data.items);
            } else {
                setError(response.data.message || 'Failed to fetch items');
            }
        } catch (err) {
            console.error('Error fetching items:', err);
            setError('Failed to fetch items');
        }
    };

    // Filter categories based on type
    useEffect(() => {
        if (newItem.type) {
            const filtered = categories.filter(category => category.type === newItem.type);
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories([]);
        }
    }, [newItem.type, categories]);

    // Filter items based on search and filters
    useEffect(() => {
        const filtered = items.filter(item => {
            const matchesSearch = 
                item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.event_name?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = !selectedType || item.type === selectedType;
            const matchesEvent = !selectedEvent || item.event_name === selectedEvent;

            return matchesSearch && matchesType && matchesEvent;
        });

        setFilteredItems(filtered);
    }, [searchTerm, selectedType, selectedEvent, items]);

    // Handle event selection
    const handleEventSelect = ({ event_name, event_category }) => {
        console.log('Event selected:', { event_name, event_category }); // Debug log
        setNewItem(prev => ({
            ...prev,
            event_name: event_name || '',
            event_category: event_category || ''
        }));
    };

    // Handle edit item
    const handleEdit = (item) => {
        setCurrentItem(item);
        setNewItem({
            id: item.id,
            type: item.type,
            category_id: item.category_id,
            event_name: item.event_name,
            event_category: item.event_category,
            item_name: item.item_name,
            item_price: item.item_price,
            is_veg: item.is_veg
        });
        setIsModalOpen(true);
    };

    // Handle delete item
    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await axios.post(`${BASE_URL}sf_delete_items.php`, { item_id: itemId });
                if (response.data.success) {
                    fetchItems();
                    setError('');
                } else {
                    setError(response.data.message || 'Failed to delete item');
                }
            } catch (err) {
                console.error('Error deleting item:', err);
                setError('Failed to delete item');
            }
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Submitting item data:', newItem); // Debug log

            // Validate required fields
            if (!newItem.category_id || !newItem.item_name || !newItem.item_price || !newItem.is_veg) {
                setError('Please fill in all required fields');
                return;
            }

            const url = newItem.id
                ? `${BASE_URL}sf_update_item.php`
                : `${BASE_URL}sf_add_items.php`;

            const response = await axios.post(url, newItem);
            console.log('Server response:', response.data); // Debug log

            if (response.data.success) {
                await fetchItems();
                setIsModalOpen(false);
                setNewItem({
                    id: null,
                    type: '',
                    category_id: '',
                    event_name: '',
                    event_category: '',
                    item_name: '',
                    item_price: '',
                    is_veg: ''
                });
                setCurrentItem(null);
                setError('');
            } else {
                setError(response.data.message || 'Failed to save item');
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            setError(err.response?.data?.message || 'Failed to save item');
        }
    };

    // Reset form
    const resetForm = () => {
        setNewItem({
            id: null,
            type: '',
            category_id: '',
            event_name: '',
            event_category: '',
            item_name: '',
            item_price: '',
            is_veg: ''
        });
        setCurrentItem(null);
        setIsModalOpen(false);
        setError('');
    };

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
                    <h2 className="text-2xl font-bold text-gray-800">Superfast Items</h2>
                    <div className="flex items-center space-x-4">
                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 border border-gray-300 rounded-md p-2 pl-8"
                            />
                            <Search className="absolute left-2 top-3 text-gray-400" size={16} />
                        </div>

                        {/* Filters */}
                        <div className="flex space-x-2">
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="border border-gray-300 rounded-md p-2"
                            >
                                <option value="">All Types</option>
                                {uniqueTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>

                            <select
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                className="border border-gray-300 rounded-md p-2"
                            >
                                <option value="">All Events</option>
                                {[...new Set(items.map(item => item.event_name))].map((event, index) => (
                                    <option key={index} value={event}>{event}</option>
                                ))}
                            </select>
                        </div>

                        {/* Add New Item Button */}
                        <button
                            onClick={() => {
                                resetForm();
                                setIsModalOpen(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                        >
                            <Plus size={20} className="mr-2" />
                            Add New Item
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map(item => (
                        <div key={item.id} className="bg-white rounded-lg shadow p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{item.item_name}</h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p>Event: {item.event_name }</p>
                                <p>Event Category: {item.event_category}</p>
                                <p>Type: {item.type}</p>
                                <p>Category: {item.category_name}</p>
                                <p>Price: ₹{parseFloat(item.item_price).toFixed(2)}</p>
                                <p className={`flex items-center ${
                                    item.is_veg === 'veg' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {item.is_veg === 'veg' ? 
                                        <CheckCircle2 className="mr-1" size={16} /> : 
                                        <XCircle className="mr-1" size={16} />
                                    }
                                    {item.is_veg.toUpperCase()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-96 max-w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">
                                    {currentItem ? 'Edit Item' : 'Add New Item'}
                                </h3>
                                <button
                                    onClick={resetForm}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Event Selection */}
                                <EventSelectionForm 
                                    onEventSelect={handleEventSelect}
                                    initialValues={currentItem}
                                />

                                {/* Type Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type
                                    </label>
                                    <select
                                        name="type"
                                        value={newItem.type}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        {uniqueTypes.map((type, index) => (
                                            <option key={`type-${index}`} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Category Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        name="category_id"
                                        value={newItem.category_id}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                                        disabled={!newItem.type}
                                        required
                                    >
                                        <option value="">
                                            {newItem.type ? 'Select Category' : 'Select Type First'}
                                        </option>
                                        {filteredCategories.map((category) => (
                                            <option key={`category-${category.id}`} value={category.id}>
                                                {category.category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Item Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Item Name
                                    </label>
                                    <input
                                        type="text"
                                        name="item_name"
                                        value={newItem.item_name}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Item Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="item_price"
                                        value={newItem.item_price}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>

                                {/* Veg/Non-Veg Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type
                                    </label>
                                    <div className="flex space-x-4">
                                        {['veg', 'non-veg'].map((type) => (
                                            <label key={type} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="is_veg"
                                                    value={type}
                                                    checked={newItem.is_veg === type}
                                                    onChange={handleInputChange}
                                                    className="mr-2"
                                                    required
                                                />
                                                <span className={`capitalize ${
                                                    type === 'veg' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {type}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {currentItem ? 'Update Item' : 'Add Item'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperfastItems;