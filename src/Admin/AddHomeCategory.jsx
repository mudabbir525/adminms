import React, { useState } from 'react';

const AddHomeCategory = () => {
  const [categoryType, setCategoryType] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(''); // 'success' | 'error' | ''
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryType.trim()) {
      setMessage('Category Type is required.');
      setStatus('error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setStatus('');

    try {
      const response = await fetch('https://adminmahaspice.in/ms3/addHomeCategory.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category_type: categoryType.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Category added successfully!');
        setStatus('success');
        setCategoryType('');
      } else {
        setMessage(data.message || 'Failed to add category. Please try again.');
        setStatus('error');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Add Home Category
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label 
            htmlFor="categoryType"
            className="block text-sm font-medium text-gray-700"
          >
            Category Type
          </label>
          <input
            type="text"
            id="categoryType"
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value)}
            placeholder="Enter category type"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            disabled={isLoading}
          />
        </div>
        
        {message && (
          <div className={`p-4 rounded-md ${
            status === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${isLoading 
              ? 'bg-black cursor-not-allowed' 
              : 'bg-black hover:bg-blue-700 active:bg-blue-800'
            } transition-colors duration-200`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg 
                className="animate-spin h-5 w-5 mr-2" 
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Adding Category...
            </div>
          ) : (
            'Add Category'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddHomeCategory;