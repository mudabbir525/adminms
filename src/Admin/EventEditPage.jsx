import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const EventEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const BASE_URL = 'https://adminmahaspice.in/ms3/';

  const [event, setEvent] = useState({
    event_name: '',
    event_category: '',
    event_veg_price: '',
    event_nonveg_price: '',
    event_description: '',
    event_file_path: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState(null);
  const [originalEvent, setOriginalEvent] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}get_event_details.php?id=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      
      try {
        const data = JSON.parse(text);
        setEvent(data);
        setOriginalEvent(data);
        
        if (data.event_file_path) {
          const imagePath = data.event_file_path.startsWith('http') 
            ? data.event_file_path 
            : `${BASE_URL}${data.event_file_path}`;
          setImagePreview(imagePath);
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        setError('Invalid response format from server');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setError('Failed to fetch event details');
    }
  };

  const hasChanges = () => {
    if (!originalEvent) return false;
    
    return event.event_name !== originalEvent.event_name ||
           event.event_category !== originalEvent.event_category ||
           event.event_veg_price !== originalEvent.event_veg_price ||
           event.event_nonveg_price !== originalEvent.event_nonveg_price ||
           event.event_description !== originalEvent.event_description ||
           selectedFile !== null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasChanges()) {
      alert('No changes detected. Nothing to update.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('event_name', event.event_name);
      formData.append('event_category', event.event_category);
      formData.append('event_veg_price', event.event_veg_price);
      formData.append('event_nonveg_price', event.event_nonveg_price);
      formData.append('event_description', event.event_description);
      
      // Handle image
      if (selectedFile) {
        formData.append('event_image', selectedFile);
      } else if (imagePreview) {
        // Keep existing image
        const existingPath = imagePreview.includes('/uploads/event_categories/')
          ? 'uploads/event_categories/' + imagePreview.split('/uploads/event_categories/')[1]
          : '';
        formData.append('existing_image', existingPath);
      }

      const response = await fetch(`${BASE_URL}update_event.php`, {
        method: 'POST',
        body: formData
      });

      const text = await response.text();
      let result;
      
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.error('Response Text:', text);
        throw new Error('Invalid server response');
      }

      if (!result.success) {
        throw new Error(result.error || 'Update failed');
      }

      alert('Event updated successfully!');
      navigate('/admineventdisplay');
      
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setEvent(prev => ({
      ...prev,
      event_file_path: ''
    }));
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Event</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields remain the same */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Event Name
            </label>
            <input
              type="text"
              name="event_name"
              readOnly
              value={event.event_name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Event Category
            </label>
            <input
              type="text"
              name="event_category"
              value={event.event_category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Veg Price
              </label>
              <input
                type="number"
                name="event_veg_price"
                value={event.event_veg_price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Non-Veg Price
              </label>
              <input
                type="number"
                name="event_nonveg_price"
                value={event.event_nonveg_price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Event Description
            </label>
            <textarea
              name="event_description"
              value={event.event_description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Event Image
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="eventImage"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <label 
                htmlFor="eventImage" 
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300"
              >
                <Upload className="mr-2" /> Change Image
              </label>
            </div>

            {imagePreview && (
              <div className="mt-4 relative inline-block">
                <img 
                  src={imagePreview}
                  alt="Event"
                  className="w-64 h-48 object-cover rounded-lg"
                  onError={(e) => {
                    console.error('Image load error:', imagePreview);
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-300"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !hasChanges()}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-300"
          >
            {isSubmitting ? 'Updating...' : hasChanges() ? 'Update Event' : 'No Changes to Update'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventEditPage;