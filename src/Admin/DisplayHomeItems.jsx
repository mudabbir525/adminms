import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Search, ChevronDown } from 'lucide-react';

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
    const vegTypes = ['all', 'veg', 'non-veg'];

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

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Menu Items</h2>
                    
                    {/* Search and Filters Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>

                        {/* Category Filter */}
                        <div className="relative dropdown-container">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCategoryOpen(!isCategoryOpen);
                                    setIsVegTypeOpen(false);
                                }}
                                className="w-full sm:w-48 px-4 py-2 text-left bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                            >
                                <span className="capitalize">{selectedCategory}</span>
                                <ChevronDown size={20} className="text-gray-500" />
                            </button>

                            {isCategoryOpen && (
                                <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setIsCategoryOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-left hover:bg-gray-100 capitalize first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Veg/Non-veg Filter */}
                        <div className="relative dropdown-container">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsVegTypeOpen(!isVegTypeOpen);
                                    setIsCategoryOpen(false);
                                }}
                                className="w-full sm:w-48 px-4 py-2 text-left bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                            >
                                <span className="capitalize">{selectedVegType}</span>
                                <ChevronDown size={20} className="text-gray-500" />
                            </button>

                            {isVegTypeOpen && (
                                <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
                                    {vegTypes.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                setSelectedVegType(type);
                                                setIsVegTypeOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-left hover:bg-gray-100 capitalize first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {filteredItems.length === 0 ? (
                    <div className="text-center p-8">No items found</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <img 
                                    src={`https://mahaspice.desoftimp.com/ms3/uploads/homeCategory/${item.image_path}`}
                                    alt={item.title}
                                    className="w-full h-48 object-cover"
                                />
                                
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                            ₹{item.price}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm">
                                                {item.category_type}
                                            </span>
                                            <span className={`px-2 py-1 rounded-md text-sm ${
                                                item.veg_non === 'veg' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {item.veg_non}
                                            </span>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => window.location.href = `/edit-home-items/${item.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
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