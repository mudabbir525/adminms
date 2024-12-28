import React, { useEffect, useState } from 'react';

const EditSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/getSectionTwo.php');
      const data = await response.json();
      setServices(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch services');
      setLoading(false);
    }
  };

  const handleImageUpdate = async (serviceName, file) => {
    try {
      const formData = new FormData();
      formData.append('service_name', serviceName);
      formData.append('image', file);

      const response = await fetch('https://mahaspice.desoftimp.com/ms3/updateSection.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        fetchServices(); // Refresh the list
        alert('Image updated successfully');
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      alert('Failed to update image: ' + err.message);
    }
  };

  const handleDelete = async (serviceName) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/deleteSection.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service_name: serviceName })
      });

      const result = await response.json();
      
      if (result.success) {
        fetchServices(); // Refresh the list
        alert('Service deleted successfully');
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      alert('Failed to delete service: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Edit Services</h2>
      <div className="space-y-6">
        {services.map((service) => (
          <div key={service.service_name} className="border rounded-lg p-4 bg-white shadow">
            <h3 className="text-xl font-semibold mb-2">{service.service_name}</h3>
            <div className="flex items-center gap-4">
              <img
                src={`https://mahaspice.desoftimp.com/ms3/${service.image_path}`}
                alt={service.service_name}
                className="w-32 h-32 object-cover rounded"
                
              />
              <div className="flex-1 space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageUpdate(service.service_name, e.target.files[0]);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {/* <button
                  onClick={() => handleDelete(service.service_name)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Delete Service
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditSection;