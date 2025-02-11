import React, { useState, useEffect } from 'react';
import { Package, Phone, Mail, MapPin, Calendar, IndianRupee, Loader2, Search, SortDesc, SortAsc, ChevronDown } from 'lucide-react';

const HomeOrderDisplay = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/get_home_orders.php');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.status === 'success') {
        const processedOrders = data.data.map(order => ({
          ...order,
          amount: parseFloat(order.amount) || 0
        }));
        setOrders(processedOrders);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

//   const updateOrderStatus = async () => {
//   try {
//     const response = await fetch('https://mahaspice.desoftimp.com/ms3/update_Home_order_status.php', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         orderId: selectedOrder.orderId,
//         status: selectedOrder.newStatus.toLowerCase()
//       })
//     });

//     // Add more robust error checking
//     const responseText = await response.text();
//     console.log('Raw server response:', responseText);

//     try {
//       const result = JSON.parse(responseText);
//       console.log('Parsed server Response:', result);

//       if (result.success) {
//         // Existing success logic
//       } else {
//         throw new Error(result.message || 'Failed to update status');
//       }
//     } catch (parseError) {
//       console.error('JSON Parsing Error:', parseError);
//       console.error('Response that could not be parsed:', responseText);
//       alert('Error parsing server response');
//     }
//   } catch (err) {
//     console.error('Error updating status:', err);
//     alert(`Error: ${err.message}`);
//   }
// };

  const updateOrderStatus = async () => {
  try {
    const response = await fetch('https://mahaspice.desoftimp.com/ms3/update_Home_order_status.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: selectedOrder.orderId,
        status: selectedOrder.newStatus.toLowerCase()
      })
    });

    // Ensure response is OK before parsing
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const result = await response.json();

    if (result.success) {
      setOrders(orders.map(order =>
        order.orderId === selectedOrder.orderId
          ? { ...order, orderStatus: selectedOrder.newStatus }
          : order
      ));
      setShowStatusModal(false);
      setSelectedOrder(null);
    } else {
      throw new Error(result.message || 'Failed to update status');
    }
  } catch (err) {
    console.error('Error updating status:', err);
    alert(`Error: ${err.message}`);
  }
};
  const openStatusChangeModal = (order, newStatus) => {
    setSelectedOrder({ ...order, newStatus });
    setShowStatusModal(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StatusChangeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Change Order Status</h2>
        <p className="mb-4">
          You are changing the status of Order #{selectedOrder.orderId}
          from {selectedOrder.orderStatus} to {selectedOrder.newStatus}.
        </p>
        <div className="flex justify-between">
          <button
            onClick={updateOrderStatus}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Confirm Status Change
          </button>
          <button
            onClick={() => setShowStatusModal(false)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const filteredOrders = orders.filter(order =>
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone?.includes(searchTerm) ||
    order.phone2?.includes(searchTerm) ||
    order.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (isNaN(dateA) || isNaN(dateB)) {
      return 0; // Handle invalid dates
    }
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Home Orders</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          {sortOrder === 'newest' ? (
            <>
              <SortDesc className="w-5 h-5" />
              Newest First
            </>
          ) : (
            <>
              <SortAsc className="w-5 h-5" />
              Oldest First
            </>
          )}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedOrders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-bold">Order #{order.orderId}</span>
                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => openStatusChangeModal(order, e.target.value)}
                      className={`text-sm px-2 py-1 rounded ${getStatusColor(order.orderStatus)} appearance-none pr-6`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{order.customerName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <div>
                    <span>{order.phone}</span>
                    {order.phone2 && (
                      <span className="ml-2 text-gray-500">Alt: {order.phone2}</span>
                    )}
                  </div>
                </div>

                {order.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>{order.email}</span>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 mt-1" />
                  <div>
                    <p>{order.address}</p>
                    {order.landmark && (
                      <p className="text-sm text-gray-500">Landmark: {order.landmark}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">₹{Number(order.amount).toFixed(2)}</span>
                </div>
              </div>

              {order.items && (
                <div className="border-t pt-3 mt-3">
                  <h4 className="text-sm font-medium mb-2">Order Items:</h4>
                  <p className="text-sm text-gray-600">{order.items}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {sortedOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No orders found matching your search.
        </div>
      )}

      {showStatusModal && selectedOrder && <StatusChangeModal />}
    </div>
  );
};

export default HomeOrderDisplay;