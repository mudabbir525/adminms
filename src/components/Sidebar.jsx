import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Users as UserIcon,
  Settings as SettingsIcon,
  BarChart2,
  Menu,
  ChevronDown,
  ChevronRight,
  CopyPlus,
  Edit
} from 'lucide-react';
import Admin from '../Admin/Admin';

 const adminMenuItems = [
    {
      category: "Menu Management",
      items: [
        {
          icon: <CopyPlus className="w-5 h-5" />,
          label: "Menu Add",
          key: "addmenu",
          path: "/addmenu",
        },
        {
          icon: <Edit className="w-5 h-5" />,
          label: "Menu Edit",
          key: "adminmenu",
          path: "/adminmenu",
        },
      ],
    },
    {
      category: "Category Management",
      items: [
        {
          icon: <CopyPlus className="w-5 h-5" />,
          label: "Add Category",
          key: "addcategory",
          path: "/addcategory",
        },
        {
          icon: <Edit className="w-5 h-5" />,
          label: "Admin Category",
          key: "admincategory",
          path: "/admincategory",
        },
      ],
    },
    {
      category: "Event Management",
      items: [
        {
          icon: <CopyPlus className="w-5 h-5" />,
          label: "Add Event",
          key: "addevent",
          path: "/addevent",
        },
        {
          icon: <Edit className="w-5 h-5" />,
          label: "Event Display",
          key: "admineventdisplay",
          path: "/admineventdisplay",
        },
      ],
    },
    {
      category: "Meal Box",
      items: [
        {
          icon: <CopyPlus className="w-5 h-5" />,
          label: "Add CP",
          key: "addcp",
          path: "/addcp",
        },
        {
          icon: <CopyPlus className="w-5 h-5" />,
          label: "Add CP Package",
          key: "addcps",
          path: "/addcps",
        },
        {
          icon: <Edit className="w-5 h-5" />,
          label: "Display CP",
          key: "displaycp",
          path: "/displaycp",
        },
        {
          icon: <Edit className="w-5 h-5" />,
          label: "Display CP Package",
          key: "displaycps",
          path: "/displaycps",
        },

      ],
    },
    {
      category: "Carousel",
      items: [
        {
          icon: <CopyPlus className="w-5 h-5" />,
          label: "Add Carousel",
          key: "addcarousel",
          path: "/addcarousel",
        },
        {
          icon: <Edit className="w-5 h-5" />,
          label: "Display Carousel",
          key: "carousel",
          path: "/carousel",
        },

        {
          icon: <Edit className="w-5 h-5" />,
          label: "Edit Section Two",
          key: "SectionTwo",
          path: "/editsection",
        },
        {
          icon: <Edit className="w-5 h-5" />,
          label: "Edit Section Three",
          key: "SectionThree",
          path: "/editsectionthree",
        },
        {
          icon: <CopyPlus className="w-5 h-5" />,
          label: "Add Home Category",
          key: "Home Category",
          path: "/addhc",
        },
        {
          icon: <CopyPlus className="w-5 h-5" />,
          label: "Edit Home Category",
          key: "HomeCategory",
          path: "/edithc",
        },
        {
          icon: <CopyPlus className="w-5 h-5" />,
          label: "Add Home Item",
          key: "HomeItem",
          path: "/addhi",
        },
        {
          icon: <CopyPlus className="w-5 h-5" />,
          label: "display Home Item",
          key: "HomeItem",
          path: "/dishi",
        },


      ],
    },
    {
      category: "Menu",
      items: [
        {
          icon: <CopyPlus className="w-5 h-5" />,
          label: "Add Catering Menu",
          key: "addmenu",
          path: "/menuitem",
        },
        {
          icon: <Edit className="w-5 h-5" />,
          label: "Menu Display",
          key: "menudisplay",
          path: "/menudisplay",
        },
        {
          icon: <Edit className="w-5 h-5" />,
          label: "Menu Pricing",
          key: "menupricing",
          path: "/menupricingform",
        },
        {
          icon: <Edit className="w-5 h-5" />,
          label: "Menu Pricing display",
          key: "menupricingdisplay",
          path: "/menupricingdisplay",
        },
      ],
    },
     {
      category: "Coupons&GST",
      items: [
        {
          icon: <CopyPlus className="w-5 h-5" />,
          label: "Add Coupon",
          key: "addcoupon",
          path: "/coupon",
        },
        {
          icon: <Edit className="w-5 h-5" />,
          label: "Display Coupons",
          key: "displaycoupons",
          path: "/displaycoupons",
        },
        {
          icon: <Edit className="w-5 h-5" />,
          label: "Add GST",
          key: "addgst",
          path: "/addgst",
        },
        {
          icon: <Edit className="w-5 h-5" />,
          label: "Display GST",
          key: "gstdisplay",
          path: "/gst",
        },
      ],
    },
  ];

const Sidebar = ({ isOpen, toggleSidebar, currentPath }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (label) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const menuItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: <Edit className="w-5 h-5" />,
      label: 'Edit',
      hasDropdown: true,
      dropdownItems: adminMenuItems.flatMap((category) =>
        category.items.map((item) => ({
          icon: item.icon,
          label: item.label,
          path: item.path,
        }))
      ),
    },
    {
      icon: <UserIcon className="w-5 h-5" />,
      label: 'Bookings',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Orders', path: '/mealorders', icon: <UserIcon className="w-4 h-4" /> },
        { label: 'Intrests', path: '/users', icon: <UserIcon className="w-4 h-4" /> },
        { label: 'Permissions', path: '/users/permissions', icon: <UserIcon className="w-4 h-4" /> }
      ]
    },
    {
      icon: <SettingsIcon className="w-5 h-5" />,
      label: 'Settings',
      hasDropdown: true,
      dropdownItems: [
        { label: 'General', path: '/settings/general', icon: <SettingsIcon className="w-4 h-4" /> },
        { label: 'Account', path: '/settings/account', icon: <UserIcon className="w-4 h-4" /> },
        { label: 'Integrations', path: '/settings/integrations', icon: <SettingsIcon className="w-4 h-4" /> }
      ]
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      label: 'Analytics',
      path: '/analytics'
    }
  ];

  const renderMenuItem = (item) => {
    if (item.hasDropdown) {
      return (
        <div key={item.label} className="mb-2">
          <button
            onClick={() => toggleDropdown(item.label)}
            className={`
              flex items-center justify-between w-full p-2
              hover:bg-gray-100 rounded
              transition-colors duration-200
              ${currentPath.startsWith(`/${item.label.toLowerCase()}`) ? 'bg-blue-50 text-blue-600' : ''}
              `}
              >
            
            <div className="flex items-center">
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </div>
            {openDropdowns[item.label] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          
          {openDropdowns[item.label] && (
            <div className="pl-8 mt-1">
              {item.dropdownItems.map((subItem) => (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className={`
                    flex items-center w-full p-2 text-sm
                    hover:bg-gray-100 rounded
                    transition-colors duration-200
                    ${currentPath === subItem.path ? 'bg-blue-50 text-blue-600' : ''}
                  `}
                >
                  {subItem.icon && (
                    <span className="mr-2">{subItem.icon}</span>
                  )}
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`
          flex items-center w-full p-2 mb-2
          hover:bg-gray-100 rounded
          transition-colors duration-200
          ${currentPath === item.path ? 'bg-blue-50 text-blue-600' : ''}
        `}
      >
        {item.icon}
        <span className="ml-3">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {!isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
        />
      )}
      <aside
        className={`
          fixed top-0 left-0  max-h-screen overflow-auto bg-white shadow-lg z-50
          transition-all duration-300 w-64
          scrollbar-hide
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu />
          </button>
        </div>
        <nav className="p-4">
          {menuItems.map(renderMenuItem)}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;