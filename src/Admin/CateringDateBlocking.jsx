import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

const CateringDateBlocking = () => {
  const [blockedDates, setBlockedDates] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    state_id: "",
    district_id: "",
    city_id: "",
    blocked_date: "",
  });
  const [locationData, setLocationData] = useState([]); // Store full location data

  // Fetch all data on component mount
  useEffect(() => {
    fetchLocations();
    fetchBlockedDates();
  }, []);

  // Fetch all locations data
  const fetchLocations = async () => {
    try {
      const response = await fetch("https://adminmahaspice.in/ms3/catering_locations.php");
      const data = await response.json();
      setLocationData(data); // Store full data for reference
      
      // Get unique states
      const uniqueStates = Array.from(new Set(data.map(item => item.state_id)))
        .map(id => data.find(item => item.state_id === id))
        .filter(state => state.state_id);

      // Get unique districts
      const uniqueDistricts = Array.from(new Set(data.map(item => item.district_id)))
        .map(id => data.find(item => item.district_id === id))
        .filter(district => district.district_id);

      // Get unique cities
      const uniqueCities = Array.from(new Set(data.map(item => item.city_id)))
        .map(id => data.find(item => item.city_id === id))
        .filter(city => city.city_id);

      setStates(uniqueStates);
      setDistricts(uniqueDistricts);
      setCities(uniqueCities);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // Fetch blocked dates
  const fetchBlockedDates = async () => {
    try {
      const response = await fetch("https://adminmahaspice.in/ms3/cat_date_blocking.php");
      const data = await response.json();
      setBlockedDates(data);
    } catch (error) {
      console.error("Error fetching blocked dates:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // If city is selected, automatically set state and district
      if (name === 'city_id' && value) {
        const cityInfo = locationData.find(item => item.city_id === value);
        if (cityInfo) {
          newData.state_id = cityInfo.state_id;
          newData.district_id = cityInfo.district_id;
        }
      }
      
      // If district is selected, automatically set state
      if (name === 'district_id' && value) {
        const districtInfo = locationData.find(item => item.district_id === value);
        if (districtInfo) {
          newData.state_id = districtInfo.state_id;
          newData.city_id = ""; // Clear city selection when district changes
        }
      }
      
      // If state is selected, clear district and city
      if (name === 'state_id') {
        newData.district_id = "";
        newData.city_id = "";
      }
      
      return newData;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = {
        state_id: formData.state_id,
        district_id: formData.district_id,
        city_id: formData.city_id,
        blocked_date: formData.blocked_date,
        block_date: true,
      };

      // If only district is selected
      if (formData.district_id && !formData.city_id) {
        const districtInfo = locationData.find(item => item.district_id === formData.district_id);
        if (districtInfo) {
          payload.state_id = districtInfo.state_id;
          payload.city_id = null;
        }
      }

      const response = await fetch("https://adminmahaspice.in/ms3/cat_date_blocking.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchBlockedDates();
        setFormData({ state_id: "", district_id: "", city_id: "", blocked_date: "" });
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to block date');
      }
    } catch (error) {
      console.error("Error blocking date:", error);
      alert('Error blocking date. Please try again.');
    }
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://adminmahaspice.in/ms3/cat_date_blocking.php?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchBlockedDates();
      } else {
        alert('Failed to delete blocked date');
      }
    } catch (error) {
      console.error("Error deleting blocked date:", error);
      alert('Error deleting blocked date. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Block Dates</h1>

      {/* Form to Add Blocked Date */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* State Dropdown */}
          <select
            name="state_id"
            value={formData.state_id}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.state_id} value={state.state_id}>
                {state.state_name}
              </option>
            ))}
          </select>

          {/* District Dropdown */}
          <select
            name="district_id"
            value={formData.district_id}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.district_id} value={district.district_id}>
                {district.district_name}
              </option>
            ))}
          </select>

          {/* City Dropdown */}
          <select
            name="city_id"
            value={formData.city_id}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.city_id} value={city.city_id}>
                {city.city_name}
              </option>
            ))}
          </select>

          {/* Date Input */}
          <input
            type="date"
            name="blocked_date"
            value={formData.blocked_date}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={!formData.blocked_date || (!formData.state_id && !formData.district_id && !formData.city_id)}
        >
          <Plus className="mr-2" size={16} /> Block Date
        </button>
      </form>

      {/* Table to Display Blocked Dates */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">State</th>
              <th className="p-3 text-left">District</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Blocked Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blockedDates.map((date) => (
              <tr key={date.id} className="border-b">
                <td className="p-3">{date.state_name}</td>
                <td className="p-3">{date.district_name}</td>
                <td className="p-3">{date.city_name}</td>
                <td className="p-3">{date.blocked_date}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(date.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CateringDateBlocking;