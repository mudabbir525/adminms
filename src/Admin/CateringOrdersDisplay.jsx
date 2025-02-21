import React, { useState, useEffect } from "react";
import {
  Package,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import DownloadInvoiceButton from "./DownloadInvoiceButton";

const formatNumber = (value) => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  return typeof numericValue === "number" && !isNaN(numericValue)
    ? numericValue.toFixed(2)
    : "0.00";
};

const OrderDetailView = ({ order, onBack }) => {
  return (
    <div className=" bg-white overflow-y-auto">
      {/* Header with back button */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Orders
          </button>
        </div>

        {/* Order header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order #{order.order_id}</h1>

          <div className="flex items-center gap-4">
            <DownloadInvoiceButton order={order} />
            <div
              className={`text-sm px-3 py-1 rounded ${getStatusColor(
                order.payment_status
              )}`}
            >
              {order.payment_status}
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Customer Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-gray-600">Customer Name</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{order.customer_phone1}</p>
                    <p className="text-sm text-gray-600">Phone Number</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">{order.customer_address}</p>
                    {order.customer_landmark && (
                      <p className="text-sm text-gray-600">
                        Landmark: {order.customer_landmark}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">
                      {new Date(order.order_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">Order Date</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Event Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Guest Count</p>
                  <p className="font-medium text-lg">{order.guest_count}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tables</p>
                  <p className="font-medium text-lg">{order.tables}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Staff</p>
                  <p className="font-medium text-lg">{order.staff}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Helpers</p>
                  <p className="font-medium text-lg">{order.helpers}</p>
                </div>
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-gray-600">Event Type</p>
                <p className="font-medium text-lg">{order.event_type}</p>
                <p className="text-sm text-gray-600">Service Type</p>
                <p className="font-medium text-lg">{order.service_type}</p>
                <p className="text-sm text-gray-600">Menu Type</p>
                <p className="font-medium text-lg">{order.menu_type}</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Price Breakdown</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Plate Price</span>
                  <span className="font-medium">
                    ₹{formatNumber(order.plate_price)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Table Charges</span>
                  <span className="font-medium">
                    ₹{formatNumber(order.table_charges)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Staff Charges</span>
                  <span className="font-medium">
                    ₹{formatNumber(order.staff_charges)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Helper Charges</span>
                  <span className="font-medium">
                    ₹{formatNumber(order.helper_charges)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-red-600">
                    -₹{formatNumber(order.discount)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ₹{formatNumber(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">
                    GST ({order.gst_percent}%)
                  </span>
                  <span className="font-medium">
                    ₹{formatNumber(order.gst)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    ₹{formatNumber(order.delivery_fee)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-t mt-2">
                  <span className="font-bold text-lg">Total Amount</span>
                  <span className="font-bold text-lg">
                    ₹{formatNumber(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Selected Items */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit lg:sticky lg:top-4">
            <h2 className="text-xl font-semibold mb-4">Selected Menu Items ({order.veg_nonveg})</h2>
            <div className="space-y-6">
              {Object.entries(order.selected_items).map(([category, items]) => (
                <div key={category} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-medium text-lg mb-3 text-blue-600">
                    {category}
                  </h3>
                  <ul className="space-y-2">
                    {items.map((item, index) => (
                      <li
                        key={index}
                        className="text-gray-600 flex items-center"
                      >
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        {item.item_name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CateringOrdersDisplay = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://mahaspice.desoftimp.com/ms3/get_catering_order_details.php"
      );
      const data = await response.json();
      if (data.status === "success") {
        setOrders(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  if (selectedOrder) {
    return (
      <OrderDetailView
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Catering Orders</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedOrder(order)}
          >
            <div className="p-4">
              <div className="flex justify-between items-center">
                <span className="font-bold">Order #{order.order_id}</span>
                <div
                  className={`text-sm px-2 py-1 rounded ${getStatusColor(
                    order.payment_status
                  )}`}
                >
                  {order.payment_status}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{order.customer_name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>{new Date(order.order_date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">
                    ₹{formatNumber(order.payment_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-8 text-gray-500">No orders found.</div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default CateringOrdersDisplay;
