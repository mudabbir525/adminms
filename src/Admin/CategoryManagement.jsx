import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ category_name: '', position: '' });
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/design/get_categories.php');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/design/add_category.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory)
            });
            if (response.ok) {
                setNewCategory({ category_name: '', position: '' });
                fetchCategories();
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const response = await fetch(`https://mahaspice.desoftimp.com/ms3/design/delete_category.php?id=${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchCategories();
                }
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/design/update_category.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingCategory)
            });
            if (response.ok) {
                setEditingCategory(null);
                fetchCategories();
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Category Management</h2>

            {/* Add Category Form */}
            <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={newCategory.category_name}
                        onChange={(e) => setNewCategory({ ...newCategory, category_name: e.target.value })}
                        className="flex-1 p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Position"
                        value={newCategory.position}
                        onChange={(e) => setNewCategory({ ...newCategory, position: e.target.value })}
                        className="w-32 p-2 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
                    >
                        <Plus size={20} /> Add Category
                    </button>
                </div>
            </form>

            {/* Categories List */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {/* <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ID</th> */}
                                <th className="px-6 py-3 text-left text-sm font-medium text-center text-gray-500">Category Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-center text-gray-500">Position</th>
                                <th className="px-6 py-3 text-right text-sm font-medium text-center text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    {/* <td className="px-6 py-4 text-sm text-gray-900">{category.id}</td> */}
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                                        {editingCategory?.id === category.id ? (
                                            <input
                                                type="text"
                                                value={editingCategory.category_name}
                                                onChange={(e) => setEditingCategory({
                                                    ...editingCategory,
                                                    category_name: e.target.value
                                                })}
                                                className="p-1 border rounded"
                                            />
                                        ) : (
                                            category.category_name
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                                        {editingCategory?.id === category.id ? (
                                            <input
                                                type="number"
                                                value={editingCategory.position}
                                                onChange={(e) => setEditingCategory({
                                                    ...editingCategory,
                                                    position: e.target.value
                                                })}
                                                className="p-1 border rounded w-20"
                                            />
                                        ) : (
                                            category.position
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        {editingCategory?.id === category.id ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={handleUpdate}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingCategory(null)}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingCategory(category)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="text-red-600 hover:text-red-900"
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

export default CategoryManagement;