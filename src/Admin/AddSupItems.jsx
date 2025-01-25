import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Filter, Search, X, CheckCircle2, XCircle } from 'lucide-react';

const SuperfastItems = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [uniqueTypes, setUniqueTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [newItem, setNewItem] = useState({
        id: null,
        type: '',
        category_id: '',
        item_name: '',
        item_price: '',
        is_veg: ''
    });
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [error, setError] = useState('');

    // Fetch unique types from categories
    const fetchUniqueTypes = (categoriesData) => {
        const types = [...new Set(categoriesData.map(category => category.type))];
        setUniqueTypes(types);
    };

    // Updated fetchCategories to handle unique types
    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://mahaspice.desoftimp.com/ms3/getsf_categories.php');
            if (response.data.success) {
                setCategories(response.data.categories);
                fetchUniqueTypes(response.data.categories);
            } else {
                console.error('Categories fetch error:', response.data.message);
                setError(response.data.message || 'Failed to fetch categories');
            }
        } catch (err) {
            console.error('Fetch categories error:', err);
            setError(err.response?.data?.message || 'Failed to fetch categories');
        }
    };

    // Initial data fetching
    useEffect(() => {
        fetchCategories();
        fetchItems();
    }, []);

    // Filter categories based on selected type
    useEffect(() => {
        if (newItem.type) {
            const filtered = categories.filter(category =>
                category.type === newItem.type
            );
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories([]);
        }
    }, [newItem.type, categories]);

    // Filter items based on search and type
    useEffect(() => {
        const filtered = items.filter(item => {
            const matchesSearch =
                item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category_name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = !selectedType || item.type === selectedType;

            return matchesSearch && matchesType;
        });

        setFilteredItems(filtered);
    }, [searchTerm, selectedType, items]);

    // Fetch items
    const fetchItems = async () => {
        try {
            const response = await axios.get('https://mahaspice.desoftimp.com/ms3/getsf_items_with_category.php');
            if (response.data.success) {
                setItems(response.data.items);
                setFilteredItems(response.data.items);
            } else {
                console.error('Items fetch error:', response.data.message);
                setError(response.data.message || 'Failed to fetch items');
            }
        } catch (err) {
            console.error('Fetch items error:', err);
            setError(err.response?.data?.message || 'Failed to fetch items');
        }
    };

    // Edit item handler
    const handleEdit = (item) => {
        setCurrentItem(item);
        setNewItem({
            id: item.id,
            type: item.type,
            category_id: item.category_id,
            item_name: item.item_name,
            item_price: item.item_price,
            is_veg: item.is_veg
        });
        setIsModalOpen(true);
    };

    // Delete item handler
    const handleDelete = async (itemId) => {
        try {
            const response = await axios.post('https://mahaspice.desoftimp.com/ms3/sf_delete_items.php', { item_id: itemId });
            if (response.data.success) {
                fetchItems();
            }
        } catch (err) {
            setError('Failed to delete item');
        }
    };

    // Input change handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = newItem.id
                ? 'https://mahaspice.desoftimp.com/ms3/sf_update_item.php'
                : 'https://mahaspice.desoftimp.com/ms3/sf_add_items.php';

            const response = await axios.post(url, newItem);
            if (response.data.success) {
                fetchItems();
                setIsModalOpen(false);
                setNewItem({
                    id: null,
                    type: '',
                    category_id: '',
                    item_name: '',
                    item_price: '',
                    is_veg: ''
                });
                setCurrentItem(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save item');
        }
    };

    // Reset form
    const resetForm = () => {
        setNewItem({
            id: null,
            type: '',
            category_id: '',
            item_name: '',
            item_price: '',
            is_veg: ''
        });
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-around items-center mb-6 bg-white p-4 rounded-lg shadow">
                    <h2 className="text-2xl font-bold text-gray-800">Superfast Items</h2>
                    <div className="flex items-center space-x-4">
                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search items with name or Category"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className=" w-80 border border-gray-300 rounded-md p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-2 top-3 text-gray-500" size={20} />
                        </div>

                        
                        {/* Type Filter */}
                        <div className="relative flex items-center space-x-3">
                            {/* Icon */}
                            <Filter className="absolute left-5 text-gray-500" size={20} />

                            {/* Select Dropdown */}
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-52 border border-gray-300 rounded-md pl-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Types</option>
                                {uniqueTypes.map((type, index) => (
                                    <option key={`filter-type-${index}`} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* Add New Item Button */}
                        <button
                            onClick={() => {
                                resetForm();
                                setIsModalOpen(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full flex items-center shadow-md transition"
                        >
                            <Plus className="mr-2" /> Add New Item
                        </button>
                    </div>
                </div>

                {/* Error Handling */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
                        <XCircle className="mr-2 text-red-600" />
                        {error}
                    </div>
                )}

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map(item => (
                        <div
                            key={`item-${item.id}`}
                            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition transform hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-lg">{item.item_name}</h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="text-blue-600 hover:text-blue-800 transition"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-600 hover:text-red-800 transition"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>Type: {item.type}</p>
                                <p>Category: {item.category_name}</p>
                                <p>Price: ₹{parseFloat(item.item_price).toFixed(2)}</p>
                                <p className={`font-semibold flex items-center ${item.is_veg === 'veg' ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.is_veg === 'veg' ? <CheckCircle2 className="mr-1" size={16} /> : <XCircle className="mr-1" size={16} />}
                                    {item.is_veg.toUpperCase()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal for Add/Edit Item */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl w-96 p-6 relative">
                            <button
                                onClick={resetForm}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
                                {newItem.id ? 'Edit Item' : 'Create New Item'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Type Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Type</label>
                                    <select
                                        name="type"
                                        value={newItem.type}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        {uniqueTypes.map((type, index) => (
                                            <option key={`type-select-${index}`} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Category Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        name="category_id"
                                        value={newItem.category_id}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                                {/* Item Name Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                    <input
                                        type="text"
                                        name="item_name"
                                        value={newItem.item_name}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Price Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Price</label>
                                    <input
                                        type="number"
                                        name="item_price"
                                        value={newItem.item_price}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                {/* Veg/Non-Veg Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Veg/Non-Veg</label>
                                    <div className="flex space-x-4">
                                        {['veg', 'non-veg'].map(type => (
                                            <label key={`veg-type-${type}`} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="is_veg"
                                                    value={type}
                                                    checked={newItem.is_veg === type}
                                                    onChange={handleInputChange}
                                                    className="mr-2 focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                                <span className={`capitalize ${type === 'veg' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {type}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {newItem.id ? 'Update Item' : 'Add Item'}
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