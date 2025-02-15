import React, { useState, useEffect } from "react";
import {
  Package,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  Loader2,
  Search,
  ChevronDown,
} from "lucide-react";

const CateringOrdersDisplay = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatNumber = (value) => {
    // Convert the value to a number if it's a string
    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    // Check if the value is a valid number
    if (typeof numericValue === "number" && !isNaN(numericValue)) {
      return numericValue.toFixed(2);
    }

    // Default value if not a number
    return "0.00";
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://mahaspice.desoftimp.com/ms3/get_catering_order_details.php"
      );
      const data = await response.json();
      console.log("Backend Response:", data); // Log the backend response

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

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
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
      <h1 className="text-2xl font-bold mb-6">Catering Orders</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer"
            onClick={() => toggleExpandOrder(order.order_id)}
          >
            {/* Customer and Payment Details */}
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
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>{order.customer_phone1}</span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 mt-1" />
                  <div>
                    <p>{order.customer_address}</p>
                    {order.customer_landmark && (
                      <p className="text-sm text-gray-500">
                        Landmark: {order.customer_landmark}
                      </p>
                    )}
                  </div>
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

            {/* Expanded Order Details */}
            {expandedOrderId === order.order_id && (
              <div className="p-4 border-t">
                <h4 className="text-sm font-medium mb-2">Order Items:</h4>
                {Object.entries(order.selected_items).map(
                  ([category, items]) => (
                    <div key={category} className="mb-4">
                      <h5 className="font-semibold">{category}</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {items.map((item, index) => (
                          <li key={index}>{item.item_name}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Guest Count</span>
                    <span>{order.guest_count}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tables</span>
                    <span>{order.tables}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Staff</span>
                    <span>{order.staff}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Helpers</span>
                    <span>{order.helpers}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Plate Price</span>
                    <span>₹{formatNumber(order.plate_price)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Table Charges</span>
                    <span>₹{formatNumber(order.table_charges)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Staff Charges</span>
                    <span>₹{formatNumber(order.staff_charges)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Helper Charges</span>
                    <span>₹{formatNumber(order.helper_charges)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>₹{formatNumber(order.discount)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{formatNumber(order.subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST ({order.gst_percent}%)</span>
                    <span>₹{formatNumber(order.gst)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹{formatNumber(order.delivery_fee)}</span>
                  </div>

                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total</span>
                    <span>₹{formatNumber(order.total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-8 text-gray-500">No orders found.</div>
      )}
    </div>
  );
};

// Helper function to get status color
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
