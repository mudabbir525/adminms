import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, X, Loader2, AlertCircle } from 'lucide-react';

const MenuPricingDisplay = () => {
  const [pricings, setPricings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  const [gscdMenus, setGscdMenus] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '',
    event_category: '',
    gscd: '',
    veg_price: '',
    nonveg_price: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pricingsRes, eventsRes, gscdRes] = await Promise.all([
        fetch('https://mahaspice.desoftimp.com/ms3/get_pricing.php'),
        fetch('https://mahaspice.desoftimp.com/ms3/get_events.php'),
        fetch('https://mahaspice.desoftimp.com/ms3/getgscd.php')
      ]);

      const [pricingsData, eventsData, gscdData] = await Promise.all([
        pricingsRes.json(),
        eventsRes.json(),
        gscdRes.json()
      ]);

      setPricings(pricingsData.data || []);
      setEvents(eventsData || []);
      setGscdMenus(gscdData.data || []);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pricing) => {
    setEditFormData({
      id: pricing.id,
      event_category: pricing.event_category,
      gscd: pricing.gscd,
      veg_price: pricing.veg_price,
      nonveg_price: pricing.nonveg_price
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/update_pricing.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });

      const data = await response.json();
      if (data.success) {
        setPricings(pricings.map(p => 
          p.id === editFormData.id ? { ...p, ...editFormData } : p
        ));
        setShowEditModal(false);
      } else {
        setError(data.message || 'Update failed');
      }
    } catch (err) {
      setError('Failed to update pricing');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing?')) return;

    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/delete_pricing.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      if (data.success) {
        setPricings(pricings.filter(pricing => pricing.id !== id));
      } else {
        throw new Error(data.message || 'Failed to delete');
      }
    } catch (err) {
      setError('Failed to delete pricing');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu Pricing List</h2>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Event Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Menu Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Veg Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Non-Veg Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pricings.map((pricing) => (
              <tr key={pricing.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">{pricing.event_category}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{pricing.gscd}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{pricing.veg_price}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{pricing.nonveg_price}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(pricing)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pricing.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Menu Pricing</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Category
                </label>
                <select
                  value={editFormData.event_category}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    event_category: e.target.value
                  })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Menu Type
                </label>
                <select
                  value={editFormData.gscd}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    gscd: e.target.value
                  })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Veg Price
                </label>
                <input
                  type="number"
                  value={editFormData.veg_price}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    veg_price: e.target.value
                  })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Non-Veg Price
                </label>
                <input
                  type="number"
                  value={editFormData.nonveg_price}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    nonveg_price: e.target.value
                  })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPricingDisplay;