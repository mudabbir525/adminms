import React, { useState } from 'react';
import axios from 'axios';

const AddCP = () => {
  const [cpType, setCpType] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!cpType.trim()) {
      setMessage('CP Type cannot be empty');
      setIsError(true);
      return;
    }

    if (!selectedImage) {
      setMessage('Please select an image');
      setIsError(true);
      return;
    }

    try {
      // Create FormData object to send file
      const formData = new FormData();
      formData.append('cp_type', cpType);
      formData.append('image', selectedImage);

      const response = await axios.post(
        'https://adminmahaspice.in/ms3/cps.php', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Reset form and show success message
      setCpType('');
      setSelectedImage(null);
      setPreviewUrl(null);
      setMessage('CP Type added successfully');
      setIsError(false);
    } catch (error) {
      setMessage('Error adding CP Type: ' + (error.response?.data?.error || error.message));
      setIsError(true);
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form 
        onSubmit={handleSubmit} 
        className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add CP Type</h2>
        
        <div className="mb-4">
          <label 
            htmlFor="cpType" 
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            CP Type
          </label>
          <input 
            type="text"
            id="cpType"
            value={cpType}
            onChange={(e) => setCpType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
              leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter CP Type"
            required
          />
        </div>

        <div className="mb-4">
          <label 
            htmlFor="image" 
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Image
          </label>
          <input 
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
              leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {previewUrl && (
          <div className="mb-4">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full h-auto rounded-lg shadow-md"
              style={{ maxHeight: '200px' }}
            />
          </div>
        )}

        {message && (
          <div 
            className={`mb-4 p-3 rounded ${
              isError 
                ? 'bg-red-100 border border-red-400 text-red-700' 
                : 'bg-green-100 border border-green-400 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex items-center justify-center">
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 
              rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            Add CP Type
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCP;