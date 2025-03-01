import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, AlertCircle, Info } from 'lucide-react';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [menuTypes, setMenuTypes] = useState([]);
  const [selectedMenuTypes, setSelectedMenuTypes] = useState([]);
  const [menuLimits, setMenuLimits] = useState({});
  const [menuPositions, setMenuPositions] = useState({});
  const [categoryType, setCategoryType] = useState('veg'); // Default is 'veg'
  const [error, setError] = useState('');
  const [existingCategories, setExistingCategories] = useState([]);
  const [occupiedPositions, setOccupiedPositions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch menu types
    axios.get('https://adminmahaspice.in/ms3/getMenuTypes.php')
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

    // Fetch existing categories
    fetchExistingCategories();
  }, []);

  const fetchExistingCategories = () => {
    setLoading(true);
    axios.get('https://adminmahaspice.in/ms3/getcategory.php')
      .then(response => {
        console.log('Existing Categories:', response.data);
        if (response.data && Array.isArray(response.data)) {
          setExistingCategories(response.data);
          
          // Pre-process occupied positions by menu type
          const positions = {};
          response.data.forEach(category => {
            if (!positions[category.menu_type]) {
              positions[category.menu_type] = [];
            }
            positions[category.menu_type].push({
              position: parseInt(category.position),
              category_name: category.category_name
            });
          });
          setOccupiedPositions(positions);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching existing categories:', error);
        setError('Failed to fetch existing categories');
        setLoading(false);
      });
  };

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

  const isPositionOccupied = (menuType, position) => {
    if (!occupiedPositions[menuType]) return false;
    return occupiedPositions[menuType].some(item => item.position === parseInt(position));
  };

  const getPositionCategory = (menuType, position) => {
    if (!occupiedPositions[menuType]) return null;
    const occupier = occupiedPositions[menuType].find(item => item.position === parseInt(position));
    return occupier ? occupier.category_name : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!categoryName.trim()) {
      setError('Please enter a category name');
      return;
    }
    
    if (selectedMenuTypes.length === 0) {
      setError('Please select at least one menu type');
      return;
    }
    
    // Check if all selected menu types have limits and positions
    const missingData = selectedMenuTypes.some(type => 
      !menuLimits[type] || !menuPositions[type]
    );
    
    if (missingData) {
      setError('Please set limits and positions for all selected menu types');
      return;
    }
    
    // Check for occupied positions
    const positionConflict = selectedMenuTypes.some(type => 
      isPositionOccupied(type, menuPositions[type])
    );
    
    if (positionConflict) {
      setError('One or more selected positions are already occupied');
      return;
    }

    const formData = {
      category_name: categoryName.trim(),
      menu_type: selectedMenuTypes,
      category_limits: menuLimits,
      positions: menuPositions,
      category_type: categoryType // Add the category type (veg/non-veg)
    };

    axios.post('https://adminmahaspice.in/ms3/addcategory.php', formData)
      .then(response => {
        alert(response.data.message);
        // Reset form
        setCategoryName('');
        setSelectedMenuTypes([]);
        setMenuLimits({});
        setMenuPositions({});
        setCategoryType('veg'); // Reset to default
        setError('');
        // Refresh the list of existing categories
        fetchExistingCategories();
      })
      .catch(error => {
        console.error('Error adding category:', error);
        setError('Failed to add category');
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Add Category</h2>
          <p className="mt-2 text-sm text-gray-600">Create a new menu category with custom limits and positions</p>
        </div>
        
        {loading ? (
          <div className="bg-white py-8 px-6 shadow rounded-lg flex justify-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <form className="bg-white py-8 px-6 shadow rounded-lg" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-md flex items-center gap-2">
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
              
              {/* Category Type Radio Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Type
                </label>
                <div className="flex space-x-6">
                  <div className="flex items-center">
                    <input
                      id="veg-radio"
                      name="category-type"
                      type="radio"
                      checked={categoryType === 'veg'}
                      onChange={() => setCategoryType('veg')}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label htmlFor="veg-radio" className="ml-2 block text-sm text-gray-700">
                      Vegetarian
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="nonveg-radio"
                      name="category-type"
                      type="radio"
                      checked={categoryType === 'nonveg'}
                      onChange={() => setCategoryType('nonveg')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <label htmlFor="nonveg-radio" className="ml-2 block text-sm text-gray-700">
                      Non-Vegetarian
                    </label>
                  </div>
                </div>
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
                        <div key={index} className={`p-4 rounded-lg ${isSelected ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
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
                            <div className="pl-7 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
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
                                    className={`block w-full border rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                      menuPositions[type] && isPositionOccupied(type, menuPositions[type]) 
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-300'
                                    }`}
                                  />
                                  {menuPositions[type] && isPositionOccupied(type, menuPositions[type]) && (
                                    <p className="mt-1 text-xs text-red-600">
                                      Position {menuPositions[type]} is already used by "{getPositionCategory(type, menuPositions[type])}"
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Occupied Positions Display */}
                              <div className="bg-gray-100 p-3 rounded-md">
                                <div className="flex items-center mb-2">
                                  <Info className="h-4 w-4 text-blue-500 mr-1" />
                                  <h3 className="text-xs font-medium text-gray-700">Occupied Positions</h3>
                                </div>
                                
                                {occupiedPositions[type] && occupiedPositions[type].length > 0 ? (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {occupiedPositions[type]
                                      .sort((a, b) => a.position - b.position)
                                      .map((item, posIdx) => (
                                        <div 
                                          key={posIdx} 
                                          className="px-2 py-1 bg-white rounded border border-gray-200 text-xs flex items-center"
                                          title={`${item.category_name}`}
                                        >
                                          <span className="font-medium mr-1">{item.position}:</span>
                                          <span className="truncate max-w-36">{item.category_name}</span>
                                        </div>
                                      ))
                                    }
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-500">No positions occupied for this menu type</p>
                                )}
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
        )}
      </div>
    </div>
  );
};

export default AddCategory;