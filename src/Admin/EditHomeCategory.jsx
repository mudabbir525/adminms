import React, { useState, useEffect } from 'react';

const EditHomeCategories = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryType, setEditedCategoryType] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://adminmahaspice.in/ms3/getHomeCategory.php');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
        // Clear any existing messages when successfully loading
        setMessage('');
        setStatus('');
      } else {
        setMessage('Failed to load categories.');
        setStatus('error');
      }
    } catch (error) {
      setMessage('An error occurred while fetching categories.');
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setEditingCategory(category.id);
    setEditedCategoryType(category.category_type);
  };

  const handleSave = async (id) => {
    if (!editedCategoryType.trim()) {
      setMessage('Category type cannot be empty.');
      setStatus('error');
      return;
    }

    try {
      const response = await fetch('https://adminmahaspice.in/ms3/updateHomeCategory.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, category_type: editedCategoryType.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Category updated successfully!');
        setStatus('success');
        setEditingCategory(null);
        setEditedCategoryType('');
        fetchCategories();
      } else {
        setMessage(data.message || 'Failed to update category.');
        setStatus('error');
      }
    } catch (error) {
      setMessage('An error occurred while updating the category.');
      setStatus('error');
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setEditedCategoryType('');
    // Clear any existing messages
    setMessage('');
    setStatus('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch('https://adminmahaspice.in/ms3/deleteHomeCategory.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();

        if (data.success) {
          setMessage('Category deleted successfully!');
          setStatus('success');
          fetchCategories();
        } else {
          setMessage(data.message || 'Failed to delete category.');
          setStatus('error');
        }
      } catch (error) {
        console.error('Delete error:', error);
        setMessage('An error occurred while deleting the category.');
        setStatus('error');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Home Categories
        </h2>

        {message && (
          <div
            className={`p-4 rounded-md mb-4 ${
              status === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingCategory === category.id ? (
                        <input
                          type="text"
                          value={editedCategoryType}
                          onChange={(e) => setEditedCategoryType(e.target.value)}
                          className="border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        category.category_type
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingCategory === category.id ? (
                        <div className="space-x-4">
                          <button
                            onClick={() => handleSave(category.id)}
                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md transition-colors duration-200"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="space-x-4">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-700 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EditHomeCategories;