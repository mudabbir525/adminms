import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, X, Upload } from 'lucide-react';

const BASE_URL = 'https://mahaspice.desoftimp.com/ms3';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState({
    id: null,
    title: '',
    description: '',
    bulletPoints: [''],
    imgAddress: '',
    position: 0
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchFaqs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get_faq.php`);
      const data = await response.json();
      if (data.success) {
        setFaqs(data.data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('data', JSON.stringify(currentFaq));
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    
    const url = isEditing ? `${BASE_URL}/edit_faq.php` : `${BASE_URL}/add_faq.php`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        fetchFaqs();
        setIsModalOpen(false);
        resetForm();
      } else {
        alert(data.message || 'Error saving FAQ');
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Error saving FAQ');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        const response = await fetch(`${BASE_URL}/delete_faq.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        
        const data = await response.json();
        if (data.success) {
          fetchFaqs();
        } else {
          alert(data.message || 'Error deleting FAQ');
        }
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        alert('Error deleting FAQ');
      }
    }
  };

  const handleEdit = (faq) => {
    setCurrentFaq({
      ...faq,
      id: faq.id,
      bulletPoints: Array.isArray(faq.bullet_points) ? faq.bullet_points : JSON.parse(faq.bullet_points),
      imgAddress: faq.img_address || ''
    });
    setPreviewUrl(faq.img_address ? `${BASE_URL}${faq.img_address}` : '');
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setCurrentFaq({
      id: null,
      title: '',
      description: '',
      bulletPoints: [''],
      imgAddress: '',
      position: 0
    });
    setSelectedImage(null);
    setPreviewUrl('');
    setIsEditing(false);
  };

  const addBulletPoint = () => {
    setCurrentFaq({
      ...currentFaq,
      bulletPoints: [...currentFaq.bulletPoints, '']
    });
  };

  const removeBulletPoint = (index) => {
    const newBulletPoints = currentFaq.bulletPoints.filter((_, i) => i !== index);
    setCurrentFaq({
      ...currentFaq,
      bulletPoints: newBulletPoints
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">FAQ Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <PlusCircle size={20} />
          Add FAQ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white p-6 rounded-lg shadow-md">
            <img
              src={faq.img_address ? `${BASE_URL}${faq.img_address}` : '/api/placeholder/400/200'}
              alt={faq.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{faq.title}</h2>
            <p className="text-gray-600 mb-4">{faq.description}</p>
            <ul className="list-disc pl-6 mb-4">
              {(Array.isArray(faq.bullet_points) ? faq.bullet_points : JSON.parse(faq.bullet_points)).map((point, index) => (
                <li key={index} className="text-gray-700">{point}</li>
              ))}
            </ul>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleEdit(faq)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">
                {isEditing ? 'Edit FAQ' : 'Add FAQ'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={currentFaq.title}
                  onChange={(e) => setCurrentFaq({...currentFaq, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={currentFaq.description}
                  onChange={(e) => setCurrentFaq({...currentFaq, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  rows="3"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <div className="flex items-center gap-4">
                  {(previewUrl || currentFaq.imgAddress) && (
                    <img
                      src={previewUrl || `${BASE_URL}${currentFaq.imgAddress}`}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                      accept="image/*"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center gap-2 cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
                    >
                      <Upload size={20} />
                      {isEditing ? 'Change Image' : 'Upload Image'}
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bullet Points</label>
                {currentFaq.bulletPoints.map((point, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => {
                        const newBulletPoints = [...currentFaq.bulletPoints];
                        newBulletPoints[index] = e.target.value;
                        setCurrentFaq({...currentFaq, bulletPoints: newBulletPoints});
                      }}
                      className="flex-1 px-3 py-2 border rounded"
                      required
                    />
                    {currentFaq.bulletPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBulletPoint(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBulletPoint}
                  className="text-blue-500 hover:text-blue-600"
                >
                  + Add Bullet Point
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input
                  type="number"
                  value={currentFaq.position}
                  onChange={(e) => setCurrentFaq({...currentFaq, position: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                />
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {isEditing ? 'Save Changes' : 'Add FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;