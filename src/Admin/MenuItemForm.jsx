import React, { useState, useEffect } from "react";
import {
  Loader2,
  UtensilsCrossed,
  Leaf,
  Beef,
  Tag,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Menu,
} from "lucide-react";
import axios from "axios";

const MenuItemForm = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    categoryId: "",
    menuTypeId: "",
    isVeg: true,
    selectedEvents: [],
    price: "",
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMenuType, setSelectedMenuType] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, eventsRes] = await Promise.all([
          axios.get("https://adminmahaspice.in/ms3/getcategory.php"),
          axios.get("https://adminmahaspice.in/ms3/get_events.php"),
        ]);
        const uniqueCategories = Array.from(
          new Set(categoriesRes.data.map((cat) => cat.category_name))
        ).map((name) => {
          const categoryItems = categoriesRes.data.filter(
            (cat) => cat.category_name === name
          );
          return {
            name,
            menuTypes: categoryItems.map((cat) => ({
              id: cat.category_id,
              name: cat.menu_type,
              limit: parseInt(cat.category_limit),
            })),
          };
        });
        setCategories(uniqueCategories);
        setEventTypes(eventsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load form data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectAllEvents = (isChecked) => {
    if (isChecked) {
      // Map all events to the format needed for selectedEvents
      const allEvents = eventTypes.map((event) => ({
        eventId: event.event_id,
        eventName: event.event_name,
        eventCategory: event.event_category,
        price: formData.isVeg
          ? event.event_veg_price
          : event.event_nonveg_price,
      }));
      setFormData({ ...formData, selectedEvents: allEvents });
    } else {
      setFormData({ ...formData, selectedEvents: [] });
    }
  };

  // Rest of your existing handlers...
  const handleCategoryChange = (categoryName) => {
    const category = categories.find((cat) => cat.name === categoryName);
    setSelectedCategory(category);
    setSelectedMenuType(null);
    setFormData({
      ...formData,
      categoryId: "",
      menuTypeId: "",
    });
  };

  const handleMenuTypeChange = (menuType) => {
    setSelectedMenuType(menuType);
    setFormData({
      ...formData,
      categoryId: menuType.id,
      menuTypeId: menuType.id,
    });
  };

  const handleEventChange = (event, isChecked) => {
    const updatedEvents = isChecked
      ? [
          ...formData.selectedEvents,
          {
            eventId: event.event_id,
            eventName: event.event_name,
            eventCategory: event.event_category,
            price: formData.isVeg
              ? event.event_veg_price
              : event.event_nonveg_price,
          },
        ]
      : formData.selectedEvents.filter((ev) => ev.eventId !== event.event_id);
    setFormData({ ...formData, selectedEvents: updatedEvents });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedMenuType) {
      setError("Please select a menu type");
      return;
    }
    setLoading(true);
    try {
      const jsonData = {
        itemName: formData.itemName,
        categoryId: formData.categoryId,
        menuTypeId: formData.menuTypeId,
        isVeg: formData.isVeg,
        selectedEvents: formData.selectedEvents,
        price: parseFloat(formData.price),
      };
      const response = await axios.post(
        "https://adminmahaspice.in/ms3/insert_menu_item.php",
        jsonData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setSuccess("Menu item added successfully!");
        setFormData({
          itemName: "",
          categoryId: "",
          menuTypeId: "",
          isVeg: true,
          selectedEvents: [],
          price: "",
        });
        setSelectedCategory(null);
        setSelectedMenuType(null);
      } else {
        setError(response.data.message || "Failed to add menu item");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.response?.data?.message || "Error adding menu item");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading form...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl my-5">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Menu className="mr-2" />
            Add Menu Item
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <UtensilsCrossed className="w-5 h-5 text-gray-600" />
                  <label className="block text-sm font-semibold text-gray-700">
                    Item Name
                  </label>
                </div>
                <input
                  type="text"
                  required
                  className="mt-1 block w-1/3 p-3 rounded-lg border-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-black transition-colors"
                  value={formData.itemName}
                  onChange={(e) =>
                    setFormData({ ...formData, itemName: e.target.value })
                  }
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-gray-600" />
                  <label className="block text-sm font-semibold text-gray-700">
                    Category
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                        selectedCategory?.name === category.name
                          ? "bg-green-100 border-2 border-green-500"
                          : "bg-white border-2 border-gray-200 hover:border-green-300"
                      }`}
                      onClick={() => handleCategoryChange(category.name)}
                    >
                      <input
                        type="radio"
                        id={`category-${category.name}`}
                        name="category"
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                        checked={selectedCategory?.name === category.name}
                        onChange={() => {}}
                      />
                      <label
                        htmlFor={`category-${category.name}`}
                        className="ml-3 text-gray-700 font-medium"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {selectedCategory && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                    <label className="block text-sm font-semibold text-gray-700">
                      Menu Types
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedCategory.menuTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                          selectedMenuType?.id === type.id
                            ? "bg-green-100 border-2 border-green-500"
                            : "bg-white border-2 border-gray-200 hover:border-green-300"
                        }`}
                        onClick={() => handleMenuTypeChange(type)}
                      >
                        <input
                          type="radio"
                          id={`type-${type.id}`}
                          name="menuType"
                          className="h-4 w-4 text-green-600 focus:ring-green-500"
                          checked={selectedMenuType?.id === type.id}
                          onChange={() => {}}
                        />
                        <label htmlFor={`type-${type.id}`} className="ml-3">
                          <span className="text-gray-700 font-medium">
                            {type.name}
                          </span>
                          <span className="block text-sm text-gray-500">
                            Limit: {type.limit} items
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-4">
                  {formData.isVeg ? (
                    <Leaf className="w-5 h-5 text-green-600" />
                  ) : (
                    <Beef className="w-5 h-5 text-red-600" />
                  )}
                  <label className="block text-sm font-semibold text-gray-700">
                    Type
                  </label>
                </div>
                <div className="flex gap-6">
                  <div
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                      formData.isVeg
                        ? "bg-green-100 border-2 border-green-500"
                        : "bg-white border-2 border-gray-200 hover:border-green-300"
                    }`}
                    onClick={() => setFormData({ ...formData, isVeg: true })}
                  >
                    <Leaf className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium">Vegetarian</span>
                  </div>
                  <div
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                      !formData.isVeg
                        ? "bg-red-100 border-2 border-red-500"
                        : "bg-white border-2 border-gray-200 hover:border-red-300"
                    }`}
                    onClick={() => setFormData({ ...formData, isVeg: false })}
                  >
                    <Beef className="w-5 h-5 text-red-600 mr-2" />
                    <span className="font-medium">Non-Vegetarian</span>
                  </div>
                </div>
              </div>

              {/* <div className="space-y-2"> */}
              <label className="block text-sm font-medium">
                <Calendar className="inline-block w-4 h-4 mr-1" />
                Event Types
              </label>

              {/* Select All Checkbox */}
              <label
                htmlFor="selectAll"
                className="flex items-center w-1/3 p-2 border rounded-md bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-green-600"
                  id="selectAll"
                  checked={formData.selectedEvents.length === eventTypes.length}
                  onChange={(e) => handleSelectAllEvents(e.target.checked)}
                />
                <span className="ml-2 font-medium">Select All Events</span>
              </label>

              {/* Event Types Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {eventTypes.map((event) => {
                  const isChecked = formData.selectedEvents.some(
                    (ev) => ev.eventId === event.event_id
                  );

                  return (
                    <label
                      key={event.event_id}
                      htmlFor={`event-${event.event_id}`}
                      className={`cursor-pointer p-3 border rounded-md transition-colors ${
                        isChecked
                          ? "bg-green-50 border-green-500"
                          : "bg-white border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`event-${event.event_id}`}
                          className="form-checkbox h-4 w-4 text-green-600"
                          checked={isChecked}
                          onChange={(e) =>
                            handleEventChange(event, e.target.checked)
                          }
                        />
                        <div className="ml-3 flex-1">
                          <div className="font-medium">{event.event_name}</div>
                          <div className="text-sm text-gray-500">
                            {event.event_category}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formData.isVeg
                              ? `Veg: ₹${event.event_veg_price}`
                              : `Non-veg: ₹${event.event_nonveg_price}`}
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <label className="block text-sm font-semibold text-gray-700">
                    Price
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="pl-8 mt-1 block w-1/4 p-3 border-2 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center p-4 bg-red-50 rounded-md text-red-500">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center p-4 bg-green-50 rounded-md text-green-500">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                {success}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Submitting...
                </>
              ) : (
                "Add Menu Item"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuItemForm;

