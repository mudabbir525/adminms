import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, AlertCircle, Loader } from 'lucide-react';

const DisplayGST = () => {
  const [gstRates, setGstRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const serviceTypeLabels = {
    box_genie: 'Box Genie',
    home_delivery: 'Home Delivery',
    bulk_catering: 'Bulk Catering',
    superfast: 'Superfast'
  };

  useEffect(() => {
    fetchGSTRates();
  }, []);

  const fetchGSTRates = async () => {
    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/displaygst.php');
      const data = await response.json();
      
      if (data.success) {
        setGstRates(data.data);
      } else {
        setError(data.message || 'Failed to fetch GST rates');
      }
    } catch (err) {
      setError('Error fetching GST rates');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const rate = gstRates.find(r => r.id === id);
    setEditingId(id);
    setEditValue(rate.gst_percentage);
  };

  const handleSave = async (id) => {
    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/editgst.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          gst_percentage: parseFloat(editValue)
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGstRates(prev => 
          prev.map(rate => 
            rate.id === id ? { ...rate, gst_percentage: editValue } : rate
          )
        );
        setEditingId(null);
        setEditValue('');
      } else {
        setError(data.message || 'Failed to update GST rate');
      }
    } catch (err) {
      setError('Error updating GST rate');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this GST rate?')) {
      try {
        const response = await fetch('https://mahaspice.desoftimp.com/ms3/editgst.php', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();
        
        if (data.success) {
          setGstRates(prev => prev.filter(rate => rate.id !== id));
        } else {
          setError(data.message || 'Failed to delete GST rate');
        }
      } catch (err) {
        setError('Error deleting GST rate');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">GST Rates</h2>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700">
              <AlertCircle size={16} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GST Percentage
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gstRates.map((rate) => (
                  <tr key={rate.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {serviceTypeLabels[rate.service_type]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === rate.id ? (
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20 px-2 py-1 border rounded-md"
                          step="0.01"
                          min="0"
                          max="100"
                        />
                      ) : (
                        `${rate.gst_percentage}%`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {editingId === rate.id ? (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleSave(rate.id)}
                            className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEdit(rate.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(rate.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayGST;