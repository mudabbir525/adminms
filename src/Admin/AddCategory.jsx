import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, AlertCircle } from 'lucide-react';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [menuTypes, setMenuTypes] = useState([]);
  const [selectedMenuTypes, setSelectedMenuTypes] = useState([]);
  const [menuLimits, setMenuLimits] = useState({});
  const [menuPositions, setMenuPositions] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://mahaspice.desoftimp.com/ms3/getMenuTypes.php')
      .then(response => {
        console.log('Menu Types Response:', response.data);
        if (response.data && Array.isArray(response.data)) {
          setMenuTypes(response.data);
        } else if (response.data && response.data.menu_types) {
          setMenuTypes(response.data.menu_types);
        } else {
          console.warn('No menu types found:', response.data);
          setMenuTypes([]);
        }
      })
      .catch(error => {
        console.error('Error fetching menu types:', error);
        setMenuTypes([]);
        setError('Failed to fetch menu types');
      });
  }, []);

  const handleCheckboxChange = (menuType) => {
    const type = typeof menuType === 'object' ? menuType.menu_type : menuType;
    if (selectedMenuTypes.includes(type)) {
      setSelectedMenuTypes(selectedMenuTypes.filter(t => t !== type));
      const updatedLimits = { ...menuLimits };
      const updatedPositions = { ...menuPositions };
      delete updatedLimits[type];
      delete updatedPositions[type];
      setMenuLimits(updatedLimits);
      setMenuPositions(updatedPositions);
    } else {
      setSelectedMenuTypes([...selectedMenuTypes, type]);
    }
  };

  const handleLimitChange = (menuType, limit) => {
    setMenuLimits({
      ...menuLimits,
      [menuType]: limit
    });
  };

  const handlePositionChange = (menuType, position) => {
    setMenuPositions({
      ...menuPositions,
      [menuType]: position
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName || selectedMenuTypes.length === 0 || 
        Object.keys(menuLimits).length === 0 || 
        Object.keys(menuPositions).length === 0) {
      setError('Please fill in all fields including category name, menu types, limits, and positions');
      return;
    }

    const formData = {
      category_name: categoryName,
      menu_type: selectedMenuTypes,
      category_limits: menuLimits,
      positions: menuPositions
    };

    axios.post('https://mahaspice.desoftimp.com/ms3/addcategory.php', formData)
      .then(response => {
        alert(response.data.message);
        // Reset form
        setCategoryName('');
        setSelectedMenuTypes([]);
        setMenuLimits({});
        setMenuPositions({});
        setError('');
      })
      .catch(error => {
        console.error('Error adding category:', error);
        setError('Failed to add category');
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Add Category</h2>
          <p className="mt-2 text-sm text-gray-600">Create a new menu category with custom limits and positions</p>
        </div>

        <form className="bg-white py-8 px-6 shadow rounded-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-4 bg-red-50 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Category Name Input */}
            <div>
              <label htmlFor="category_name" className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                id="category_name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>

            {/* Menu Types Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Menu Types
              </label>
              <div className="space-y-4">
                {menuTypes.length > 0 ? (
                  menuTypes.map((menuType, index) => {
                    const type = menuType.menu_type || menuType;
                    const isSelected = selectedMenuTypes.includes(type);

                    return (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            id={`menuType-${index}`}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={isSelected}
                            onChange={() => handleCheckboxChange(menuType)}
                          />
                          <label htmlFor={`menuType-${index}`} className="ml-3 block text-sm font-medium text-gray-700">
                            {type}
                          </label>
                        </div>

                        {isSelected && (
                          <div className="grid grid-cols-2 gap-4 pl-7">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Limit</label>
                              <input
                                type="number"
                                min="1"
                                placeholder="Limit"
                                value={menuLimits[type] || ''}
                                onChange={(e) => handleLimitChange(type, e.target.value)}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Position</label>
                              <input
                                type="number"
                                min="1"
                                placeholder="Position"
                                value={menuPositions[type] || ''}
                                onChange={(e) => handlePositionChange(type, e.target.value)}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">No menu types available</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;