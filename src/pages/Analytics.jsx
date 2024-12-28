import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('sales');

  const salesData = [
    { month: 'Jan', sales: 4000, revenue: 2400 },
    { month: 'Feb', sales: 3000, revenue: 1398 },
    { month: 'Mar', sales: 2000, revenue: 9800 },
    { month: 'Apr', sales: 2780, revenue: 3908 },
    { month: 'May', sales: 1890, revenue: 4800 },
    { month: 'Jun', sales: 2390, revenue: 3800 },
  ];

  const userGrowthData = [
    { month: 'Jan', newUsers: 400, totalUsers: 1000 },
    { month: 'Feb', newUsers: 300, totalUsers: 1300 },
    { month: 'Mar', newUsers: 200, totalUsers: 1500 },
    { month: 'Apr', newUsers: 278, totalUsers: 1778 },
    { month: 'May', newUsers: 189, totalUsers: 1967 },
    { month: 'Jun', newUsers: 239, totalUsers: 2206 },
  ];

  const tabs = [
    { id: 'sales', label: 'Sales Analytics' },
    { id: 'users', label: 'User Growth' }
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

        {activeTab === 'sales' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#3182ce" name="Sales Volume" />
                  <Bar dataKey="revenue" fill="#48bb78" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="font-semibold mb-2">Sales Insights</h4>
              <ul className="space-y-2">
                <li>
                  <span className="font-medium">Best Month:</span> March
                </li>
                <li>
                  <span className="font-medium">Total Sales:</span> 15,670
                </li>
                <li>
                  <span className="font-medium">Average Monthly Revenue:</span> $2,611
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">User Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
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
              <h4 className="font-semibold mb-2">User Growth Insights</h4>
              <ul className="space-y-2">
                <li>
                  <span className="font-medium">Total Users:</span> 2,206
                </li>
                <li>
                  <span className="font-medium">Monthly Growth Rate:</span> 12.3%
                </li>
                <li>
                  <span className="font-medium">Best Growth Month:</span> April
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;