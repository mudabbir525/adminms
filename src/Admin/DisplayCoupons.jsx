import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Eye, EyeOff, Edit, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Delete Coupon</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this coupon? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:bg-red-300"
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const DisplayCoupons = () => {
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
    const [deleteModal, setDeleteModal] = useState({ open: false, couponId: null });
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/displaycoupons.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setCoupons(data.coupons);
            } else {
                setError(data.message || 'Failed to fetch coupons');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (couponId, currentStatus) => {
        try {
            const currentCoupon = coupons.find(c => c.id === couponId);
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/editcoupons.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...currentCoupon,
                    is_active: !currentStatus,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setCoupons(coupons.map(coupon =>
                    coupon.id === couponId
                        ? { ...coupon, is_active: !currentStatus }
                        : coupon
                ));
            } else {
                setError(data.message || 'Failed to update status');
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            setError('Failed to update coupon status');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.couponId) return;

        setDeleteLoading(true);
        try {
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/deletecoupons.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: deleteModal.couponId }),
            });

            const data = await response.json();
            if (data.success) {
                setCoupons(coupons.filter(coupon => coupon.id !== deleteModal.couponId));
                setDeleteModal({ open: false, couponId: null });
            } else {
                setError(data.message || 'Failed to delete coupon');
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            setError('Failed to delete coupon');
            setTimeout(() => setError(''), 3000);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (field) => {
        setSortConfig({
            field,
            direction: sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSortIndicator = (field) => {
        if (sortConfig.field !== field) return null;
        return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    };

    const filteredCoupons = coupons
        .filter(coupon =>
            coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.coupon_type.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (!sortConfig.field) return 0;

            const aVal = a[sortConfig.field];
            const bVal = b[sortConfig.field];

            if (sortConfig.direction === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-600">Loading coupons...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center ">
                    <h1 className="text-xl font-bold text-gray-900">Manage Coupons</h1>

                    <div className="relative  ">
                        <input
                            type="text"
                            placeholder="Search coupons..."
                            className="w-full pl-10 pr-40 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow ">
                    <table className="w-full whitespace">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th onClick={() => handleSort('code')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                                    Code {getSortIndicator('code')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th onClick={() => handleSort('coupon_type')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                                    Type {getSortIndicator('coupon_type')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Discount
                                </th>
                                <th onClick={() => handleSort('valid_until')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                                    Valid Until {getSortIndicator('valid_until')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usage
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCoupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {coupon.code}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {coupon.description || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {coupon.coupon_type}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {coupon.discount_type === 'percentage'
                                            ? `${coupon.discount_value}%${coupon.max_discount ? ` up to ₹${coupon.max_discount}` : ''}`
                                            : `₹${coupon.discount_value}`
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatDate(coupon.valid_until)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {coupon.usage_count || 0}/{coupon.usage_limit || '∞'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(coupon.id, coupon.is_active)}
                                            className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium
                        ${coupon.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'}`}
                                        >
                                            {coupon.is_active ? (
                                                <><Eye className="w-4 h-4 mr-1" /> Active</>
                                            ) : (
                                                <><EyeOff className="w-4 h-4 mr-1" /> Inactive</>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => navigate(`/coupon/${coupon.id}`)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteModal({ open: true, couponId: coupon.id })}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredCoupons.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No coupons found
                        </div>
                    )}
                </div>
            </div>

            <DeleteModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, couponId: null })}
                onConfirm={handleDelete}
                loading={deleteLoading}
            />
        </div>
    );
};

export default DisplayCoupons;