import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: 'My Company',
    adminEmail: 'admin@example.com',
    language: 'en',
    theme: 'light',
    timezone: 'UTC',
    contactNumber: '',
    address: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    // Simple save logic - in a real app, this would typically involve an API call
    alert('Settings saved successfully!');
    console.log('Saved Settings:', settings);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Application Settings</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={settings.companyName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Admin Email</label>
            <input
              type="email"
              name="adminEmail"
              value={settings.adminEmail}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Language</label>
            <select
              name="language"
              value={settings.language}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Theme</label>
            <select
              name="theme"
              value={settings.theme}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Timezone</label>
            <select
              name="timezone"
              value={settings.timezone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Standard Time</option>
              <option value="PST">Pacific Standard Time</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={settings.contactNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Company Address</label>
            <textarea
              name="address"
              value={settings.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={handleSaveSettings}
            className="
              bg-blue-600 text-white 
              px-6 py-2 rounded 
              hover:bg-blue-700 
              transition-colors
            "
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;