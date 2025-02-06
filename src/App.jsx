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
import EditCarousel from "./Admin/EditCarousel";
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
import OrderManagement from "./Admin/MealOrderManagement";
import AddCoupon from "./Admin/AddCoupon";
import DisplayCoupons from "./Admin/DisplayCoupons";
import EditCoupon from "./Admin/EditCoupon";
import AddGST from "./Admin/AddGST";
import DisplayGST from "./Admin/DisplayGST";
import DeliveryLocationForm from "./Admin/DeliveryLocationForm";
import DisplayDL from "./Admin/DsiplayDL";
import CRPB from "./Admin/CRPB";
import DisplayCRPB from "./Admin/DisplayCRPB";
import CRPBEdit from "./Admin/CRPBEdit";
import SuperfastCategories from "./Admin/SuperfastCategories";
import AddSupItems from "./Admin/AddSupItems";
import Offers from "./Admin/Offers";
import SectionSuperfast from "./Admin/Superfast";
import SuperfastEvents from "./Admin/SuperfastEvents";
import SupEventPricing from "./Admin/SupEventPricing";
import SupItems from "./Admin/SupItems";
import DateBlocking from "./Admin/DateBlocking";
import AddSupHomeCategory from "./Admin/AddSupHomeCategory";
import AddSupHomeItems from "./Admin/AddSupHomeItems";
import EditSupHomeItems from "./Admin/EditSupHomeItems";
import EditSupHomeCategories from "./Admin/EditSupHomecategories";
import DisplaySupHomeItems from "./Admin/DisplaySupHomeItems";
import FoodPackagesDisplay from "./Admin/Positions";
import SupCPTypesDisplay from "./Admin/SuperfastCPTypesDisplay";
import AddSupCps from "./Admin/AddSupCps";
import FoodSupPackagesDisplay from "./Admin/SupPositions";
import CategoryManagement from "./Admin/CategoryManagement";
import ItemManagement from "./Admin/ItemManagement";
import DisplayEnq from "./Admin/DisplayEnq";



function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <div>
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
              <Route path="/editcarousel/:id" element={<EditCarousel />} />
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
              <Route path="/mealorders" element={<OrderManagement />} />
              <Route path="/coupon" element={<AddCoupon />} />
              <Route path="/displaycoupons" element={<DisplayCoupons />} />
              <Route path="/coupon/:id" element={<EditCoupon />} />
              <Route path="/addgst" element={<AddGST />} />
              <Route path="/gst" element={<DisplayGST />} />
              <Route path="/dloc" element={<DeliveryLocationForm />} />
              <Route path="/disloc" element={<DisplayDL />} />
              <Route path="/crpb" element={<CRPB />} />
              <Route path="/display-crpb" element={<DisplayCRPB />} />
              <Route path="/edit-crpb/:id" element={<CRPBEdit />} />
              <Route path="/sf-category" element={<SuperfastCategories />} />
              <Route path="/sf-items" element={<AddSupItems />} />
              <Route path="/superfast-items" element={<SupItems />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/superfast" element={<SectionSuperfast />} />
              <Route path="/superfast-events" element={<SuperfastEvents />} />
              <Route path="/superfast-events-pricing" element={<SupEventPricing />} />
              <Route path="/dateblock" element={<DateBlocking />} />
              <Route path="/superfast-add-home-category" element={<AddSupHomeCategory />} />
              <Route path="/superfast-add-home-items" element={<AddSupHomeItems />} />
              <Route path="/superfast-edit-home-items/:id" element={<EditSupHomeItems />} />
              <Route path="/superfast-home-categories" element={<EditSupHomeCategories />} />
              <Route path="/superfast-home-Items" element={<DisplaySupHomeItems />} />
              <Route path="/positions" element={<FoodPackagesDisplay />} />
              <Route path="/Superfast-cp-display" element={<SupCPTypesDisplay />} />
              <Route path="/Superfast-cp-add" element={<AddSupCps />} />
              <Route path="/superfast-box-positions" element={<FoodSupPackagesDisplay />} />
              <Route path="/design-categories" element={<CategoryManagement />} />
              <Route path="/design-Items" element={<ItemManagement />} />
              <Route path="/design-enquries" element={<DisplayEnq />} />





            </Routes>

          </main>

        </div>

      </div>

    </div>
  );
}

export default App;
