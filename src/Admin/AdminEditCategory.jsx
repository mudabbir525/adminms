import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Leaf, LeafyGreen, Vegan, VeganIcon } from 'lucide-react';
import { SiVega } from 'react-icons/si';
import { GiMeat } from 'react-icons/gi';
import { TbMeat } from 'react-icons/tb';

const AdminEditCategory = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    menuType: '',
    categoryType: '', // Filter for veg/nonveg
    sortBy: '' // Default sort by name
  });
  const [menuTypes, setMenuTypes] = useState([]);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categoriesWithNonVeg, setCategoriesWithNonVeg] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    // Apply filters whenever categories or filters change
    applyFilters();
  }, [categories, filters, menuItems, categoriesWithNonVeg]);

  const fetchCategories = () => {
    axios.get('https://adminmahaspice.in/ms3/getcategory.php')
      .then(response => {
        const groupedCategories = {};
        const allMenuTypes = new Set();
        const allCategoryTypes = new Set();

        response.data.forEach(category => {
          if (!groupedCategories[category.category_name]) {
            groupedCategories[category.category_name] = [];
          }
          groupedCategories[category.category_name].push(category);
          allMenuTypes.add(category.menu_type);
          
          if (category.category_type) {
            allCategoryTypes.add(category.category_type);
          }
        });

        const categoriesArray = Object.values(groupedCategories);
        setCategories(categoriesArray);
        setFilteredCategories(categoriesArray);
        setMenuTypes(Array.from(allMenuTypes));
        setCategoryTypes(Array.from(allCategoryTypes));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories');
        setLoading(false);
      });
  };

  const fetchMenuItems = () => {
    axios.get('https://adminmahaspice.in/ms3/menu_display.php')
      .then(response => {
        if (response.data.success) {
          setMenuItems(response.data.data);
          
          // Create a mapping of categories that have non-veg items for each menu type
          const nonVegCategoriesByMenuType = {};
          
          response.data.data.forEach(item => {
            const { menu_type, category_name, is_veg } = item;
            
            if (!nonVegCategoriesByMenuType[menu_type]) {
              nonVegCategoriesByMenuType[menu_type] = new Set();
            }
            
            if (is_veg === '0') {
              nonVegCategoriesByMenuType[menu_type].add(category_name);
            }
          });
          
          // Convert to a more usable format
          const mappedCategories = {};
          Object.entries(nonVegCategoriesByMenuType).forEach(([menuType, categorySet]) => {
            mappedCategories[menuType] = Array.from(categorySet);
          });
          
          setCategoriesWithNonVeg(mappedCategories);
        }
      })
      .catch(error => {
        console.error('Error fetching menu items:', error);
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

    // Special case: if menu type is selected and category type is 'nonveg'
    if (filters.menuType && filters.categoryType === 'nonveg' && categoriesWithNonVeg[filters.menuType]) {
      // Only show categories that have nonveg items for this menu type
      const nonVegCategoriesForMenuType = categoriesWithNonVeg[filters.menuType];
      
      result = result.filter(categoryGroup =>
        nonVegCategoriesForMenuType.includes(categoryGroup[0].category_name) &&
        categoryGroup.some(category => category.menu_type === filters.menuType)
      );
    } else {
      // Normal filtering
      // Filter by menu type
      if (filters.menuType) {
        result = result.filter(categoryGroup =>
          categoryGroup.some(category => category.menu_type === filters.menuType)
        );
      }

      // Filter by category type (veg/nonveg)
      if (filters.categoryType) {
        result = result.filter(categoryGroup =>
          categoryGroup.some(category => category.category_type === filters.categoryType)
        );
      }
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
      categoryType: '',
      sortBy: ''
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

  // Function to get the category type icon
  const getCategoryTypeIcon = (categoryGroup) => {
    const categoryType = categoryGroup[0].category_type;
    if (categoryType === 'veg') {
      return <span title="Vegetarian" className="text-green-600 ml-2"><Leaf /></span>;
    } else if (categoryType === 'nonveg') {
      return <span title="Non-Vegetarian" className="text-red-600 ml-2 text-2xl"><TbMeat /></span>;
    }
    return null;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Edit Categories</h1>

      {/* Filter controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search by Category Name</label>
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Menu Type</label>
            <select
              name="menuType"
              value={filters.menuType}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Menu Types</option>
              {menuTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Category Type filter (veg/nonveg) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Type</label>
            <select
              name="categoryType"
              value={filters.categoryType}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Types</option>
              {categoryTypes.map((type, index) => (
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
              className="w-full p-2 border rounded-md"
            >
              <option value="name">Category Name</option>
              <option value="position">Position</option>
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-4 mt-2">
            <button
              onClick={resetFilters}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
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
        <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow">
          No categories found matching your filters
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((categoryGroup, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center">
                    {categoryGroup[0].category_name}
                    {getCategoryTypeIcon(categoryGroup)}
                  </h3>
                  <div className="flex space-x-2">
                    <Link
                      to={`/editcategory/${categoryGroup[0].category_name}`}
                      
                      className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteCategory(categoryGroup[0].category_name)}
                      className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {categoryGroup.map((category, catIndex) => (
                    <div key={catIndex} className="text-sm p-2 rounded bg-gray-50">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <span className="text-gray-500">Menu Type:</span>
                          <div className="font-medium">{category.menu_type}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Limit:</span>
                          <div className="font-medium">{category.category_limit}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Position:</span>
                          <div className="font-medium">{category.position}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEditCategory;