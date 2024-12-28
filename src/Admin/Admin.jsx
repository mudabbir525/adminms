// import React, { useState } from "react";
// import {
//   CopyPlus,
//   Edit,
//   LayoutGrid,
//   Users,
//   ShoppingCart,
//   Calendar,
//   Package,
//   Settings,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// const Admin = () => {
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

//   // Admin menu items configuration with expanded categories
//   const adminMenuItems = [
//     {
//       category: "Menu Management",
//       items: [
//         {
//           icon: <CopyPlus className="w-5 h-5" />,
//           label: "Menu Add",
//           key: "addmenu",
//           path: "/addmenu",
//         },
//         {
//           icon: <Edit className="w-5 h-5" />,
//           label: "Menu Edit",
//           key: "adminmenu",
//           path: "/adminmenu",
//         },
//       ],
//     },
//     {
//       category: "Category Management",
//       items: [
//         {
//           icon: <CopyPlus className="w-5 h-5" />,
//           label: "Add Category",
//           key: "addcategory",
//           path: "/addcategory",
//         },
//         {
//           icon: <Edit className="w-5 h-5" />,
//           label: "Admin Category",
//           key: "admincategory",
//           path: "/admincategory",
//         },
//       ],
//     },
//     {
//       category: "Event Management",
//       items: [
//         {
//           icon: <CopyPlus className="w-5 h-5" />,
//           label: "Add Event",
//           key: "addevent",
//           path: "/addevent",
//         },
//         {
//           icon: <Edit className="w-5 h-5" />,
//           label: "Event Display",
//           key: "admineventdisplay",
//           path: "/admineventdisplay",
//         },
//       ],
//     },
//     {
//       category: "Meal Box",
//       items: [
//         {
//           icon: <CopyPlus className="w-5 h-5" />,
//           label: "Add CP",
//           key: "addcp",
//           path: "/addcp",
//         },
//         {
//           icon: <CopyPlus className="w-5 h-5" />,
//           label: "Add CP Package",
//           key: "addcps",
//           path: "/addcps",
//         },
//         {
//           icon: <Edit className="w-5 h-5" />,
//           label: "Display CP",
//           key: "displaycp",
//           path: "/displaycp",
//         },
//         {
//           icon: <Edit className="w-5 h-5" />,
//           label: "Display CP Package",
//           key: "displaycps",
//           path: "/displaycps",
//         },

//       ],
//     },
//     {
//       category: "Carousel",
//       items: [
//         {
//           icon: <CopyPlus className="w-5 h-5" />,
//           label: "Add Carousel",
//           key: "addcarousel",
//           path: "/addcarousel",
//         },
//         {
//           icon: <Edit className="w-5 h-5" />,
//           label: "Display Carousel",
//           key: "carousel",
//           path: "/carousel",
//         },

//       ],
//     },
//   ];

//   const toggleSidebar = () => {
//     setIsSidebarCollapsed(!isSidebarCollapsed);
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div
//         className={`
//           bg-white 
//           shadow-xl 
//           transition-all 
//           duration-300 
//           ease-in-out 
//           ${isSidebarCollapsed ? "w-20" : "w-64"}
//           relative
//           border-r
//         `}
//       >
//         {/* Sidebar Toggle */}
//         <button
//           onClick={toggleSidebar}
//           className="
//             absolute 
//             top-4 
//             -right-4 
//             bg-white 
//             border 
//             rounded-full 
//             p-1 
//             shadow-md 
//             hover:bg-gray-50
//             transition
//           "
//         >
//           {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
//         </button>

//         {/* Logo */}
//         <div className="p-6 text-center">
//           <h2
//             className={`
//             font-bold 
//             text-xl 
//             text-gray-800 
//             transition-opacity 
//             ${isSidebarCollapsed ? "opacity-0" : "opacity-100"}
//           `}
//           >
//             Admin Panel
//           </h2>
//         </div>

//         {/* Menu Categories */}
//         <nav className="px-4">
//           {adminMenuItems.map((category, categoryIndex) => (
//             <div key={categoryIndex} className="mb-4">
//               <h3
//                 className={`
//                   text-xs 
//                   uppercase 
//                   text-gray-500 
//                   font-semibold 
//                   mb-2 
//                   transition-opacity 
//                   ${isSidebarCollapsed ? "opacity-0" : "opacity-100"}
//                 `}
//               >
//                 {category.category}
//               </h3>

//               {category.items.map((item) => (
//                 <Link
//                   key={item.key}
//                   to={item.path}
//                   className="
//                     flex 
//                     items-center 
//                     py-2 
//                     px-3 
//                     rounded-lg 
//                     mb-1 
//                     text-gray-700 
//                     hover:bg-blue-50 
//                     hover:text-blue-600 
//                     transition-colors 
//                     group
//                   "
//                 >
//                   <span className="mr-3">{item.icon}</span>
//                   <span
//                     className={`
//                       transition-opacity 
//                       ${isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100"}
//                     `}
//                   >
//                     {item.label}
//                   </span>
//                 </Link>
//               ))}
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 overflow-y-auto">
//         <header
//           className="
//           bg-white 
//           shadow-sm 
//           p-4 
//           flex 
//           justify-between 
//           items-center
//         "
//         >
//           <h1 className="text-2xl font-semibold text-gray-800">
//             Dashboard Overview
//           </h1>
//           <div className="flex items-center space-x-4">
//             <button
//               className="
//               text-gray-600 
//               hover:text-gray-800 
//               transition
//             "
//             >
//               <Settings />
//             </button>
//           </div>
//         </header>

//         {/* Placeholders for future dashboard widgets */}
//         <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div
//             className="
//             bg-white 
//             rounded-lg 
//             shadow-md 
//             p-6 
//             border 
//             hover:shadow-lg 
//             transition
//           "
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Total Orders
//               </h3>
//               <ShoppingCart className="text-blue-500" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900">1,234</p>
//           </div>

//           <div
//             className="
//             bg-white 
//             rounded-lg 
//             shadow-md 
//             p-6 
//             border 
//             hover:shadow-lg 
//             transition
//           "
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">Users</h3>
//               <Users className="text-green-500" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900">456</p>
//           </div>

//           <div
//             className="
//             bg-white 
//             rounded-lg 
//             shadow-md 
//             p-6 
//             border 
//             hover:shadow-lg 
//             transition
//           "
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Upcoming Events
//               </h3>
//               <Calendar className="text-purple-500" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900">12</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Admin;