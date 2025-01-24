import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Fetch users
    fetch('https://mahaspice.desoftimp.com/ms3/login/getallusers.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUsers(data.users);
        }
      })
      .catch(error => console.error('Error fetching users:', error));

    // Fetch payments
    fetch('https://mahaspice.desoftimp.com/ms3/login/getallpayments.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setPayments(data.users);
        }
      })
      .catch(error => console.error('Error fetching payments:', error));
  }, []);

  // Process users by month
  const processedUsers = processUsersByMonth(users);
  
  // Process payments by month
  const processedPayments = processPaymentsByMonth(payments);

  const tabs = [
    { id: 'users', label: 'User Analytics' },
    { id: 'payments', label: 'Payment Analytics' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded shadow p-6">
        <div className="flex border-b mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 
                ${activeTab === tab.id 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'users' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">User Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={processedUsers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="newUsers" 
                    stroke="#8884d8" 
                    name="New Users" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalUsers" 
                    stroke="#82ca9d" 
                    name="Total Users" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="font-semibold mb-2">User Insights</h4>
              <ul className="space-y-2">
                <li>
                  <span className="font-medium">Total Users:</span> {processedUsers.reduce((max, user) => Math.max(max, user.totalUsers), 0)}
                </li>
                <li>
                  <span className="font-medium">Monthly Growth:</span> {processedUsers.filter(u => u.newUsers > 0).length}
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Analytics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processedPayments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalPayments" fill="#3182ce" name="Total Payments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="font-semibold mb-2">Payment Insights</h4>
              <ul className="space-y-2">
                <li>
                  <span className="font-medium">Total Payments:</span> ₹{processedPayments.reduce((sum, payment) => sum + parseFloat(payment.totalPayments), 0).toFixed(2)}
                </li>
                <li>
                  <span className="font-medium">Active Months:</span> {processedPayments.filter(p => p.totalPayments > 0).length}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to process users by month
function processUsersByMonth(users) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Group users by month created
  const usersByMonth = users.reduce((acc, user) => {
    const month = new Date(user.created_at).getMonth();
    const monthName = monthNames[month];
    
    if (!acc[monthName]) {
      acc[monthName] = { month: monthName, newUsers: 0, totalUsers: 0 };
    }
    
    acc[monthName].newUsers++;
    acc[monthName].totalUsers++;
    
    return acc;
  }, {});

  // Ensure all months are represented
  return monthNames.map(month => usersByMonth[month] || { month, newUsers: 0, totalUsers: 0 });
}

// Helper function to process payments by month
function processPaymentsByMonth(payments) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Group payments by month created
  const paymentsByMonth = payments.reduce((acc, payment) => {
    const month = new Date(payment.created_at).getMonth();
    const monthName = monthNames[month];
    
    if (!acc[monthName]) {
      acc[monthName] = { 
        month: monthName, 
        totalPayments: 0, 
        completedPayments: 0, 
        pendingPayments: 0 
      };
    }
    
    const amount = parseFloat(payment.amount);
    acc[monthName].totalPayments += amount;
    
    if (payment.status === 'completed') {
      acc[monthName].completedPayments += amount;
    } else {
      acc[monthName].pendingPayments += amount;
    }
    
    return acc;
  }, {});

  // Ensure all months are represented
  return monthNames.map(month => paymentsByMonth[month] || { 
    month, 
    totalPayments: 0, 
    completedPayments: 0, 
    pendingPayments: 0 
  });
}

export default Analytics;