import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, X, Loader2, AlertCircle, Filter } from 'lucide-react';

const MenuPricingDisplay = () => {
  const [pricings, setPricings] = useState([]);
  const [filteredPricings, setFilteredPricings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  const [gscdMenus, setGscdMenus] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '',
    event_name: '',
    event_category: '',
    gscd: '',
    veg_price: '',
    nonveg_price: ''
  });
  
  // Filter state
  const [filters, setFilters] = useState({
    event_name: '',
    event_category: '',
    gscd: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Apply filters whenever pricings or filters change
  useEffect(() => {
    applyFilters();
  }, [pricings, filters]);

  const fetchData = async () => {
    try {
      const [pricingsRes, eventsRes, gscdRes] = await Promise.all([
        fetch('https://adminmahaspice.in/ms3/get_pricing.php'),
        fetch('https://adminmahaspice.in/ms3/get_events.php'),
        fetch('https://adminmahaspice.in/ms3/getgscd.php')
      ]);

      const [pricingsData, eventsData, gscdData] = await Promise.all([
        pricingsRes.json(),
        eventsRes.json(),
        gscdRes.json()
      ]);

      console.log(eventsData);

      // Merge event_name into pricing data
      const pricingsWithEventName = (pricingsData.data || []).map(pricing => {
        const matchingEvent = eventsData.find(event => 
          event.event_category === pricing.event_category
        );
        return {
          ...pricing,
          event_name: matchingEvent ? matchingEvent.event_name : ''
        };
      });

      setPricings(pricingsWithEventName);
      setFilteredPricings(pricingsWithEventName);
      setEvents(eventsData || []);
      setGscdMenus(gscdData.data || []);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...pricings];
    
    // Filter by event name
    if (filters.event_name) {
      result = result.filter(pricing => 
        pricing.event_name === filters.event_name
      );
    }
    
    // Filter by event category
    if (filters.event_category) {
      result = result.filter(pricing => 
        pricing.event_category === filters.event_category
      );
    }
    
    // Filter by menu type
    if (filters.gscd) {
      result = result.filter(pricing => 
        pricing.gscd === filters.gscd
      );
    }
    
    setFilteredPricings(result);
  };

  const handleFilterChange = (field, value) => {
    // If changing event_name, reset event_category if needed
    if (field === 'event_name') {
      setFilters(prev => ({
        ...prev,
        [field]: value,
        // Reset category when changing event name
        event_category: ''
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const resetFilters = () => {
    setFilters({
      event_name: '',
      event_category: '',
      gscd: ''
    });
  };

  const handleEdit = (pricing) => {
    setEditFormData({
      id: pricing.id,
      event_name: pricing.event_name || '',
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
      // Remove event_name from the data sent to the API
      const { event_name, ...dataToUpdate } = editFormData;
      
      const response = await fetch('https://adminmahaspice.in/ms3/update_pricing.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate)
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
      const response = await fetch('https://adminmahaspice.in/ms3/delete_pricing.php', {
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

  // Get unique event names from events data
  const uniqueEventNames = [...new Set(events.map(event => event.event_name))];
  
  // Get filtered event categories based on selected event name
  const getFilteredEventCategories = () => {
    if (!filters.event_name) return events;
    return events.filter(event => event.event_name === filters.event_name);
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

      {/* Filter section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-700">Filter Options</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Event Name Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name
            </label>
            <select
              value={filters.event_name}
              onChange={(e) => handleFilterChange('event_name', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Event Names</option>
              {uniqueEventNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Event Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Category
            </label>
            <select
              value={filters.event_category}
              onChange={(e) => handleFilterChange('event_category', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Event Categories</option>
              {getFilteredEventCategories().map((event) => (
                <option key={event.event_id} value={event.event_category}>
                  {event.event_category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Menu Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Menu Type
            </label>
            <select
              value={filters.gscd}
              onChange={(e) => handleFilterChange('gscd', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Menu Types</option>
              {gscdMenus.map((menu) => (
                <option key={menu.id} value={menu.menu_type}>
                  {menu.menu_type}
                </option>
              ))}
            </select>
          </div>
          
          {/* Reset Button */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredPricings.length} of {pricings.length} pricing entries
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Event Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Event Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Menu Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Veg Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Non-Veg Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPricings.length > 0 ? (
              filteredPricings.map((pricing) => (
                <tr key={pricing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{pricing.event_name}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No pricing entries match your filter criteria
                </td>
              </tr>
            )}
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
              {/* Event Name (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  value={editFormData.event_name}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-50 text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">*Cannot be edited directly</p>
              </div>
            
              {/* Event Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Category
                </label>
                <select
                  value={editFormData.event_category}
                  onChange={(e) => {
                    // Find matching event to get the event_name
                    const matchingEvent = events.find(event => event.event_category === e.target.value);
                    setEditFormData({
                      ...editFormData,
                      event_category: e.target.value,
                      event_name: matchingEvent ? matchingEvent.event_name : ''
                    });
                  }}
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

              {/* Menu Type */}
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

              {/* Veg Price */}
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

              {/* Non-Veg Price */}
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

              {/* Action Buttons */}
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