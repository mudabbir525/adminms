import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const AddGST = () => {
  const [formData, setFormData] = useState({
    service_type: '',
    gst_percentage: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const serviceTypes = [
    { value: 'box_genie', label: 'Box Genie' },
    { value: 'home_delivery', label: 'Home Delivery' },
    { value: 'bulk_catering', label: 'Bulk Catering' },
    { value: 'superfast', label: 'Superfast' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/addgst.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setFormData({
          service_type: '',
          gst_percentage: ''
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to add GST rate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add GST Rate</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="service_type" className="block text-sm font-medium text-gray-700">
                Service Type
              </label>
              <select
                id="service_type"
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a service type</option>
                {serviceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="gst_percentage" className="block text-sm font-medium text-gray-700">
                GST Percentage
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="gst_percentage"
                  id="gst_percentage"
                  value={formData.gst_percentage}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter GST percentage"
                  step="0.01"
                  min="0"
                  max="100"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={16} />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add GST Rate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGST;