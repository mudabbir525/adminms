import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import User from "./pages/Users";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
// import Carousel from "./components/CarouselSlides";
import Admin from "./Admin/Admin";
import AddMenu from "./Admin/AddMenu";
import EditMenuPage from "./Admin/EditMenuPage";
import AdminMenuPage from "./Admin/AdminMenuPage";
import AddCategory from "./Admin/AddCategory";
import AdminEditCategory from "./Admin/AdminEditCategory";
import EditCategoryById from "./Admin/EditCategoryById";
import EventCategoryForm from "./Admin/EventCategoryForm";
import EventDisplayPage from "./Admin/EventDisplayPage";
import EventEditPage from "./Admin/EventEditPage";
import AddCarousel from "./Admin/AddCarousel";
import AddMealBox from "./Admin/AddMealBox";
import CPDisplay from "./Admin/CPDisplay";
import CPTypesDisplay from "./Admin/CPTypesDisplay";
import AddCP from './Admin/AddCP';
import AddCPS from "./Admin/AddCPS";
import CarouselDisplay from "./Admin/CarouselDisplay";
import MenuItemForm from "./Admin/MenuItemForm";
import MenuItems from "./Admin/MenuDisplay";
import MenuPricingForm from "./Admin/MenuPricingForm";
import MenuPricingDisplay from "./Admin/MenuPricingDisplay";
import EditSection from "./Admin/EditSection";
import EditSectionThree from "./Admin/EditSectionThree";
import AddHomeCategory from "./Admin/AddHomeCategory";
import EditHomeCategories from "./Admin/EditHomeCategory";
import AddHomeItems from "./Admin/AddHomeItem";
import DisplayHomeItems from "./Admin/DisplayHomeItems";
import EditHomeItems from "./Admin/EditHomeItems";

function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        currentPath={location.pathname}
      />
      <div
        className={`
        flex flex-col flex-1 transition-all duration-300 
        ${isSidebarOpen ? "lg:ml-64" : "ml-0"}
      `}
      >
        <Topbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<User />} />
            <Route path="/edit" element={<Admin />} />
            {/* <Route path="/users/roles" element={<UserRoles />} /> */}
            {/* <Route path="/users/permissions" element={<UserPermissions />} /> */}
            <Route path="/settings" element={<Settings />} />
            {/* <Route path="/settings/general" element={<GeneralSettings />} /> */}
            {/* <Route path="/settings/account" element={<AccountSettings />} /> */}
            {/* <Route path="/settings/integrations" element={<Integrations />} /> */}
            <Route path="/analytics" element={<Analytics />} />
            {/* <Route path="/carousel" element={<Carousel />} /> */}
            <Route path="/addmenu" element={<AddMenu />} />
            <Route path="/editmenu/:id" element={<EditMenuPage />} />
            <Route path="/adminmenu" element={<AdminMenuPage />} />
            <Route path="/addcategory" element={<AddCategory />} />
            <Route path="/admincategory" element={<AdminEditCategory />} />
            <Route path="/editcategory/:id" element={<EditCategoryById />} />
            <Route path="/addevent" element={<EventCategoryForm />} />
            <Route path="/admineventdisplay" element={<EventDisplayPage />} />
            <Route path="/admineventedit/:id" element={<EventEditPage />} />
            <Route path="/addcarousel" element={<AddCarousel />} />
            <Route path="/addmealbox" element={<AddMealBox />} />
            <Route path="/displaycp" element={<CPDisplay />} />
            <Route path="/displaycps" element={<CPTypesDisplay />} />
            <Route path="/addcp" element={<AddCP />} />
            <Route path="/addcps" element={<AddCPS />} />
            <Route path="/carousel" element={<CarouselDisplay />} />
            <Route path="/menuitem" element={<MenuItemForm />} />
            <Route path="/menudisplay" element={<MenuItems />} />
            <Route path="/menupricingform" element={<MenuPricingForm />} />
            <Route path="/menupricingdisplay" element={<MenuPricingDisplay />} />
            <Route path="/editsection" element={<EditSection />} />
            <Route path="/editsectionthree" element={<EditSectionThree />} />
            <Route path="/addhc" element={<AddHomeCategory />} />
            <Route path="/edithc" element={<EditHomeCategories />} />
            <Route path="/addhi" element={<AddHomeItems />} />
            <Route path="/dishi" element={<DisplayHomeItems />} />
            <Route path="/edit-home-items/:id" element={<EditHomeItems />} />

          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
