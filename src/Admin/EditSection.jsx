import React, { useEffect, useState } from 'react';

const EditSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingName, setEditingName] = useState(null);
  const [newName, setNewName] = useState('');

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

  const handleNameUpdate = async (oldServiceName) => {
    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/updateServiceName.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_service_name: oldServiceName,
          new_service_name: newName
        })
      });

      const result = await response.json();
      
      if (result.success) {
        fetchServices();
        setEditingName(null);
        setNewName('');
        alert('Service name updated successfully');
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      alert('Failed to update service name: ' + err.message);
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
        fetchServices();
        alert('Image updated successfully');
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      alert('Failed to update image: ' + err.message);
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
            <div className="flex justify-between items-center mb-2">
              {editingName === service.service_name ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border rounded px-2 py-1"
                    placeholder="Enter new name"
                  />
                  <button
                    onClick={() => handleNameUpdate(service.service_name)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingName(null);
                      setNewName('');
                    }}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">{service.service_name}</h3>
                  <button
                    onClick={() => {
                      setEditingName(service.service_name);
                      setNewName(service.service_name);
                    }}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Edit Name
                  </button>
                </>
              )}
            </div>
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditSection;