import React, { useState, useEffect, useRef } from "react";
import { Filter, FilterX, Utensils, Calendar, Tag, DollarSign, CircleDot, ChevronDown, Edit3, Trash2 } from "lucide-react";
import axios from "axios";

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categorizedItems, setCategorizedItems] = useState({});
  const [filters, setFilters] = useState({
    vegType: 'all',
    menuType: 'all',
    category: 'all',
    eventName: 'all',
    eventCategory: 'all',
    priceRange: 'all'
  });
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});
  
  // Added for edit functionality
  const [formData, setFormData] = useState({
    id: "",
    item_name: "",
    is_veg: "0",
    price: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMenuItems();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (openDropdown && dropdownRefs.current[openDropdown] && !dropdownRefs.current[openDropdown].contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  useEffect(() => {
    applyFilters();
  }, [filters, menuItems]);

  useEffect(() => {
    // Group items by category
    const groupedByCategory = {};
    filteredItems.forEach(item => {
      const category = item.category_name;
      if (!groupedByCategory[category]) {
        groupedByCategory[category] = [];
      }
      groupedByCategory[category].push(item);
    });
    setCategorizedItems(groupedByCategory);
  }, [filteredItems]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("https://adminmahaspice.in/ms3/menu_display.php");
      const data = await response.json();
      if (data.success) {
        setMenuItems(data.data);
        setFilteredItems(data.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Safe split function that handles null/undefined values
  const safeSplit = (value, delimiter = ',') => {
    if (!value) return [];
    return value.split(delimiter).map(item => item.trim()).filter(Boolean);
  };

  // Get unique values for dropdowns with null check
  const getUniqueValues = (key) => {
    const values = new Set(menuItems.map(item => {
      if (key === 'priceRange') {
        return getPriceRange(item.price);
      }
      if (key.includes('event')) {
        return safeSplit(item[key]);
      }
      return item[key];
    }).flat().filter(Boolean));
    return ['all', ...Array.from(values)];
  };

  const getPriceRange = (price) => {
    const p = parseFloat(price);
    if (p <= 100) return '₹0-100';
    if (p <= 200) return '₹101-200';
    if (p <= 500) return '₹201-500';
    return '₹500+';
  };

  const applyFilters = () => {
    let result = [...menuItems];
    if (filters.vegType !== 'all') {
      result = result.filter(item =>
        filters.vegType === 'veg' ? item.is_veg === "1" : item.is_veg === "0"
      );
    }
    if (filters.menuType !== 'all') {
      result = result.filter(item => item.menu_type === filters.menuType);
    }
    if (filters.category !== 'all') {
      result = result.filter(item => item.category_name === filters.category);
    }
    if (filters.eventName !== 'all') {
      result = result.filter(item =>
        safeSplit(item.event_names).includes(filters.eventName)
      );
    }
    if (filters.eventCategory !== 'all') {
      result = result.filter(item =>
        safeSplit(item.event_categories).includes(filters.eventCategory)
      );
    }
    if (filters.priceRange !== 'all') {
      result = result.filter(item => getPriceRange(item.price) === filters.priceRange);
    }
    setFilteredItems(result);
  };

  const FilterDropdown = ({ id, label, options, value, onChange, icon: Icon }) => {
    return (
      <div className="relative inline-block text-left mr-4 mb-2" ref={el => dropdownRefs.current[id] = el}>
        <button
          onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
          className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
        >
          <Icon className="w-5 h-5 mr-2" />
          {label}: {value}
          <ChevronDown className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
        </button>
        
        {openDropdown === id && (
          <div className="absolute left-0 z-10 w-56 mt-2 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              {options.map((option) => (
                <button
                  key={option}
                  className="group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-gray-100 text-gray-700"
                  onClick={() => {
                    onChange(option);
                    setOpenDropdown(null);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const VegIcon = () => (
    <div className="w-6 h-6 rounded-full border-2 border-green-600 flex items-center justify-center">
      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
    </div>
  );

  const NonVegIcon = () => (
    <div className="w-6 h-6 rounded-full border-2 border-red-600 flex items-center justify-center">
      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
    </div>
  );

  const resetFilters = () => {
    setFilters({
      vegType: 'all',
      menuType: 'all',
      category: 'all',
      eventName: 'all',
      eventCategory: 'all',
      priceRange: 'all'
    });
  };

  // Edit functionality from the commented code
  const handleEdit = (item) => {
    setIsEditing(true);
    setFormData({
      id: item.id,
      item_name: item.item_name,
      is_veg: item.is_veg,
      price: item.price,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "is_veg" ? (value === "1" ? "1" : "0") : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://adminmahaspice.in/ms3/updateMenuItem.php",
        formData
      );
      if (response.data.success) {
        fetchMenuItems();
        setIsEditing(false);
        setFormData({ id: "", item_name: "", is_veg: "0", price: "" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await axios.post(
          "https://adminmahaspice.in/ms3/deleteMenuItem.php",
          { id: id },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
          
        if (response.data.success) {
          setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
          setFilteredItems(prevItems => prevItems.filter(item => item.id !== id));
          alert("Item deleted successfully");
        } else {
          alert(response.data.message || "Failed to delete item");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert(error.response?.data?.message || "Error deleting item. Please try again.");
      }
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Menu Items</h1>
        
        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center mb-4">
            <h2 className="text-lg font-semibold mr-4">Filters:</h2>
            <button 
              onClick={resetFilters}
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md flex items-center"
            >
              <FilterX className="w-4 h-4 mr-1" />
              Reset Filters
            </button>
          </div>
          
          <div className="flex flex-wrap">
            <FilterDropdown 
              id="vegType"
              label="Food Type" 
              options={['all', 'veg', 'non-veg']} 
              value={filters.vegType} 
              onChange={(value) => setFilters({ ...filters, vegType: value })}
              icon={CircleDot}
            />
            <FilterDropdown 
              id="menuType"
              label="Menu Type" 
              options={getUniqueValues('menu_type')} 
              value={filters.menuType} 
              onChange={(value) => setFilters({ ...filters, menuType: value })}
              icon={Utensils}
            />
            <FilterDropdown 
              id="category"
              label="Category" 
              options={getUniqueValues('category_name')} 
              value={filters.category} 
              onChange={(value) => setFilters({ ...filters, category: value })}
              icon={Filter}
            />
            <FilterDropdown 
              id="eventName"
              label="Event" 
              options={getUniqueValues('event_names')} 
              value={filters.eventName} 
              onChange={(value) => setFilters({ ...filters, eventName: value })}
              icon={Calendar}
            />
            <FilterDropdown 
              id="eventCategory"
              label="Event Category" 
              options={getUniqueValues('event_categories')} 
              value={filters.eventCategory} 
              onChange={(value) => setFilters({ ...filters, eventCategory: value })}
              icon={Tag}
            />
            <FilterDropdown 
              id="priceRange"
              label="Price Range" 
              options={['all', '₹0-100', '₹101-200', '₹201-500', '₹500+']} 
              value={filters.priceRange} 
              onChange={(value) => setFilters({ ...filters, priceRange: value })}
              icon={DollarSign}
            />
          </div>
        </div>
        
        {/* Categorized Menu Display */}
        <div>
          {Object.keys(categorizedItems).length === 0 ? (
            <div className="text-center py-8 text-gray-500">No menu items found matching your filters.</div>
          ) : (
            Object.entries(categorizedItems).map(([category, items]) => (
              <div key={category} className="mb-8">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-gray-200">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{item.item_name}</h3>
                        {item.is_veg === "1" ? <VegIcon /> : <NonVegIcon />}
                      </div>
                      
                      <div className="text-lg font-bold text-green-700 mb-2">
                        ₹{parseFloat(item.price).toFixed(2)}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-1">
                        Menu Type: <span className="font-medium">{item.menu_type}</span>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex justify-end mt-3 space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Edit Menu Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  name="item_name"
                  value={formData.item_name}
                  onChange={handleChange}
                  placeholder="Item name"
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="is_veg"
                  value={formData.is_veg}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1">Veg</option>
                  <option value="0">Non-veg</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                  step="0.01"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ id: "", item_name: "", is_veg: "0", price: "" });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItems;