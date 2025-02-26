import React, { useState, useEffect } from 'react';
import { Save, Loader2, AlertCircle } from 'lucide-react';

const MenuPricingForm = () => {
  const [events, setEvents] = useState([]);
  const [gscdMenus, setGscdMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    event_category: '',
    gscd: '',
    veg_price: '',
    nonveg_price: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, gscdResponse] = await Promise.all([
          fetch('https://adminmahaspice.in/ms3/get_events.php'),
          fetch('https://adminmahaspice.in/ms3/getgscd.php')
        ]);

        if (!eventsResponse.ok || !gscdResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const eventsData = await eventsResponse.json();
        const gscdData = await gscdResponse.json();

        setEvents(eventsData);
        setGscdMenus(gscdData.data || []);
      } catch (error) {
        setError('Failed to fetch data: ' + error.message);
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://adminmahaspice.in/ms3/insert_pricing.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        mode: 'cors' // Explicitly set CORS mode
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSuccess('Pricing added successfully!');
        setFormData({
          event_category: '',
          gscd: '',
          veg_price: '',
          nonveg_price: ''
        });
      } else {
        setError(data.message || 'Failed to add pricing');
      }
    } catch (error) {
      setError('Failed to submit data: ' + error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Menu Pricing</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Event Category Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Event Category
          </label>
          <select
            value={formData.event_category}
            onChange={(e) => setFormData({ ...formData, event_category: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select Event Category</option>
            {events.map((event) => (
              <option key={event.event_id} value={event.event_category}>
                {event.event_category}
              </option>
            ))}
          </select>
        </div>

        {/* GSCD Menu Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Menu Type
          </label>
          <select
            value={formData.gscd}
            onChange={(e) => setFormData({ ...formData, gscd: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select Menu Type</option>
            {gscdMenus.map((menu) => (
              <option key={menu.id} value={menu.menu_type}>
                {menu.menu_type}
              </option>
            ))}
          </select>
        </div>

        {/* Price Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Veg Price
            </label>
            <input
              type="number"
              value={formData.veg_price}
              onChange={(e) => setFormData({ ...formData, veg_price: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Non-Veg Price
            </label>
            <input
              type="number"
              value={formData.nonveg_price}
              onChange={(e) => setFormData({ ...formData, nonveg_price: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {loading ? 'Saving...' : 'Save Pricing'}
        </button>
      </form>
    </div>
  );
};

export default MenuPricingForm;