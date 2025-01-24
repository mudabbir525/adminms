import React, { useState, useRef } from 'react';
import { Save, Upload, X } from 'lucide-react';

const CRPB = () => {
  const [formData, setFormData] = useState({
    name: '',
    position: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      alert('Please upload an image');
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('position', formData.position);
    formDataToSubmit.append('image', imageFile);

    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/addcrpb.php', {
        method: 'POST',
        body: formDataToSubmit
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      alert('Data inserted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        position: ''
      });
      removeImage();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to insert data');
    }
  };

  return (
    <div> <h2 className="text-2xl font-bold">CRPB Add</h2>
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
    
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="flex flex-col items-center">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
            id="imageUpload"
          />
          <label 
            htmlFor="imageUpload" 
            className="cursor-pointer w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-indigo-500 transition"
          >
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-lg"
                />
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeImage();
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="text-gray-400" size={32} />
                <span className="text-sm text-gray-500 mt-2">Upload Image</span>
              </div>
            )}
          </label>
        </div>

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Position Input */}
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Save className="mr-2" /> Save Data
        </button>
      </form>
    </div>
    </div>
  );
};

export default CRPB;