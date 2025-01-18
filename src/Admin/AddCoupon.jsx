import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';

const AddCoupon = () => {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    max_discount: '',
    min_order_value: '',
    valid_from: '',
    valid_until: '',
    usage_limit: '',
    coupon_type: 'box_genie',
    is_active: true
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/addcoupon.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Coupon created successfully!');
        setFormData({
          code: '',
          description: '',
          discount_type: 'percentage',
          discount_value: '',
          max_discount: '',
          min_order_value: '',
          valid_from: '',
          valid_until: '',
          usage_limit: '',
          coupon_type: 'box_genie',
          is_active: true
        });
      } else {
        setError(data.message || 'Failed to create coupon');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Coupon</h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code*
                </label>
                <input
                  type="text"
                  name="code"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.code}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Type*
                </label>
                <select
                  name="coupon_type"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.coupon_type}
                  onChange={handleChange}
                >
                  <option value="box_genie">Box Genie</option>
                  <option value="home_delivery">Home Delivery</option>
                  <option value="bulk_catering">Bulk Catering</option>
                  <option value="superfast">Superfast</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type*
                </label>
                <select
                  name="discount_type"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.discount_type}
                  onChange={handleChange}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value*
                </label>
                <input
                  type="number"
                  name="discount_value"
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.discount_value}
                  onChange={handleChange}
                />
              </div>

              {formData.discount_type === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Discount Amount
                  </label>
                  <input
                    type="number"
                    name="max_discount"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.max_discount}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Order Value
                </label>
                <input
                  type="number"
                  name="min_order_value"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.min_order_value}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid From*
                  </label>
                  <input
                    type="datetime-local"
                    name="valid_from"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.valid_from}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until*
                  </label>
                  <input
                    type="datetime-local"
                    name="valid_until"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.valid_until}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usage Limit
                </label>
                <input
                  type="number"
                  name="usage_limit"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.usage_limit}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {loading ? (
                  'Creating...'
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Create Coupon
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCoupon;