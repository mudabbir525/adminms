import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Filter } from 'lucide-react';

const API_BASE_URL = 'https://adminmahaspice.in/ms3/design';

const ItemManagement = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [newItem, setNewItem] = useState({
        name: '',
        category_id: '',
        veg_nonveg: 'Veg'
    });
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    // Existing fetch functions remain the same
    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/get_items.php`);
            const data = await response.json();
            if (data.status === 'success') {
                setItems(data.data || []);
            } else {
                console.error('Error:', data.message);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/get_categories_for_items.php`);
            const data = await response.json();
            if (data.status === 'success') {
                setCategories(data.data || []);
            } else {
                console.error('Error:', data.message);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Existing CRUD functions remain the same
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/add_item.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            const data = await response.json();
            if (data.status === 'success') {
                setNewItem({ name: '', category_id: '', veg_nonveg: 'Veg' });
                fetchItems();
            } else {
                alert(data.message || 'Error adding item');
            }
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Error adding item');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/delete_item.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });
                const data = await response.json();
                if (data.status === 'success') {
                    fetchItems();
                } else {
                    alert(data.message || 'Error deleting item');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Error deleting item');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/update_item.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingItem)
            });
            const data = await response.json();
            if (data.status === 'success') {
                setEditingItem(null);
                fetchItems();
            } else {
                alert(data.message || 'Error updating item');
            }
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error updating item');
        } finally {
            setLoading(false);
        }
    };

    // Filter items based on selected category
    const filteredItems = selectedCategory === 'all'
        ? items
        : items.filter(item => item.category_id === selectedCategory);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Item Management</h2>

            {/* Add Item Form */}
            <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="p-2 border rounded col-span-1 md:col-span-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                    />
                    <select
                        value={newItem.category_id}
                        onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
                        className="p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={newItem.veg_nonveg}
                        onChange={(e) => setNewItem({ ...newItem, veg_nonveg: e.target.value })}
                        className="p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                    >
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-600 disabled:bg-blue-300 transition-colors duration-200 md:col-span-4"
                    >
                        <Plus size={20} /> Add Item
                    </button>
                </div>
            </form>

            {/* Category Filter */}
            <div className="mb-6 flex items-center gap-4 bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center gap-2">
                    <Filter size={20} className="text-gray-500" />
                    <span className="text-gray-700 font-medium">Filter by Category:</span>
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border rounded min-w-[200px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.category_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {/* <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ID</th> */}
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Item Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    {/* <td className="px-6 py-4 text-sm text-gray-900">{item.id}</td> */}
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {editingItem?.id === item.id ? (
                                            <input
                                                type="text"
                                                value={editingItem.name}
                                                onChange={(e) => setEditingItem({
                                                    ...editingItem,
                                                    name: e.target.value
                                                })}
                                                className="p-1 border rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            />
                                        ) : (
                                            item.name
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {editingItem?.id === item.id ? (
                                            <select
                                                value={editingItem.category_id}
                                                onChange={(e) => setEditingItem({
                                                    ...editingItem,
                                                    category_id: e.target.value
                                                })}
                                                className="p-1 border rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            >
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.category_name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            item.category_name
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {editingItem?.id === item.id ? (
                                            <select
                                                value={editingItem.veg_nonveg}
                                                onChange={(e) => setEditingItem({
                                                    ...editingItem,
                                                    veg_nonveg: e.target.value
                                                })}
                                                className="p-1 border rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="Veg">Veg</option>
                                                <option value="Non-Veg">Non-Veg</option>
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-1 rounded text-xs ${item.veg_nonveg === 'Veg'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {item.veg_nonveg}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        {editingItem?.id === item.id ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={handleUpdate}
                                                    disabled={loading}
                                                    className="text-green-600 hover:text-green-900 disabled:text-green-300 transition-colors duration-200"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingItem(null)}
                                                    disabled={loading}
                                                    className="text-gray-600 hover:text-gray-900 disabled:text-gray-300 transition-colors duration-200"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingItem(item)}
                                                    disabled={loading}
                                                    className="text-blue-600 hover:text-blue-900 disabled:text-blue-300 transition-colors duration-200"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={loading}
                                                    className="text-red-600 hover:text-red-900 disabled:text-red-300 transition-colors duration-200"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ItemManagement;