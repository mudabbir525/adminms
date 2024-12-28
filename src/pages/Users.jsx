import React, { useState, useEffect } from 'react';
import { Loader2, Phone, Mail, Users, MapPin, Calendar, Clock, TableIcon, LayoutGrid, Filter, ArrowUpDown,Search } from 'lucide-react';
import axios from 'axios';

const Input = ({ className = "", onSearch, ...props }) => (
  <div className="flex gap-2">
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
    <button 
      onClick={onSearch}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
    >
      <Search className="w-4 h-4" />
      Search
    </button>
  </div>
);

const CustomSelect = ({ value, onChange, options, placeholder, width = "w-full" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${width} px-3 py-2 text-left border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center`}
      >
        <span className="block truncate">
          {value ? options.find(opt => opt.value === value)?.label : placeholder}
        </span>
        <span className="pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                value === option.value ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const User = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [searchTimeout, setSearchTimeout] = useState(null);
  
  const [stats, setStats] = useState({
    total_orders: 0,
    pending_count: 0,
    processing_count: 0,
    completed_count: 0
  });

  const [filters, setFilters] = useState({
    searchId: '',
    searchName: '',
    serviceType: '',
    location: '',
    status: '',
    guestCount: ''
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://mahaspice.desoftimp.com/ms3/get_orders.php');
      if (response.data.success) {
        const ordersData = response.data.orders;
        setOrders(ordersData);
        setFilteredOrders(ordersData);
        updateStats(ordersData);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (ordersData) => {
    setStats({
      total_orders: ordersData.length,
      pending_count: ordersData.filter(order => order.status === 'pending').length,
      processing_count: ordersData.filter(order => order.status === 'processing').length,
      completed_count: ordersData.filter(order => order.status === 'completed').length
    });
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setFilters(prev => ({ ...prev, [field]: value }));

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      applyFilters({ ...filters, [field]: value });
    }, 300);

    setSearchTimeout(newTimeout);
  };

  const applyFilters = (currentFilters) => {
    let result = [...orders];

    if (currentFilters.searchId) {
      result = result.filter(order => 
        order.id.toString().toLowerCase().includes(currentFilters.searchId.toLowerCase())
      );
    }

    if (currentFilters.searchName) {
      result = result.filter(order => 
        order.user.name.toLowerCase().includes(currentFilters.searchName.toLowerCase())
      );
    }

    if (currentFilters.serviceType) {
      result = result.filter(order => order.serviceType === currentFilters.serviceType);
    }

    if (currentFilters.location) {
      result = result.filter(order => order.location === currentFilters.location);
    }

    if (currentFilters.status) {
      result = result.filter(order => order.status === currentFilters.status);
    }

    if (currentFilters.guestCount) {
      result = result.filter(order => order.guestCount.toString() === currentFilters.guestCount);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'user.name') {
          aValue = a.user.name;
          bValue = b.user.name;
        }

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      });
    }

    setFilteredOrders(result);
  };

  useEffect(() => {
    applyFilters(filters);
  }, [sortConfig]);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        'https://mahaspice.desoftimp.com/ms3/update_order_status.php',
        {
          orderId,
          status: newStatus,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200 && response.data.success) {
        window.location.reload();
      } else {
        console.error('Failed to update status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const StatsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
        <p className="text-2xl font-semibold">{stats.total_orders}</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-yellow-700">Pending</h3>
        <p className="text-2xl font-semibold text-yellow-600">{stats.pending_count}</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-blue-700">Processing</h3>
        <p className="text-2xl font-semibold text-blue-600">{stats.processing_count}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-green-700">Completed</h3>
        <p className="text-2xl font-semibold text-green-600">{stats.completed_count}</p>
      </div>
    </div>
  );

  const FiltersSection = () => {
    const locations = [...new Set(orders.map(order => order.location))];
    const serviceTypes = [...new Set(orders.map(order => order.serviceType))];
    const guestCounts = [...new Set(orders.map(order => order.guestCount))].sort((a, b) => a - b);
    const [searchValues, setSearchValues] = useState({
      searchId: '',
      searchName: ''
    });
    const handleSearch = () => {
      applyFilters({ ...filters, ...searchValues });
    };
  
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search by Order ID..."
          value={searchValues.searchId}
          onChange={(e) => setSearchValues(prev => ({ ...prev, searchId: e.target.value }))}
          onSearch={handleSearch}
        />
        <Input
          placeholder="Search by Customer Name..."
          value={searchValues.searchName}
          onChange={(e) => setSearchValues(prev => ({ ...prev, searchName: e.target.value }))}
          onSearch={handleSearch}
        />
          
          <CustomSelect
            value={filters.status}
            onChange={(value) => {
              setFilters(prev => ({ ...prev, status: value }));
              applyFilters({ ...filters, status: value });
            }}
            options={[
              { value: '', label: 'All Statuses' },
              ...statusOptions
            ]}
            placeholder="Filter by Status"
          />
          
          <CustomSelect
            value={filters.location}
            onChange={(value) => {
              setFilters(prev => ({ ...prev, location: value }));
              applyFilters({ ...filters, location: value });
            }}
            options={[
              { value: '', label: 'All Locations' },
              ...locations.map(loc => ({ value: loc, label: loc }))
            ]}
            placeholder="Filter by Location"
          />
          
          <CustomSelect
            value={filters.serviceType}
            onChange={(value) => {
              setFilters(prev => ({ ...prev, serviceType: value }));
              applyFilters({ ...filters, serviceType: value });
            }}
            options={[
              { value: '', label: 'All Services' },
              ...serviceTypes.map(type => ({ value: type, label: type }))
            ]}
            placeholder="Filter by Service Type"
          />
          
          <CustomSelect
            value={filters.guestCount}
            onChange={(value) => {
              setFilters(prev => ({ ...prev, guestCount: value }));
              applyFilters({ ...filters, guestCount: value });
            }}
            options={[
              { value: '', label: 'All Guest Counts' },
              ...guestCounts.map(count => ({ 
                value: count.toString(), 
                label: `${count} Guests` 
              }))
            ]}
            placeholder="Filter by Guest Count"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              const resetFilters = {
                searchId: '',
                searchName: '',
                serviceType: '',
                location: '',
                status: '',
                guestCount: ''
              };
              setFilters(resetFilters);
              applyFilters(resetFilters);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Reset Filters
          </button>
        </div>
      </div>
    );
  };

  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('id')}>
              <div className="flex items-center gap-1">
                Order ID
                <ArrowUpDown className="w-4 h-4" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('user.name')}>
              <div className="flex items-center gap-1">
                Customer
                <ArrowUpDown className="w-4 h-4" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('serviceType')}>
              <div className="flex items-center gap-1">
                Service Type
                <ArrowUpDown className="w-4 h-4" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('location')}>
              <div className="flex items-center gap-1">
                Location
                <ArrowUpDown className="w-4 h-4" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('guestCount')}>
              <div className="flex items-center gap-1">
                Guests
                <ArrowUpDown className="w-4 h-4" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('orderDate')}>
              <div className="flex items-center gap-1">
                Date & Time
                <ArrowUpDown className="w-4 h-4" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                <div className="text-sm text-gray-500">{order.user.phone}</div>
              </td>
              <td className="px-6 py-4">{order.serviceType}</td>
              <td className="px-6 py-4">{order.location}</td>
              <td className="px-6 py-4">{order.guestCount}</td>
              <td className="px-6 py-4">
                <CustomSelect
                  value={order.status}
                  onChange={(value) => updateOrderStatus(order.id, value)}
                  options={statusOptions}
                  placeholder="Select Status"
                  width="w-32"
                />
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{order.orderDate}</div>
                <div className="text-sm text-gray-500">{order.orderTime}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredOrders.map(order => (
        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">{order.serviceType}</h2>
              <p className="text-sm text-gray-500">Order #{order.id}</p>
            </div>
            <CustomSelect
              value={order.status}
              onChange={(value) => updateOrderStatus(order.id, value)}
              options={statusOptions}
              placeholder="Select Status"
              width="w-32"
            />
          </div>
  
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{order.guestCount} guests</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{order.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{order.orderDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{order.orderTime}</span>
              </div>
            </div>
  
            <div className="border-t pt-4">
              <div className="space-y-2">
                <p className="font-medium">{order.user.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{order.user.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{order.user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (error) return <div className="max-w-7xl mx-auto p-6"><div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-800">{error}</p></div></div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
      </div>

      <StatsSection />
      <FiltersSection />
      
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
        <button
          className="p-2 rounded-md border hover:bg-gray-50"
          onClick={() => setViewMode(prev => prev === 'grid' ? 'table' : 'grid')}
        >
          {viewMode === 'grid' ? <TableIcon className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
        </button>
      </div>

      {viewMode === 'table' ? <TableView /> : <GridView />}
    </div>
  );
};

export default User;