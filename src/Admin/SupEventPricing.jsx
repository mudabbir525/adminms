import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react';

const SupEventPricing = () => {
    const [pricings, setPricings] = useState([]);
    const [events, setEvents] = useState([]);
    const [crpbs, setCrpbs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseUrl = 'https://adminmahaspice.in/ms3/';

    const [formData, setFormData] = useState({
        id: '',
        event_id: '',
        selectedCrpbs: {},
        prices: {}
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [eventsRes, crpbsRes, pricingsRes] = await Promise.all([
                fetch(`${baseUrl}get_sup_events.php`),
                fetch(`${baseUrl}getcrpb.php`),
                fetch(`${baseUrl}get_sup_event_pricing.php`)
            ]);

            if (!eventsRes.ok || !crpbsRes.ok || !pricingsRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const [eventsData, crpbsData, pricingsData] = await Promise.all([
                eventsRes.json(),
                crpbsRes.json(),
                pricingsRes.json()
            ]);

            setEvents(eventsData);
            setCrpbs(crpbsData);
            setPricings(pricingsData || []);

        } catch (error) {
            console.error('Error:', error);
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const selectedPricings = Object.entries(formData.selectedCrpbs)
                .filter(([_, isSelected]) => isSelected)
                .map(([crpbName]) => ({
                    id: isEditing ? formData.id : undefined,
                    event_id: formData.event_id,
                    crpb_name: crpbName,
                    veg_price: parseFloat(formData.prices[crpbName]?.veg || 0),
                    non_veg_price: parseFloat(formData.prices[crpbName]?.nonVeg || 0)
                }));

            if (selectedPricings.length === 0) {
                setError('Please select at least one CRPB option');
                return;
            }

            const method = isEditing ? 'PUT' : 'POST';
            const promises = selectedPricings.map(pricing =>
                fetch(`${baseUrl}add_sup_event_pricing.php`, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(pricing),
                })
            );

            await Promise.all(promises);
            await fetchData();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to save pricing. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this pricing?')) return;

        try {
            const response = await fetch(`${baseUrl}add_sup_event_pricing.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete pricing');
            }

            await fetchData();
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to delete pricing. Please try again.');
        }
    };

    const handleEdit = (pricing) => {
        setFormData({
            id: pricing.id,
            event_id: pricing.event_id,
            selectedCrpbs: { [pricing.crpb_name]: true },
            prices: {
                [pricing.crpb_name]: {
                    veg: pricing.veg_price,
                    nonVeg: pricing.non_veg_price
                }
            }
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            id: '',
            event_id: '',
            selectedCrpbs: {},
            prices: {}
        });
        setIsEditing(false);
        setError(null);
    };

    const handleCrpbChange = (crpbName, checked) => {
        setFormData(prev => ({
            ...prev,
            selectedCrpbs: {
                ...prev.selectedCrpbs,
                [crpbName]: checked
            }
        }));
    };

    const handlePriceChange = (crpbName, type, value) => {
        setFormData(prev => ({
            ...prev,
            prices: {
                ...prev.prices,
                [crpbName]: {
                    ...prev.prices[crpbName],
                    [type]: value
                }
            }
        }));
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Event Pricing Management</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} /> Add New Pricing
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-4 flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                    Loading...
                </div>
            ) : pricings.length === 0 ? (
                // Empty State
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No pricing data available</h3>
                    <p className="text-gray-500">Click "Add New Pricing" to get started</p>
                </div>
            ) : (
                // Data Table
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRPB Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veg Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Non-Veg Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pricings.map((pricing) => (
                                <tr key={pricing.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{pricing.event_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{pricing.crpb_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">₹{pricing.veg_price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">₹{pricing.non_veg_price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEdit(pricing)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pricing.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-semibold">
                                {isEditing ? 'Edit Pricing' : 'Add New Pricing'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="space-y-4">
                                {/* Event Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Event
                                    </label>
                                    <select
                                        value={formData.event_id}
                                        onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select Event</option>
                                        {events.map((event) => (
                                            <option key={event.id} value={event.id}>
                                                {event.event_name} - {event.event_title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* CRPB Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CRPB Selection
                                    </label>
                                    <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3">
                                        {crpbs.map((crpb) => (
                                            <div key={crpb.id} className="space-y-2">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.selectedCrpbs[crpb.name] || false}
                                                        onChange={(e) => handleCrpbChange(crpb.name, e.target.checked)}
                                                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">{crpb.name}</span>
                                                </div>

                                                {formData.selectedCrpbs[crpb.name] && (
                                                    <div className="ml-6 grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label className="block text-xs text-gray-600">Veg Price</label>
                                                            <input
                                                                type="number"
                                                                value={formData.prices[crpb.name]?.veg || ''}
                                                                onChange={(e) => handlePriceChange(crpb.name, 'veg', e.target.value)}
                                                                className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                min="0"
                                                                step="0.01"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-600">Non-Veg Price</label>
                                                            <input
                                                                type="number"
                                                                value={formData.prices[crpb.name]?.nonVeg || ''}
                                                                onChange={(e) => handlePriceChange(crpb.name, 'nonVeg', e.target.value)}
                                                                className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                min="0"
                                                                step="0.01"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                                    disabled={!formData.event_id || !Object.values(formData.selectedCrpbs).some(Boolean)}
                                >
                                    {isEditing ? 'Update' : 'Add'} Pricing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupEventPricing;