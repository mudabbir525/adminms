import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu } from '@headlessui/react';
import { 
  Trash2, 
  Edit, 
  Filter, 
  Salad,
  Drumstick,
  Utensils,
  ChevronDown,
  Clock,
  Zap
} from "lucide-react";
import EditCPTypeModal from "./EditCpTypeModal";

const CPTypesDisplay = () => {
  const [cpTypes, setCpTypes] = useState([]);
  const [filteredCPTypes, setFilteredCPTypes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editingCPType, setEditingCPType] = useState(null);
  
  // Filter states
  const [selectedVegFilter, setSelectedVegFilter] = useState({ label: "All Items", value: "all" });
  const [selectedCPFilter, setSelectedCPFilter] = useState({ label: "All CPs", value: "all" });
  const [selectedMealFilter, setSelectedMealFilter] = useState({ label: "All Meals", value: "all" });
  const [selectedSpeedFilter, setSelectedSpeedFilter] = useState({ label: "All Speed", value: "No" });

  useEffect(() => {
    fetchCPTypes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedVegFilter, selectedCPFilter, selectedMealFilter, selectedSpeedFilter, cpTypes]);

  const fetchCPTypes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://mahaspice.desoftimp.com/ms3/cptypes.php"
      );
      setCpTypes(response.data);
      setFilteredCPTypes(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch CP Types. Please try again.");
      console.error("Error fetching CP Types:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cpTypes];

    if (selectedVegFilter.value !== "all") {
      filtered = filtered.filter(item => item.veg_non_veg === selectedVegFilter.value);
    }

    if (selectedCPFilter.value !== "all") {
      filtered = filtered.filter(item => item.cp_type === selectedCPFilter.value);
    }

    if (selectedMealFilter.value !== "all") {
      filtered = filtered.filter(item => item.meal_time === selectedMealFilter.value);
    }

    if (selectedSpeedFilter.value !== "all") {
      filtered = filtered.filter(item => item.is_superfast === selectedSpeedFilter.value);
    }

    setFilteredCPTypes(filtered);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this CP Type?');
    
    if (isConfirmed) {
      try {
        await axios.delete("https://mahaspice.desoftimp.com/ms3/cptypes.php", {
          data: JSON.stringify({ id: id }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        await fetchCPTypes();
      } catch (err) {
        setError("Failed to delete CP Type. Please try again.");
        console.error("Error deleting CP Type:", err);
      }
    }
  };

  const handleEdit = (cpType) => {
    setEditingCPType(cpType);
  };

  const closeEditModal = () => {
    setEditingCPType(null);
  };

  const uniqueCPTypes = [...new Set(cpTypes.map(item => item.cp_type))];
  const uniqueMealTimes = [...new Set(cpTypes.map(item => item.meal_time))];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <p className="ml-4">Loading CP Types...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <p>{error}</p>
        <button onClick={fetchCPTypes} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-fill mx-auto mt-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 bg-gray-100 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-6 w-6 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">CP Types Management</h1>
          </div>
          
          <div className="flex gap-4 flex-wrap">
            {/* Veg/Non-Veg Filter */}
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="inline-flex w-48 justify-between items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-gray-500" />
                  {selectedVegFilter.label}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Menu.Button>

              <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectedVegFilter({ label: "All Items", value: "all" })}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } flex w-full items-center px-4 py-2 text-sm`}
                      >
                        <Utensils className="mr-2 h-4 w-4" />
                        All Items
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectedVegFilter({ label: "Vegetarian", value: "Veg" })}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } flex w-full items-center px-4 py-2 text-sm`}
                      >
                        <Salad className="mr-2 h-4 w-4 text-green-600" />
                        Vegetarian
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectedVegFilter({ label: "Non-Vegetarian", value: "Non-Veg" })}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } flex w-full items-center px-4 py-2 text-sm`}
                      >
                        <Drumstick className="mr-2 h-4 w-4 text-red-600" />
                        Non-Vegetarian
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>

            {/* CP Type Filter */}
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="inline-flex w-48 justify-between items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  {selectedCPFilter.label}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Menu.Button>

              <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectedCPFilter({ label: "All CPs", value: "all" })}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } flex w-full items-center px-4 py-2 text-sm`}
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        All CPs
                      </button>
                    )}
                  </Menu.Item>
                  {uniqueCPTypes.map(cpType => (
                    <Menu.Item key={cpType}>
                      {({ active }) => (
                        <button
                          onClick={() => setSelectedCPFilter({ label: cpType, value: cpType })}
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } flex w-full items-center px-4 py-2 text-sm`}
                        >
                          <Filter className="mr-2 h-4 w-4" />
                          {cpType}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Menu>

            {/* Meal Time Filter */}
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="inline-flex w-48 justify-between items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  {selectedMealFilter.label}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Menu.Button>

              <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectedMealFilter({ label: "All Meals", value: "all" })}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } flex w-full items-center px-4 py-2 text-sm`}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        All Meals
                      </button>
                    )}
                  </Menu.Item>
                  {uniqueMealTimes.map(mealTime => (
                    <Menu.Item key={mealTime}>
                      {({ active }) => (
                        <button
                          onClick={() => setSelectedMealFilter({ label: mealTime, value: mealTime })}
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } flex w-full items-center px-4 py-2 text-sm`}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {mealTime}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Menu>

            {/* Superfast Filter */}
            {/* <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="inline-flex w-48 justify-between items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-gray-500" />
                  {selectedSpeedFilter.label}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Menu.Button>

              <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectedSpeedFilter({ label: "All Speed", value: "all" })}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } flex w-full items-center px-4 py-2 text-sm`}
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        All Speed
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectedSpeedFilter({ label: "Superfast", value: "Yes" })}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } flex w-full items-center px-4 py-2 text-sm`}
                      >
                        <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                        Superfast
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectedSpeedFilter({ label: "Regular", value: "No" })}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } flex w-full items-center px-4 py-2 text-sm`}
                      >
                        <Utensils className="mr-2 h-4 w-4 text-gray-500" />
                        Regular
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu> */}
          </div>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 border-b">Thumbnail</th>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Type</th>
                <th className="p-4 border-b">Veg/Non-Veg</th>
                <th className="p-4 border-b">Meal Time</th>
                <th className="p-4 border-b">Speed</th>
                <th className="p-4 border-b">Description</th>
                <th className="p-4 border-b">Price</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCPTypes.map((cpType) => (
                <tr key={cpType.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={`https://mahaspice.desoftimp.com/ms3/${cpType.image_address}`}
                      alt={cpType.cp_name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-4 font-medium">{cpType.cp_name}</td>
                  <td className="p-4">{cpType.cp_type}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-2">
                      {cpType.veg_non_veg === "Veg" ? (
                        <>
                          <Salad className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-semibold">Veg</span>
                        </>
                      ) : (
                        <>
                          <Drumstick className="h-4 w-4 text-red-600" />
                          <span className="text-red-600 font-semibold">Non-Veg</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      {cpType.meal_time}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-2">
                      {cpType.is_superfast === "Yes" ? (
                        <>
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="text-yellow-600 font-semibold">Superfast</span>
                        </>
                      ) : (
                        <>
                          <Utensils className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Regular</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-4 max-w-xs truncate" title={cpType.description}>
                    {cpType.description}
                  </td>
                  <td className="p-4">₹{parseFloat(cpType.price).toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(cpType)}
                        className="p-2 bg-yellow-100 rounded hover:bg-yellow-200 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5 text-yellow-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(cpType.id)}
                        className="p-2 bg-red-100 rounded hover:bg-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCPTypes.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No CP Types found matching the selected filters.
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingCPType && (
        <EditCPTypeModal
          cpType={editingCPType}
          onClose={closeEditModal}
          onSave={fetchCPTypes}
        />
      )}
    </div>
  );
};

export default CPTypesDisplay;