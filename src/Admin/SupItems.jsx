import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const SupItems = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [events, setEvents] = useState([]);
    const [menuTypes, setMenuTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [expandedEvents, setExpandedEvents] = useState({});
    const [formData, setFormData] = useState({
        id: null,
        category_name: '',
        event_name: '',
        item_name: '',
        price: '',
        is_veg: 'veg',
        menu_type: ''
    });

    const baseUrl = 'https://adminmahaspice.in/ms3/';

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch(`${baseUrl}getsf_items.php`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setItems(data);
            } else {
                console.error('Invalid items data format:', data);
                setItems([]);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            setItems([]);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${baseUrl}getsf_categories.php`);
            const data = await response.json();

            if (data && data.categories && Array.isArray(data.categories)) {
                const categoriesData = data.categories.map(cat => ({
                    ...cat,
                    category_name: cat.category
                }));

                const uniqueEvents = [...new Set(categoriesData.map(item => item.event_name))];
                const uniqueTypes = [...new Set(categoriesData.map(item => item.type))];

                setEvents(uniqueEvents);
                setMenuTypes(uniqueTypes);
                setCategories(categoriesData);
            } else {
                console.error('Invalid categories data format:', data);
                setCategories([]);
                setEvents([]);
                setMenuTypes([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
            setEvents([]);
            setMenuTypes([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = formData.id
            ? `${baseUrl}update_item.php`
            : `${baseUrl}add_item.php`;

        const submitData = {
            ...formData,
            is_veg: formData.is_veg === 'veg'
        };

        try {
            const response = await fetch(url, {
                method: formData.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });
            const data = await response.json();
            if (data.success) {
                setShowModal(false);
                fetchItems();
                resetForm();
            } else {
                alert(data.message || 'Error saving item');
            }
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Error saving item. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await fetch(`${baseUrl}delete_item.php`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }),
                });
                const data = await response.json();
                if (data.success) {
                    fetchItems();
                } else {
                    alert(data.message || 'Error deleting item');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Error deleting item. Please try again.');
            }
        }
    };

    const handleEdit = (item) => {
        // Find the category for this item to get the menu type
        const category = categories.find(cat => 
            cat.category_name === item.category_name && 
            cat.event_name === item.event_name
        );

        // Set the form data with all the item details
        setFormData({
            id: item.id,
            category_name: item.category_name,
            event_name: item.event_name,
            item_name: item.item_name,
            price: item.price,
            is_veg: item.is_veg ? 'veg' : 'non-veg',
            menu_type: category?.type || ''
        });

        // Show the modal
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            id: null,
            category_name: '',
            event_name: '',
            item_name: '',
            price: '',
            is_veg: 'veg',
            menu_type: ''
        });
    };

    const toggleEvent = (eventName, menuType) => {
        const key = `${eventName}-${menuType}`;
        setExpandedEvents(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const groupedItems = items.reduce((acc, item) => {
        const category = categories.find(cat =>
            cat.category_name === item.category_name &&
            cat.event_name === item.event_name
        );

        const menuType = category?.type || 'Unknown';
        const eventMenuKey = `${item.event_name}-${menuType}`;

        if (!acc[eventMenuKey]) {
            acc[eventMenuKey] = {};
        }
        if (!acc[eventMenuKey][item.category_name]) {
            acc[eventMenuKey][item.category_name] = [];
        }
        acc[eventMenuKey][item.category_name].push(item);
        return acc;
    }, {});

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Menu Items</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} /> Add Item
                </button>
            </div>

            <div className="space-y-6">
                {Object.entries(groupedItems).map(([eventMenuKey, categories]) => {
                    const [eventName, menuType] = eventMenuKey.split('-');
                    return (
                        <div key={eventMenuKey} className="bg-white shadow rounded-lg overflow-hidden">
                            <button
                                className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                                onClick={() => toggleEvent(eventName, menuType)}
                            >
                                <span className="text-xl font-semibold text-gray-800">
                                    {eventName} - {menuType}
                                </span>
                                {expandedEvents[eventMenuKey] ? <ChevronUp /> : <ChevronDown />}
                            </button>

                            {expandedEvents[eventMenuKey] && (
                                <div className="p-6 space-y-6">
                                    {Object.entries(categories).map(([categoryName, items]) => (
                                        <div key={categoryName} className="border border-gray-200 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold mb-4 text-gray-800">{categoryName}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {items.map((item) => (
                                                    <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-800">{item.item_name}</h4>
                                                                <p className="text-lg font-medium text-gray-900 mt-1">₹{item.price}</p>
                                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${item.is_veg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                    {item.is_veg ? 'Veg' : 'Non-veg'}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleEdit(item)}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(item.id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            {formData.id ? 'Edit Item' : 'Add New Item'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">Event Name</label>
                                <select
                                    value={formData.event_name}
                                    onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Event</option>
                                    {events.map((event) => (
                                        <option key={event} value={event}>
                                            {event}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 font-medium text-gray-700">Menu Type</label>
                                <select
                                    value={formData.menu_type}
                                    onChange={(e) => setFormData({ ...formData, menu_type: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Menu Type</option>
                                    {menuTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 font-medium text-gray-700">Category Name</label>
                                <select
                                    value={formData.category_name}
                                    onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories
                                        .filter((cat) =>
                                            cat.event_name === formData.event_name &&
                                            cat.type === formData.menu_type
                                        )
                                        .map((cat) => (
                                            <option key={cat.id} value={cat.category_name}>
                                                {cat.category_name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-2 font-medium text-gray-700">Item Name</label>
                                <input
                                    type="text"
                                    value={formData.item_name}
                                    onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium text-gray-700">Type</label>
                                <div className="flex gap-6">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="veg"
                                            checked={formData.is_veg === 'veg'}
                                            onChange={(e) => setFormData({ ...formData, is_veg: e.target.value })}
                                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                        />
                                        <span className="ml-2 text-gray-700">Veg</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="non-veg"
                                            checked={formData.is_veg === 'non-veg'}
                                            onChange={(e) => setFormData({ ...formData, is_veg: e.target.value })}
                                            className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                        />
                                        <span className="ml-2 text-gray-700">Non-veg</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {formData.id ? 'Update' : 'Add'} Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupItems;