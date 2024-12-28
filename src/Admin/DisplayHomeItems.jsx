import React, { useState, useEffect } from 'react';
import { 
    Pencil, 
    Trash2, 
    Search, 
    ChevronDown, 
    Filter, 
    Loader2, 
    AlertCircle,
    Leaf,
    Coffee,
    Plus
} from 'lucide-react';

const DisplayHomeItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedVegType, setSelectedVegType] = useState('all');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isVegTypeOpen, setIsVegTypeOpen] = useState(false);

    const fetchItems = async () => {
        try {
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/getHomeItems.php');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseText = await response.text();
            
            try {
                const data = JSON.parse(responseText);
                if (data.success) {
                    setItems(data.items || []);
                } else {
                    throw new Error(data.message || 'Failed to fetch items');
                }
            } catch (parseError) {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/deleteHomeItems.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
            
            const data = await response.json();
            if (data.success) {
                setItems(items.filter(item => item.id !== id));
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            alert('Failed to delete item');
        }
    };

    // Get unique categories from items
    const categories = ['all', ...new Set(items.map(item => item.category_type))];
    const vegTypes = [
        { value: 'all', label: 'All Items', icon: Coffee },
        { value: 'veg', label: 'Vegetarian Only', icon: Leaf },
        { value: 'non-veg', label: 'Non-Vegetarian', icon: Coffee }
    ];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setIsCategoryOpen(false);
                setIsVegTypeOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Filter and search items
    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category_type === selectedCategory;
        const matchesVegType = selectedVegType === 'all' || item.veg_non === selectedVegType;
        return matchesSearch && matchesCategory && matchesVegType;
    });

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex items-center space-x-2 text-blue-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-lg font-medium">Loading menu items...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-6 h-6" />
                <span className="text-lg font-medium">{error}</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Menu Items
                        </h2>
                        <button
                            onClick={() => window.location.href = '/add-home-items'}
                            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add New Item</span>
                        </button>
                    </div>

                    {/* Filters Section */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by item name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                        </div>

                        {/* Filter Section */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Category Filter */}
                            <div className="relative dropdown-container min-w-[200px]">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsCategoryOpen(!isCategoryOpen);
                                        setIsVegTypeOpen(false);
                                    }}
                                    className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-2">
                                        <Filter size={18} className="text-gray-400" />
                                        <span className="text-gray-700">
                                            {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                                        </span>
                                    </div>
                                    <ChevronDown size={18} className="text-gray-400" />
                                </button>

                                {isCategoryOpen && (
                                    <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setIsCategoryOpen(false);
                                                }}
                                                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 flex items-center space-x-2"
                                            >
                                                <span>{category === 'all' ? 'All Categories' : category}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Veg/Non-veg Filter */}
                            <div className="relative dropdown-container min-w-[200px]">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsVegTypeOpen(!isVegTypeOpen);
                                        setIsCategoryOpen(false);
                                    }}
                                    className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-2">
                                        {selectedVegType === 'veg' ? (
                                            <Leaf size={18} className="text-green-500" />
                                        ) : selectedVegType === 'non-veg' ? (
                                            <Coffee size={18} className="text-red-500" />
                                        ) : (
                                            <Coffee size={18} className="text-gray-400" />
                                        )}
                                        <span className="text-gray-700">
                                            {vegTypes.find(t => t.value === selectedVegType)?.label}
                                        </span>
                                    </div>
                                    <ChevronDown size={18} className="text-gray-400" />
                                </button>

                                {isVegTypeOpen && (
                                    <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                        {vegTypes.map(({value, label, icon: Icon}) => (
                                            <button
                                                key={value}
                                                onClick={() => {
                                                    setSelectedVegType(value);
                                                    setIsVegTypeOpen(false);
                                                }}
                                                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 flex items-center space-x-2"
                                            >
                                                <Icon size={18} className={
                                                    value === 'veg' 
                                                        ? 'text-green-500' 
                                                        : value === 'non-veg'
                                                            ? 'text-red-500'
                                                            : 'text-gray-400'
                                                } />
                                                <span>{label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Grid */}
                {filteredItems.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <AlertCircle size={48} className="text-gray-400" />
                            <p className="text-lg text-gray-600">No items found matching your filters</p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setSelectedVegType('all');
                                }}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <div className="relative group">
                                    <img 
                                        src={`https://mahaspice.desoftimp.com/ms3/uploads/homeCategory/${item.image_path}`}
                                        alt={item.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => window.location.href = `/edit-home-items/${item.id}`}
                                                className="p-2 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                            ₹{item.price}
                                        </span>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                            {item.category_type}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1
                                            ${item.veg_non === 'veg' 
                                                ? 'bg-green-50 text-green-700' 
                                                : 'bg-red-50 text-red-700'
                                            }`}
                                        >
                                            {item.veg_non === 'veg' ? (
                                                <Leaf size={14} />
                                            ) : (
                                                <Coffee size={14} />
                                            )}
                                            {item.veg_non}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisplayHomeItems;