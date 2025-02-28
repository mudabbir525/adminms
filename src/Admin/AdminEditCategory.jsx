import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminEditCategory = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        searchTerm: '',
        menuType: '',
        sortBy: '' // Default sort by name
    });
    const [menuTypes, setMenuTypes] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        // Apply filters whenever categories or filters change
        applyFilters();
    }, [categories, filters]);

    const fetchCategories = () => {
        axios.get('https://adminmahaspice.in/ms3/getcategory.php')
            .then(response => {
                const groupedCategories = {};
                const allMenuTypes = new Set();
                
                response.data.forEach(category => {
                    if (!groupedCategories[category.category_name]) {
                        groupedCategories[category.category_name] = [];
                    }
                    groupedCategories[category.category_name].push(category);
                    allMenuTypes.add(category.menu_type);
                });

                const categoriesArray = Object.values(groupedCategories);
                setCategories(categoriesArray);
                setFilteredCategories(categoriesArray);
                setMenuTypes(Array.from(allMenuTypes));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                setError('Failed to fetch categories');
                setLoading(false);
            });
    };

    const applyFilters = () => {
        let result = [...categories];

        // Filter by search term (category name)
        if (filters.searchTerm) {
            result = result.filter(categoryGroup => 
                categoryGroup[0].category_name.toLowerCase().includes(filters.searchTerm.toLowerCase())
            );
        }

        // Filter by menu type
        if (filters.menuType) {
            result = result.filter(categoryGroup => 
                categoryGroup.some(category => category.menu_type === filters.menuType)
            );
        }

        // Sort the categories
        if (filters.sortBy === 'name') {
            result.sort((a, b) => a[0].category_name.localeCompare(b[0].category_name));
        } else if (filters.sortBy === 'position') {
            result.sort((a, b) => {
                // Get the minimum position from each category group
                const minPositionA = Math.min(...a.map(item => parseInt(item.position) || 0));
                const minPositionB = Math.min(...b.map(item => parseInt(item.position) || 0));
                return minPositionA - minPositionB;
            });
        }

        setFilteredCategories(result);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            searchTerm: '',
            menuType: '',
            sortBy: 'name'
        });
    };

    const handleDeleteCategory = (categoryName) => {
        if (window.confirm(`Are you sure you want to delete the entire category "${categoryName}"?`)) {
            axios.delete(`https://adminmahaspice.in/ms3/deletecategory.php`, {
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
            
            {/* Filter controls */}
            <div className="mb-8 bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Filters</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search by Category Name</label>
                        <input
                            type="text"
                            name="searchTerm"
                            value={filters.searchTerm}
                            onChange={handleFilterChange}
                            placeholder="Search categories..."
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Menu Type</label>
                        <select
                            name="menuType"
                            value={filters.menuType}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Menu Types</option>
                            {menuTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                        <select
                            name="sortBy"
                            value={filters.sortBy}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="name">Category Name</option>
                            <option value="position">Position</option>
                            {/* <option value="name">Name</option> */}
                        </select>
                    </div>
                    
                    <div className="flex items-end">
                        <button
                            onClick={resetFilters}
                            className="w-full p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                    Showing {filteredCategories.length} of {categories.length} categories
                </div>
            </div>
            
            {filteredCategories.length === 0 ? (
                <p className="text-gray-500 text-center bg-white p-6 rounded-lg shadow">No categories found matching your filters</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCategories.map((categoryGroup, index) => (
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