import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  User, 
  LogOut, 
  Settings 
} from 'lucide-react';

const Topbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center">
        {/* <button 
          onClick={toggleSidebar} 
          className="mr-4 p-2 hover:bg-gray-100 rounded"
        >
          <Menu />
        </button> */}
        <h1 className="text-xl font-semibold">
          {isSidebarOpen ? 'Dashboard' : 'Menu'}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded">
          <Bell className="w-5 h-5" />
          <span className="
            absolute top-0 right-0 
            bg-red-500 text-white 
            rounded-full px-1 text-xs
          ">
            3
          </span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center"
          >
            <User className="w-6 h-6 mr-2" />
            <span>Admin</span>
          </button>

          {isProfileDropdownOpen && (
            <div className="
              absolute right-0 top-full mt-2 
              bg-white border rounded shadow-lg 
              w-48 z-50
            ">
              <button className="
                flex items-center w-full p-2 
                hover:bg-gray-100 text-left
              ">
                <Settings className="mr-2 w-4 h-4" />
                Settings
              </button>
              <button className="
                flex items-center w-full p-2 
                hover:bg-gray-100 text-left text-red-600
              ">
                <LogOut className="mr-2 w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;