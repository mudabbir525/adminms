import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, paymentsResponse] = await Promise.all([
          axios.get('https://adminmahaspice.in/ms3/login/getallusers.php'),
          axios.get('https://adminmahaspice.in/ms3/login/getallpayments.php')
        ]);
        setUsers(usersResponse.data.users);
        setPayments(paymentsResponse.data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Calculate dashboard metrics
  const totalUsers = users.length;
  const totalRevenue = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
  const pendingOrders = payments.filter(payment => payment.order_status === 'pending').length;

  // Prepare sales data for all 12 months
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const salesByMonth = monthOrder.map(month => {
    const monthPayments = payments.filter(payment => 
      new Date(payment.created_at).toLocaleString('default', { month: 'short' }) === month
    );
    
    const sales = monthPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    
    return { 
      month, 
      sales: parseFloat(sales.toFixed(2)) 
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      {/* Quick Stats Cards */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Total Users</h3>
        <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
        <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>
        <p className="text-2xl font-bold text-orange-600">{pendingOrders}</p>
      </div>
      
      {/* Sales Chart */}
      <div className="col-span-full bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesByMonth}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Users Table */}
      <div className="col-span-full bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">User List</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.phone}</td>
                <td className="p-2">{user.address}</td>
                <td className="p-2">{user.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;