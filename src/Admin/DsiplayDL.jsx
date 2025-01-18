import React, { useState, useEffect } from 'react';
import {
    MapPin, Search, Filter, ChevronDown, ChevronUp,
    IndianRupee, Loader, Package, Truck, Users, Zap,
    Edit2, Trash2, X, Check, AlertCircle
} from 'lucide-react';
import { AlertTriangle } from 'lucide-react';

const serviceIcons = {
    'box_genie': Package,
    'home_delivery': Truck,
    'bulk_catering': Users,
    'superfast': Zap
};

const DeliveryLocations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [expandedLocations, setExpandedLocations] = useState({});
    const [editingService, setEditingService] = useState(null);
    const [editForm, setEditForm] = useState({ location: '', service_type: '', price: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchLocations();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/displayDeloc.php');
            if (!response.ok) throw new Error('Failed to fetch locations');
            const data = await response.json();

            const groupedData = (data.locations || []).reduce((acc, item) => {
                if (!acc[item.location]) {
                    acc[item.location] = [];
                }
                acc[item.location].push(item);
                return acc;
            }, {});

            setLocations(groupedData);
        } catch (error) {
            setError('Failed to load delivery locations');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setEditForm({
            location: service.location,
            service_type: service.service_type,
            price: service.price
        });
        setIsEditing(true);
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/updateDeloc.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingService.id,
                    ...editForm
                }),
            });

            const data = await response.json();

            if (data.success) {
                showNotification('Location updated successfully');
                fetchLocations();
                setIsEditing(false);
                setEditingService(null);
            } else {
                throw new Error(data.error || 'Update failed');
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };


    // Add this new function inside your component
    const handleDeleteLocation = async (locationName) => {
        // Show a more prominent confirmation dialog
        const confirmDelete = () => {
            return new Promise((resolve) => {
                const dialog = document.createElement('div');
                dialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
                dialog.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <span class="text-red-600">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">Delete Location</h3>
              <p class="mt-2 text-sm text-gray-500">
                Are you sure you want to delete "${locationName}" and all its associated services? This action cannot be undone.
              </p>
              <div class="mt-4 flex space-x-3">
                <button 
                  class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  onclick="this.closest('.fixed').dataset.response='confirm'"
                >
                  Delete
                </button>
                <button 
                  class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  onclick="this.closest('.fixed').dataset.response='cancel'"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

                document.body.appendChild(dialog);

                const handleResponse = (e) => {
                    if (dialog.dataset.response) {
                        document.body.removeChild(dialog);
                        resolve(dialog.dataset.response === 'confirm');
                    }
                };

                dialog.addEventListener('click', handleResponse);
            });
        };

        if (await confirmDelete()) {
            try {
                const response = await fetch('https://mahaspice.desoftimp.com/ms3/deletelocation.php', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ location: locationName }),
                });

                const data = await response.json();

                if (data.success) {
                    showNotification(`Location "${locationName}" and all its services deleted successfully`);
                    fetchLocations();
                } else {
                    throw new Error(data.error || 'Delete failed');
                }
            } catch (error) {
                showNotification(error.message, 'error');
            }
        }
    };

    const handleDelete = async (service) => {
        if (!window.confirm('Are you sure you want to delete this location?')) return;

        try {
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/deleteDeloc.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: service.id }),
            });

            const data = await response.json();

            if (data.success) {
                showNotification('Location deleted successfully');
                fetchLocations();
            } else {
                throw new Error(data.error || 'Delete failed');
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    const toggleLocation = (location) => {
        setExpandedLocations(prev => ({
            ...prev,
            [location]: !prev[location]
        }));
    };

    const formatServiceName = (name) => {
        return name.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const filterLocations = () => {
        return Object.entries(locations).filter(([locationName, services]) => {
            const matchesSearch = locationName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesService = selectedService === '' ||
                services.some(service => service.service_type === selectedService);
            return matchesSearch && matchesService;
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6 bg-red-50 rounded-lg">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Notification */}
                {notification && (
                    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center space-x-2 z-50 ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        <AlertCircle className="h-5 w-5" />
                        <span>{notification.message}</span>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditing && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Edit Location</h3>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.location}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Service Type
                                    </label>
                                    <select
                                        value={editForm.service_type}
                                        onChange={(e) => setEditForm({ ...editForm, service_type: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="box_genie">Box Genie</option>
                                        <option value="home_delivery">Home Delivery</option>
                                        <option value="bulk_catering">Bulk Catering</option>
                                        <option value="superfast">Superfast</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price
                                    </label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={editForm.price}
                                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                            className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={handleUpdate}
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Delivery Locations</h2>
                    <p className="mt-2 text-sm text-gray-600">View and manage delivery services by location</p>
                </div>

                {/* Search and Filter */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search locations..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                        >
                            <option value="">All Services</option>
                            <option value="box_genie">Box Genie</option>
                            <option value="home_delivery">Home Delivery</option>
                            <option value="bulk_catering">Bulk Catering</option>
                            <option value="superfast">Superfast</option>
                        </select>
                    </div>
                </div>

                {/* Location Cards */}
                <div className="space-y-4">
                    {filterLocations().map(([locationName, services]) => {
                        const isExpanded = expandedLocations[locationName];

                        return (
                            <div
                                key={locationName}
                                className="bg-white rounded-lg shadow-md overflow-hidden"
                            >
                                <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div
                                        className="flex-1 flex items-center space-x-3 cursor-pointer"
                                        onClick={() => toggleLocation(locationName)}
                                    >
                                        <MapPin className="h-5 w-5 text-blue-500" />
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {locationName}
                                        </h3>
                                        <span className="text-sm text-gray-500">
                                            ({services.length} services)
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteLocation(locationName);
                                            }}
                                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                                            title="Delete entire location"
                                        >
                                            <AlertTriangle className="h-5 w-5" />
                                        </button>
                                        {isExpanded ? (
                                            <ChevronUp className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-gray-200">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                                            {services.map((service) => {
                                                const ServiceIcon =
                                                    serviceIcons[service.service_type] ||
                                                    Package;

                                                return (
                                                    <div
                                                        key={service.id}
                                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <ServiceIcon className="h-5 w-5 text-blue-500" />
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {formatServiceName(
                                                                    service.service_type
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                            <span className="flex items-center text-sm font-medium text-gray-900">
                                                                <IndianRupee className="h-4 w-4 text-gray-500 mr-1" />
                                                                {parseFloat(service.price).toFixed(
                                                                    2
                                                                )}
                                                            </span>
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEdit(service);
                                                                    }}
                                                                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                                                                    title="Edit location"
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDelete(service);
                                                                    }}
                                                                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                                                                    title="Delete location"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {filterLocations().length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <div className="flex flex-col items-center space-y-3">
                                <MapPin className="h-8 w-8 text-gray-400" />
                                <p className="text-gray-500">No locations found matching your criteria</p>
                                {searchTerm || selectedService ? (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedService('');
                                        }}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Clear filters
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliveryLocations;