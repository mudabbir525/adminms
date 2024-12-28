import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminEditCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        axios.get('https://mahaspice.desoftimp.com/ms3/getcategory.php')
            .then(response => {
                const groupedCategories = {};
                response.data.forEach(category => {
                    if (!groupedCategories[category.category_name]) {
                        groupedCategories[category.category_name] = [];
                    }
                    groupedCategories[category.category_name].push(category);
                });

                setCategories(Object.values(groupedCategories));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                setError('Failed to fetch categories');
                setLoading(false);
            });
    };

    const handleDeleteCategory = (categoryName) => {
        if (window.confirm(`Are you sure you want to delete the entire category "${categoryName}"?`)) {
            axios.delete(`https://mahaspice.desoftimp.com/ms3/deletecategory.php`, {
                data: { category_name: categoryName }
            })
            .then(response => {
                alert(response.data.message);
                fetchCategories();
            })
            .catch(error => {
                console.error('Error deleting category:', error);
                alert('Failed to delete category');
            });
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen text-lg font-semibold">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-6">{error}</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Edit Categories</h1>
            
            {categories.length === 0 ? (
                <p className="text-gray-500 text-center">No categories found</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((categoryGroup, index) => (
                        <div key={index} className="bg-white border rounded-lg shadow hover:shadow-lg transition-shadow">
                            <div className="p-4 flex justify-between items-center border-b">
                                <h2 className="text-lg font-semibold text-gray-700">{categoryGroup[0].category_name}</h2>
                                <div className="flex space-x-3">
                                    <Link 
                                        to={`/editcategory/${categoryGroup[0].category_name}`} 
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm">
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDeleteCategory(categoryGroup[0].category_name)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm">
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600">
                                        <th className="p-3 text-center">Menu Type</th>
                                        <th className="p-3 text-center">Limit</th>
                                        <th className="p-3 text-center">Position</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryGroup.map((category, catIndex) => (
                                        <tr key={catIndex} className="odd:bg-white even:bg-gray-50">
                                            <td className="p-3 border-t text-gray-700 text-center">{category.menu_type}</td>
                                            <td className="p-3 border-t text-gray-700 text-center">{category.category_limit}</td>
                                            <td className="p-3 border-t text-gray-700 text-center">{category.position}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminEditCategory;