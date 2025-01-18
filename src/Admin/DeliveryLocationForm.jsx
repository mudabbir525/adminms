import React, { useState } from 'react';
import { Plus, MapPin, IndianRupee } from 'lucide-react';

const DeliveryLocationForm = () => {
  const [location, setLocation] = useState('');
  const [services, setServices] = useState({
    box_genie: { checked: false, price: '' },
    home_delivery: { checked: false, price: '' },
    bulk_catering: { checked: false, price: '' },
    superfast: { checked: false, price: '' }
  });

  const handleServiceChange = (service) => {
    setServices(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        checked: !prev[service].checked
      }
    }));
  };

  const handlePriceChange = (service, value) => {
    setServices(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        price: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const deliveryData = Object.entries(services)
      .filter(([_, value]) => value.checked)
      .map(([service, value]) => ({
        location,
        service_type: service,
        price: parseFloat(value.price)
      }));

    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/add_delivery_location.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locations: deliveryData }),
      });

      if (!response.ok) throw new Error('Failed to add location');

      setLocation('');
      setServices({
        box_genie: { checked: false, price: '' },
        home_delivery: { checked: false, price: '' },
        bulk_catering: { checked: false, price: '' },
        superfast: { checked: false, price: '' }
      });

      alert('Location added successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add location');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Add Delivery Location</h2>
          <p className="mt-2 text-sm text-gray-600">Configure delivery services and pricing for a new location</p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Location Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  placeholder="Enter location name"
                  required
                />
              </div>
            </div>

            {/* Services Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Services</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                {Object.entries(services).map(([service, value]) => (
                  <div key={service} 
                       className="flex flex-wrap items-center gap-4 p-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-200">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value.checked}
                        onChange={() => handleServiceChange(service)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition duration-150 ease-in-out"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {service.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </label>
                    
                    {value.checked && (
                      <div className="relative flex-1 max-w-xs">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IndianRupee className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          value={value.price}
                          onChange={(e) => handlePriceChange(service, e.target.value)}
                          placeholder="Enter price"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                          required
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Location
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeliveryLocationForm;