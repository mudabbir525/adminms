import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Filter, Crown, Star, Medal } from 'lucide-react';

const SuperfastCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    category: '',
    type: '',
    position: 0,
    limit: 0
  });
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://mahaspice.desoftimp.com/ms3/getsf_categories.php');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory(prev => ({
      ...prev,
      [name]: name === 'type' ? value : 
              ['position', 'limit'].includes(name) ? parseInt(value) : value
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
        // Reset form
        setCurrentCategory({
          category: '',
          type: '',
          position: 0,
          limit: 0
        });
      }
    } catch (err) {
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
    ? categories.filter(category => category.type === selectedType)
    : categories;

  // Type filter configuration
  const typeFilters = [
    { type: 'classic', icon: Star, color: 'text-gray-500' },
    { type: 'royal', icon: Crown, color: 'text-yellow-500' },
    { type: 'platinum', icon: Medal, color: 'text-blue-500' }
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Superfast Categories</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white p-2 rounded flex items-center"
        >
          <Plus className="mr-2" /> Add Category
        </button>
      </div>

      {/* Type Filter Section */}
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
                ? `${color} bg-opacity-20 bg-gray-200` 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon className={`mr-2 ${color}`} /> {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
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
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <p><span className="font-medium">Type:</span> {category.type}</p>
              <p><span className="font-medium">Position:</span> {category.position}</p>
              <p><span className="font-medium">Limit:</span> {category.limit}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rest of the modal code remains the same as in the previous version */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                <label className="block mb-2">Type</label>
                <div className="flex space-x-4">
                  {['classic', 'royal', 'platinum'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={currentCategory.type === type}
                        onChange={handleInputChange}
                        className="mr-2"
                        required
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Position</label>
                <input
                  type="number"
                  name="position"
                  value={currentCategory.position}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
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
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white px-4 py-2 rounded"
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