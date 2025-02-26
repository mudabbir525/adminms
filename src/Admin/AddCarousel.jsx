import React, { useState } from 'react';
import { ImagePlus, VideoIcon, Upload, Link as LinkIcon, AlertCircle } from 'lucide-react';

const AddCarousel = () => {
  const [mediaType, setMediaType] = useState('image');
  const [formData, setFormData] = useState({
    media_file: null,
    button_text: '',
    link_url: '',
    is_active: true
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleMediaTypeChange = (type) => {
    setMediaType(type);
    setFormData(prev => ({ ...prev, media_file: null }));
    setPreview(null);
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split('/')[0];
    if (fileType !== mediaType) {
      setError(`Please select a ${mediaType} file`);
      e.target.value = '';
      return;
    }

    setFormData(prev => ({ ...prev, media_file: file }));
    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);
    setError('');

    return () => URL.revokeObjectURL(previewURL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('media_file', formData.media_file);
    formDataToSend.append('media_type', mediaType);
    formDataToSend.append('button_text', formData.button_text);
    formDataToSend.append('link_url', formData.link_url);
    formDataToSend.append('is_active', formData.is_active);

    try {
      const response = await fetch('https://adminmahaspice.in/ms3/addCarousel.php', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        alert('Carousel slide added successfully!');
        setFormData({
          media_file: null,
          button_text: '',
          link_url: '',
          is_active: true
        });
        setPreview(null);
        setError('');
      } else {
        throw new Error('Failed to add carousel slide');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Carousel Slide</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleMediaTypeChange('image')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              mediaType === 'image' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ImagePlus size={20} />
            Image
          </button>
          <button
            type="button"
            onClick={() => handleMediaTypeChange('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              mediaType === 'video' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <VideoIcon size={20} />
            Video
          </button>
        </div>

        <div className="relative">
          <label className="block mb-2 text-gray-700 font-medium">
            Upload {mediaType}:
          </label>
          <div className="mt-1 flex justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <input
                  type="file"
                  accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {preview && (
          <div className="mt-4 rounded-lg overflow-hidden bg-gray-50 p-2">
            {mediaType === 'image' ? (
              <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg" />
            ) : (
              <video src={preview} controls className="max-w-full h-auto rounded-lg" />
            )}
          </div>
        )}

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Button Text (optional)
            <input
              type="text"
              value={formData.button_text}
              onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Link URL
            <div className="mt-1 relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="url"
                value={formData.link_url}
                onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </label>
        </div>

        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">Active</span>
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 focus:ring-4 focus:ring-blue-200 transition-colors"
        >
          Add Slide
        </button>
      </form>
    </div>
  );
};

export default AddCarousel;