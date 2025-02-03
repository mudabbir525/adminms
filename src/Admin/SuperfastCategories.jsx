import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Filter, Crown, Star, Medal } from 'lucide-react';
import axios from 'axios';

const SuperfastCategories = () => {
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [types, setTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    category: '',
    event_name: '',
    type: '',
    position: 0,
    limit: 0
  });
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchEvents();
    fetchTypes();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://mahaspice.desoftimp.com/ms3/getsf_categories.php');
      if (response.data.success) {
        setCategories(response.data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://mahaspice.desoftimp.com/ms3/get_sf_events.php');
      if (response.data.success) {
        setEvents(response.data.events || []);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events');
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await axios.get('https://mahaspice.desoftimp.com/ms3/get_sf_crpb.php');
      if (response.data.success) {
        setTypes(response.data.types || []);
      }
    } catch (err) {
      console.error('Error fetching types:', err);
      setError('Failed to fetch types');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory(prev => ({
      ...prev,
      [name]: ['position', 'limit'].includes(name) ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'https://mahaspice.desoftimp.com/ms3/addsf_category.php',
        currentCategory
      );

      if (response.data.success) {
        fetchCategories();
        setIsModalOpen(false);
        setCurrentCategory({
          category: '',
          event_name: '',
          type: '',
          position: 0,
          limit: 0
        });
      } else {
        setError(response.data.message || 'Failed to add category');
      }
    } catch (err) {
      console.error('Error adding category:', err);
      setError(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        'https://mahaspice.desoftimp.com/ms3/deletesf_category.php',
        { data: { id } }
      );

      if (response.data.success) {
        fetchCategories();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  // Filter categories based on selected type
  const filteredCategories = selectedType 
    ? categories.filter(cat => cat.type.toLowerCase() === selectedType.toLowerCase())
    : categories;

  // Dynamically generate typeFilters based on the types fetched from the API
  const typeFilters = types.map(type => ({
    type: type.name.toLowerCase(),
    icon: Star, // You can customize this based on the type if needed
    color: 'text-gray-500' // You can customize this based on the type if needed
  }));

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Superfast Categories</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center"
        >
          <Plus className="mr-2" /> Add Category
        </button>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setSelectedType(null)}
          className={`flex items-center px-4 py-2 rounded transition-colors ${
            selectedType === null 
              ? 'bg-gray-200 text-gray-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Filter className="mr-2" /> All Types
        </button>
        {typeFilters.map(({ type, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`flex items-center px-4 py-2 rounded transition-colors ${
              selectedType === type 
                ? 'bg-gray-200 font-medium' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Icon className={`mr-2 ${color}`} /> 
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map(category => (
          <div 
            key={category.id} 
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{category.category}</h3>
              <button 
                onClick={() => handleDelete(category.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="space-y-1 text-gray-600">
              <p><span className="font-medium text-gray-700">Event:</span> {category.event_name}</p>
              <p><span className="font-medium text-gray-700">Type:</span> {category.type}</p>
              <p><span className="font-medium text-gray-700">Position:</span> {category.position}</p>
              <p><span className="font-medium text-gray-700">Limit:</span> {category.limit}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Category Name</label>
                <input
                  type="text"
                  name="category"
                  value={currentCategory.category}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Event</label>
                <select
                  name="event_name"
                  value={currentCategory.event_name}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">Select Event</option>
                  {events.map(event => (
                    <option key={event.id} value={event.event_name}>
                      {event.event_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Type</label>
                <select
                  name="type"
                  value={currentCategory.type}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">Select Type</option>
                  {types.map(type => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Position</label>
                <input
                  type="number"
                  name="position"
                  value={currentCategory.position}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  min="0"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Limit</label>
                <input
                  type="number"
                  name="limit"
                  value={currentCategory.limit}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  min="0"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperfastCategories;