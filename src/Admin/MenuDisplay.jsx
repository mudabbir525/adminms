import React, { useState, useEffect } from "react";
import { Edit3, Trash2, ChevronDown, Filter, FilterX, Utensils, Calendar, Tag, DollarSign, CircleDot } from "lucide-react";
import { Menu } from '@headlessui/react';
import axios from "axios";

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filters, setFilters] = useState({
    vegType: 'all',
    menuType: 'all',
    category: 'all',
    eventName: 'all',
    eventCategory: 'all',
    priceRange: 'all'
  });
  const [formData, setFormData] = useState({
    id: "",
    item_name: "",
    is_veg: "0",
    price: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, menuItems]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("https://mahaspice.desoftimp.com/ms3/menu_display.php");
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

  const FilterDropdown = ({ label, options, value, onChange, icon: Icon }) => (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        <Icon className="size-4 mr-2 text-gray-500" />
        {label}: {value}
        <ChevronDown className="size-4 ml-2" />
      </Menu.Button>
      <Menu.Items className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="py-1">
          {options.map((option) => (
            <Menu.Item key={option}>
              <button
                className={`block w-full px-4 py-2 text-left text-sm ${
                  value === option ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } hover:bg-gray-50`}
                onClick={() => onChange(option)}
              >
                {option}
              </button>
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );

  // Rest of the CRUD operations...
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
        "https://mahaspice.desoftimp.com/ms3/updateMenuItem.php",
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
                "https://mahaspice.desoftimp.com/ms3/deleteMenuItem.php",
                { id: id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
            
            if (response.data.success) {
                // Update the local state to remove the deleted item
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

  if (loading) return <div className="text-center p-4">Loading...</div>;

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


  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
        >
          <FilterX className="size-4" />
          Reset Filters
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
        <FilterDropdown
          label="Type"
          options={['all', 'veg', 'non-veg']}
          value={filters.vegType}
          onChange={(value) => setFilters({ ...filters, vegType: value })}
          icon={CircleDot}
        />
        <FilterDropdown
          label="Menu Type"
          options={getUniqueValues('menu_type')}
          value={filters.menuType}
          onChange={(value) => setFilters({ ...filters, menuType: value })}
          icon={Utensils}
        />
        <FilterDropdown
          label="Category"
          options={getUniqueValues('category_name')}
          value={filters.category}
          onChange={(value) => setFilters({ ...filters, category: value })}
          icon={Filter}
        />
        <FilterDropdown
          label="Event Name"
          options={getUniqueValues('event_names')}
          value={filters.eventName}
          onChange={(value) => setFilters({ ...filters, eventName: value })}
          icon={Calendar}
        />
        <FilterDropdown
          label="Event Category"
          options={getUniqueValues('event_categories')}
          value={filters.eventCategory}
          onChange={(value) => setFilters({ ...filters, eventCategory: value })}
          icon={Tag}
        />
        <FilterDropdown
          label="Price Range"
          options={getUniqueValues('priceRange')}
          value={filters.priceRange}
          onChange={(value) => setFilters({ ...filters, priceRange: value })}
          icon={DollarSign}
        />
      </div>


      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-500 text-white">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Menu Type</th>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Event Names</th>
              <th className="py-2 px-4">Event Categories</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{item.item_name}</td>
                <td className="py-2 px-4">{item.menu_type}</td>
                <td className="py-2 px-4">{item.category_name}</td>
                <td className="py-2 px-4">
                  <span className={item.is_veg === "1" ? "text-green-500" : "text-red-500"}>
                    {item.is_veg === "1" ? "Veg" : "Non-veg"}
                  </span>
                </td>
                <td className="py-2 px-4">₹{parseFloat(item.price).toFixed(2)}</td>
                <td className="py-2 px-4">
                  <ul className="list-disc pl-4">
                    {safeSplit(item.event_names).map((event, index) => (
                      <li key={index} className="text-sm">{event}</li>
                    ))}
                  </ul>
                </td>
                <td className="py-2 px-4">
                  <ul className="list-disc pl-4">
                    {safeSplit(item.event_categories).map((category, index) => (
                      <li key={index} className="text-sm">{category}</li>
                    ))}
                  </ul>
                </td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-medium mb-4">Edit Item</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  name="item_name"
                  value={formData.item_name}
                  onChange={handleChange}
                  placeholder="Item name"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <select
                  name="is_veg"
                  value={formData.is_veg}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="1">Veg</option>
                  <option value="0">Non-veg</option>
                </select>
              </div>
              <div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="w-full p-2 border rounded"
                  required
                  step="0.01"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ id: "", item_name: "", is_veg: "0", price: "" });
                  }}
                  className="px-4 py-2 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
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