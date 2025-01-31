import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Users as UserIcon,
  Settings as SettingsIcon,
  BarChart2,
  Menu,
  ChevronDown,
  ChevronRight,
  CopyPlus,
  Edit,
  BoxIcon,
  Layout,
  Tag,
  ShoppingBag,
  MapPin,
  Ticket,
  Percent,
  Truck,
  PersonStanding,
  FolderOpenDot,
  PartyPopper,
  Zap,
  Calendar,
} from "lucide-react";
import { GiFruitBowl, GiPositionMarker } from "react-icons/gi";

const Sidebar = ({ isOpen, toggleSidebar, currentPath }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownHeights, setDropdownHeights] = useState({});
  const dropdownRefs = useRef({});

  const toggleDropdown = (label) => {
    setOpenDropdown(currentOpen => currentOpen === label ? null : label);
  };


  const menuItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: "Superfast",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Add section super ",
          path: "/crpb",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "superfast section",
          path: "/superfast",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Package add",
          path: "/crpb",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Packages Display",
          path: "/display-crpb",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Superfast Events",
          path: "/superfast-events",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Superfast Event Pricing",
          path: "/superfast-events-pricing",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Superfast Categories",
          path: "/sf-category",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Superfast Items",
          path: "/superfast-items",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Superfast Add Home Category",
          path: "/superfast-add-home-category",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Superfast Home Category",
          path: "/superfast-home-categories",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Superfast Add Home Items",
          path: "/superfast-add-home-items",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Superfast Home Items",
          path: "/superfast-home-items",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Add Superfast CPs",
          path: "/Superfast-cp-add",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Display Superfast CPs",
          path: "/superfast-cp-display",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Superfast Box positions",
          path: "/superfast-box-positions",
          icon: <Edit className="w-4 h-4" />,
        },
        

      ],
    },
    {
      icon: <Layout className="w-5 h-5" />,
      label: "MealBox",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Add CP",
          path: "/addcp",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Display CP",
          path: "/displaycp",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Add CP Package",
          path: "/addcps",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Display CP Package",
          path: "/displaycps",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Positions",
          path: "/positions",
          icon: <GiPositionMarker className="w-4 h-4" />,
        },
      ],
    },
    {
      icon: <PartyPopper className="w-5 h-5" />,
      label: "Event",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Add Event",
          path: "/addevent",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Event Display",
          path: "/admineventdisplay",
          icon: <Edit className="w-4 h-4" />,
        },
      ],
    },
    {
      icon: <GiFruitBowl className="w-5 h-5" />,
      label: "Catering",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Menu Add",
          path: "/addmenu",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Menu Edit",
          path: "/adminmenu",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Add Category",
          path: "/addcategory",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Admin Category",
          path: "/admincategory",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Add Catering Menu",
          path: "/menuitem",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Menu Display",
          path: "/menudisplay",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Menu Pricing",
          path: "/menupricingform",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Menu Pricing Display",
          path: "/menupricingdisplay",
          icon: <Edit className="w-4 h-4" />,
        },
      ],
    },
    {
      icon: <Truck className="w-5 h-5" />,
      label: "Home Delivery",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Add Home Category",
          path: "/addhc",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Edit Home Category",
          path: "/edithc",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Add Home Item",
          path: "/addhi",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Display Home Item",
          path: "/dishi",
          icon: <Edit className="w-4 h-4" />,
        },
      ],
    },
    {
      icon: <Layout className="w-5 h-5" />,
      label: "Carousel",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Add Carousel",
          path: "/addcarousel",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Display Carousel",
          path: "/carousel",
          icon: <Edit className="w-4 h-4" />,
        },
      ],
    },
    {
      icon: <Edit className="w-5 h-5" />,
      label: "Home Section",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Edit Section Two",
          path: "/editsection",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Edit Section Three",
          path: "/editsectionthree",
          icon: <Edit className="w-4 h-4" />,
        },
      ],
    },
    {
      icon: <Ticket className="w-5 h-5" />,
      label: "Coupons",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Add Coupon",
          path: "/coupon",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Display Coupons",
          path: "/displaycoupons",
          icon: <Edit className="w-4 h-4" />,
        },
        {
          label: "Offers",
          path: "/offers",
          icon: <Edit className="w-4 h-4" />,
        },
      ],
    },
    {
      icon: <Percent className="w-5 h-5" />,
      label: "GST",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Add GST",
          path: "/addgst",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Display GST",
          path: "/gst",
          icon: <Edit className="w-4 h-4" />,
        },
      ],
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Locations",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Add Location Price",
          path: "/dloc",
          icon: <CopyPlus className="w-4 h-4" />,
        },
        {
          label: "Display Location Price",
          path: "/disloc",
          icon: <Edit className="w-4 h-4" />,
        },
      ],
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Date blocking",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Date Block",
          path: "/dateblock",
          icon: <CopyPlus className="w-4 h-4" />,
        },
      ],
    },
    {
      icon: <SettingsIcon className="w-5 h-5" />,
      label: "Settings",
      hasDropdown: true,
      dropdownItems: [
        {
          label: "General",
          path: "/settings/general",
          icon: <SettingsIcon className="w-4 h-4" />,
        },
        {
          label: "Account",
          path: "/settings/account",
          icon: <UserIcon className="w-4 h-4" />,
        },
        {
          label: "Integrations",
          path: "/settings/integrations",
          icon: <SettingsIcon className="w-4 h-4" />,
        },
      ],
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      label: "Analytics",
      path: "/analytics",
    },
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
            ${currentPath.startsWith(`/${item.label.toLowerCase()}`)
              ? "bg-blue-50 text-blue-600"
              : ""
            }
          `}
        >
          <div className="flex items-center">
            {item.icon}
            <span className="ml-3 text-xs">{item.label}</span> {/* Reduced font size */}
          </div>
          <div className={`transform transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>

        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: openDropdown === item.label ? `${dropdownHeights[item.label] || 1000}px` : '0',
            opacity: openDropdown === item.label ? 1 : 0
          }}
        >
          <div
            ref={el => {
              if (el && !dropdownHeights[item.label]) {
                dropdownRefs.current[item.label] = el;
                setDropdownHeights(prev => ({
                  ...prev,
                  [item.label]: el.scrollHeight
                }));
              }
            }}
            className="pl-8 mt-1"
          >
            {item.dropdownItems.map((subItem) => (
              <Link
                key={`${subItem.label}-${subItem.path}`}
                to={subItem.path}
                className={`
                  flex items-center w-full p-2 text-xs
                  hover:bg-gray-100 rounded
                  transition-colors duration-200
                  ${currentPath === subItem.path ? "bg-blue-50 text-blue-600" : ""}
                `}
              >
                {subItem.icon && <span className="mr-2 text-xs">{subItem.icon}</span>} {/* Reduced font size */}
                {subItem.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      key={item.label}
      to={item.path}
      className={`
        flex items-center w-full p-2 text-xs
        hover:bg-gray-100 rounded
        transition-colors duration-200
        ${currentPath === item.path ? "bg-blue-50 text-blue-600" : ""}
      `}
    >
      {item.icon && <span className="mr-2 text-xs">{item.icon}</span>} {/* Reduced font size */}
      {item.label}
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
          fixed top-0 left-0 min-h-screen bg-white shadow-lg z-50
          transition-all duration-300 w-64
          scrollbar-hide
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button onClick={toggleSidebar} className="lg:hidden">
            <Menu />
          </button>
        </div>
        <nav className="p-4">{menuItems.map(renderMenuItem)}</nav>
      </aside>
    </>
  );
};

export default Sidebar;