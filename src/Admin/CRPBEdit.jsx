import React, { useState, useRef, useEffect } from 'react';
import { Save, Upload, X, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const CRPBEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Try to get entry from navigation state first
  const [entry, setEntry] = useState(location.state?.entry);
  
  const [formData, setFormData] = useState({
    id: id,
    name: entry?.name || '',
    position: entry?.position || '',
    veg_price: entry?.veg_price || '',
    nonveg_price: entry?.nonveg_price || ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(entry?.img_address ? `https://mahaspice.desoftimp.com/ms3/${entry.img_address}` : null);
  const fileInputRef = useRef(null);

  // Fetch entry details if not passed via navigation
  useEffect(() => {
    if (!entry) {
      const fetchEntry = async () => {
        try {
          const response = await fetch(`https://mahaspice.desoftimp.com/ms3/getcrpbbyid.php?id=${id}`);
          const data = await response.json();
          setEntry(data);
          setFormData({
            id: data.id,
            name: data.name,
            position: data.position,
            veg_price: data.veg_price,
            nonveg_price: data.nonveg_price
          });
          setImagePreview(`https://mahaspice.desoftimp.com/ms3/${data.img_address}`);
        } catch (error) {
          console.error('Error fetching entry:', error);
          alert('Failed to fetch entry details');
        }
      };
      
      fetchEntry();
    }
  }, [id, entry]);

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
    
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('id', formData.id);
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('position', formData.position);
    formDataToSubmit.append('veg_price', formData.veg_price);
    formDataToSubmit.append('nonveg_price', formData.nonveg_price);
    
    if (imageFile) {
      formDataToSubmit.append('image', imageFile);
    }

    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/editcrpb.php', {
        method: 'POST',
        body: formDataToSubmit
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Updated successfully');
        navigate(-1); // Go back to previous page
      } else {
        alert('Update failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update data');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="mr-2" /> Back
      </button>
      
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
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

          {/* Veg Price Input */}
          <div>
            <label htmlFor="veg_price" className="block text-sm font-medium text-gray-700">
              Veg Price
            </label>
            <input
              type="number"
              id="veg_price"
              name="veg_price"
              value={formData.veg_price}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Non-Veg Price Input */}
          <div>
            <label htmlFor="nonveg_price" className="block text-sm font-medium text-gray-700">
              Non-Veg Price
            </label>
            <input
              type="number"
              id="nonveg_price"
              name="nonveg_price"
              value={formData.nonveg_price}
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
            <Save className="mr-2" /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default CRPBEditPage;
