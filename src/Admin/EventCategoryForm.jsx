import React, { useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';

const EventCategoryForm = () => {
  const [eventName, setEventName] = useState('');
  const [subCategoryCount, setSubCategoryCount] = useState(0);
  const [subCategories, setSubCategories] = useState([]);

  const handleSubCategoryCountChange = (count) => {
    setSubCategoryCount(count);
    
    // Create an array of sub-category objects with independent file uploads
    const newSubCategories = Array.from({ length: count }, () => ({
      eventCategory: '',
      eventVegPrice: '',
      eventNonvegPrice: '',
      eventInfo: '',
      eventFiles: [], // Array to store multiple files
      eventFilesPreviews: [] // Array to store file previews
    }));
    
    setSubCategories(newSubCategories);
  };

  const handleSubCategoryChange = (index, field, value) => {
    const updatedSubCategories = [...subCategories];
    updatedSubCategories[index][field] = value;
    setSubCategories(updatedSubCategories);
  };

  const handleFileChange = (index, e) => {
    const files = Array.from(e.target.files);
    const updatedSubCategories = [...subCategories];
    
    // Reset existing files and previews
    updatedSubCategories[index].eventFiles = [];
    updatedSubCategories[index].eventFilesPreviews = [];

    // Process each file
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedSubCategories[index].eventFiles.push(file);
        updatedSubCategories[index].eventFilesPreviews.push(reader.result);
        setSubCategories([...updatedSubCategories]);
      };
      
      reader.readAsDataURL(file);
    });
  };

  const removeFilePreview = (categoryIndex, fileIndex) => {
    const updatedSubCategories = [...subCategories];
    updatedSubCategories[categoryIndex].eventFiles.splice(fileIndex, 1);
    updatedSubCategories[categoryIndex].eventFilesPreviews.splice(fileIndex, 1);
    setSubCategories(updatedSubCategories);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('eventName', eventName);
    formData.append('subCategoriesCount', subCategoryCount);
    
    // Append sub-categories
    subCategories.forEach((category, index) => {
      formData.append(`eventCategory[${index}]`, category.eventCategory);
      formData.append(`eventVegPrice[${index}]`, category.eventVegPrice);
      formData.append(`eventNonvegPrice[${index}]`, category.eventNonvegPrice);
      formData.append(`eventInfo[${index}]`, category.eventInfo);
      
      // Append multiple files for each sub-category
      if (category.eventFiles && category.eventFiles.length > 0) {
        category.eventFiles.forEach((file, fileIndex) => {
          formData.append(`eventFile[${index}][]`, file);
        });
      }
    });

    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/submit_event.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        alert('Event and categories submitted successfully!');
        // Reset form
        setEventName('');
        setSubCategoryCount(0);
        setSubCategories([]);
      } else {
        alert(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Name Input */}
        <div className="mb-4">
          <label htmlFor="eventName" className="block text-gray-700 font-bold mb-2">
            Event Name
          </label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Event Name"
            required
          />
        </div>

        {/* Sub Category Count Input */}
        <div className="mb-4">
          <label htmlFor="subCategoryCount" className="block text-gray-700 font-bold mb-2">
            Number of Sub Categories
          </label>
          <div className="flex items-center">
            <input
              type="number"
              id="subCategoryCount"
              value={subCategoryCount}
              onChange={(e) => handleSubCategoryCountChange(Number(e.target.value))}
              min="0"
              max="10"
              className="w-20 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Dynamic Sub Category Inputs */}
        {subCategories.map((category, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-3">Sub Category {index + 1}</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Event Category"
                value={category.eventCategory}
                onChange={(e) => handleSubCategoryChange(index, 'eventCategory', e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Veg Price"
                value={category.eventVegPrice}
                onChange={(e) => handleSubCategoryChange(index, 'eventVegPrice', e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                step="0.01"
              />
              <input
                type="number"
                placeholder="Non-Veg Price"
                value={category.eventNonvegPrice}
                onChange={(e) => handleSubCategoryChange(index, 'eventNonvegPrice', e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                step="0.01"
              />
            </div>

            {/* Textarea for Event Info */}
            <div className="mb-4">
              <textarea
                placeholder="Event Category Description"
                value={category.eventInfo}
                onChange={(e) => handleSubCategoryChange(index, 'eventInfo', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>

            {/* File Upload with Multiple Image Preview */}
            <div className="mb-4">
              <label htmlFor={`eventFile${index}`} className="block text-gray-700 font-bold mb-2">
                Event Category Images (Multiple Upload)
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  id={`eventFile${index}`}
                  onChange={(e) => handleFileChange(index, e)}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <label 
                  htmlFor={`eventFile${index}`} 
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300"
                >
                  <Upload className="mr-2" />
                  Choose Images
                </label>
              </div>

              {/* Image Previews */}
              {category.eventFilesPreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {category.eventFilesPreviews.map((preview, fileIndex) => (
                    <div key={fileIndex} className="relative">
                      <img 
                        src={preview} 
                        alt={`Event Category Preview ${fileIndex + 1}`} 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFilePreview(index, fileIndex)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        {subCategories.length > 0 && (
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
          >
            <Plus className="mr-2" /> Submit Event Details
          </button>
        )}
      </form>
    </div>
  );
};

export default EventCategoryForm;