import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const EventEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    event_name: '',
    event_category: '',
    event_veg_price: '',
    event_nonveg_price: '',
    event_description: '',
    event_file_path: ''
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(` https://mahaspice.desoftimp.com/ms3/get_event_details.php?id=${id}`);
      const data = await response.json();
      
      setEvent(data);
      
      // Set existing images
      if (data.event_file_path) {
        setExistingImages(data.event_file_path.split(','));
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      alert('Failed to fetch event details');
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
    const files = Array.from(e.target.files);
    const filePreviews = files.map(file => URL.createObjectURL(file));
    
    setSelectedFiles([...selectedFiles, ...files]);
    setExistingImages([...existingImages, ...filePreviews]);
  };

  const removeImage = (index, isNew = false) => {
    if (isNew) {
      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles.splice(index, 1);
      setSelectedFiles(newSelectedFiles);
      
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);
      setExistingImages(newExistingImages);
    } else {
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);
      setExistingImages(newExistingImages);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('event_id', event.event_id);
    formData.append('event_name', event.event_name);
    formData.append('event_category', event.event_category);
    formData.append('event_veg_price', event.event_veg_price);
    formData.append('event_nonveg_price', event.event_nonveg_price);
    formData.append('event_description', event.event_description);
    
    // Add existing images that were not removed
    const remainingOldImages = existingImages.filter(
      img => img.startsWith('http') || img.startsWith('uploads')
    );
    formData.append('existing_images', remainingOldImages.join(','));
    
    // Add new files
    selectedFiles.forEach((file, index) => {
      formData.append(`new_images[]`, file);
    });

   try {
  const response = await fetch(' https://mahaspice.desoftimp.com/ms3/update_event.php', {
    method: 'POST',
    body: formData,  // No need to set 'Content-Type' here
  });

  const result = await response.json();

  if (result.success) {
    alert('Event updated successfully!');
    navigate('/admineventdisplay'); // Redirect to events list
  } else {
    alert(result.error || 'Update failed');
  }
} catch (error) {
  console.error('Error:', error);
  alert('An error occurred');
}

  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      
      <form onSubmit={handleSubmit} enctype="multipart/form-data" className="space-y-4">
        {/* Event Name */}
        <input type="number" name="event_id"  value={event.event_id} hidden />
        <div>
          <label className="block text-gray-700 font-bold mb-2">Event Name</label>
          <input
            type="text"
            name="event_name"
            value={event.event_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Event Category */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Event Category</label>
          <input
            type="text"
            name="event_category"
            value={event.event_category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Veg Price</label>
            <input
              type="number"
              name="event_veg_price"
              value={event.event_veg_price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Non-Veg Price</label>
            <input
              type="number"
              name="event_nonveg_price"
              value={event.event_nonveg_price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Event Description</label>
          <textarea
            name="event_description"
            value={event.event_description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Event Images</label>
          <div className="flex items-center">
            <input
              type="file"
              id="eventImages"
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            <label 
              htmlFor="eventImages" 
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300"
            >
              <Upload className="mr-2" /> Add Images
            </label>
          </div>

          {/* Image Previews */}
          <div className="mt-4 grid grid-cols-4 gap-4">
            {existingImages.map((imagePath, index) => (
              <div key={index} className="relative">
                <img 
                  src={
                    imagePath.startsWith('http') || imagePath.startsWith('uploads')
                      ? (imagePath.startsWith('http') ? imagePath : ` /${imagePath}`)
                      : imagePath
                  }
                  alt={`Event Image ${index + 1}`} 
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Update Event
        </button>
      </form>
    </div>
  );
};

export default EventEditPage;