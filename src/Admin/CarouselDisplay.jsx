import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const DisplayCarousel = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [showStatus, setShowStatus] = useState('all'); // 'all', 'active', 'inactive'

  useEffect(() => {
    fetchCarouselItems();
  }, []);

  // Function to fetch carousel items from the backend
  const fetchCarouselItems = async () => {
    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/getCarouselAdmin.php');
      const data = await response.json();
      setCarouselItems(data);
    } catch (error) {
      console.error('Error fetching carousel items:', error);
    }
  };

  // Function to delete a carousel item
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        const response = await fetch('https://mahaspice.desoftimp.com/ms3/deletecarousel.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `id=${id}`
        });

        const result = await response.json();

        if (result.success) {
          alert('Slide deleted successfully');
          fetchCarouselItems();
        } else {
          throw new Error(result.message || 'Failed to delete slide');
        }
      } catch (error) {
        console.error('Error deleting slide:', error);
        alert('Failed to delete slide: ' + error.message);
      }
    }
  };

  // Filter carousel items based on the selected status
  const filteredItems = carouselItems.filter(item => {
    if (showStatus === 'all') return true;
    if (showStatus === 'active') return item.is_active === '1'; // is_active is a string, so check accordingly
    if (showStatus === 'inactive') return item.is_active === '0';
    return true;
  });

  return (
    <div className="w-full overflow-hidden">
      {/* Filter Controls */}
      <div className="mb-4 flex space-x-2">
        <button 
          onClick={() => setShowStatus('all')} 
          className={`px-4 py-2 rounded-lg ${showStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button 
          onClick={() => setShowStatus('active')} 
          className={`px-4 py-2 rounded-lg ${showStatus === 'active' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Active
        </button>
        <button 
          onClick={() => setShowStatus('inactive')} 
          className={`px-4 py-2 rounded-lg ${showStatus === 'inactive' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
        >
          Inactive
        </button>
      </div>

      <div className="flex flex-wrap -mx-2">
        {filteredItems.map((item) => (
          <div key={item.id} className="w-1/4 px-2 p-3 mb-4">
            <div className={`max-w-[400px] h-[250px] bg-white rounded-lg shadow-md relative ${item.is_active === '0' && 'opacity-75'}`}>
              {/* Status Badge */}
              <div className={`absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-medium ${
                item.is_active === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {item.is_active === '1' ? 'Active' : 'Inactive'}
              </div>

              <div className="relative aspect-video">
                {item.media_type === 'image' ? (
                  <img
                    src={`https://mahaspice.desoftimp.com/ms3/uploads/carousel/${item.media_path}`}
                    alt={item.button_text}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={`https://mahaspice.desoftimp.com/ms3/uploads/carousel/${item.media_path}`}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
              </div>

              <div className="p-2">
                <h3 className="text-sm font-semibold mb-1 truncate">{item.button_text}</h3>
                <p className="text-gray-600 text-xs truncate">{item.description}</p>
                {/* Admin Controls */}
                <div className="absolute bottom-2 right-2 flex space-x-2 z-10 bg-white/80 rounded-lg p-2">
                  {/* <button
                    onClick={() => window.location.href = `editCarousel/${item.id}`}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Pencil size={20} />
                  </button> */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayCarousel;