import React, { useEffect, useState } from "react";
import { Edit, Trash, Plus } from "lucide-react";

const CateringLocations = () => {
  const [locations, setLocations] = useState([]);
  const [newState, setNewState] = useState("");
  const [newDistrict, setNewDistrict] = useState({ name: "", state_id: "" });
  const [newCity, setNewCity] = useState({
    name: "",
    district_id: "",
    price: "",
    superfast_delivery_charges: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://mahaspice.desoftimp.com/ms3/catering_locations.php"
      );
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addState = async () => {
    if (!newState.trim()) {
      alert("Please enter a state name");
      return;
    }
    try {
      setIsLoading(true);
      await fetch(
        "https://mahaspice.desoftimp.com/ms3/catering_locations.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `add_state=true&name=${encodeURIComponent(newState)}`,
        }
      );
      setNewState("");
      fetchData();
    } catch (error) {
      console.error("Error adding state:", error);
    }
  };

  const addDistrict = async () => {
    if (!newDistrict.name.trim() || !newDistrict.state_id) {
      alert("Please enter district name and select state");
      return;
    }

    const districtExists = locations.some((location) => {
      return (
        location.district_name &&
        location.state_id &&
        location.district_name.toLowerCase() ===
          newDistrict.name.toLowerCase() &&
        location.state_id === newDistrict.state_id
      );
    });

    if (districtExists) {
      alert("District already exists in this state!");
      return;
    }

    try {
      setIsLoading(true);
      await fetch(
        "https://mahaspice.desoftimp.com/ms3/catering_locations.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `add_district=true&name=${encodeURIComponent(
            newDistrict.name
          )}&state_id=${newDistrict.state_id}`,
        }
      );
      setNewDistrict({ name: "", state_id: "" });
      fetchData();
    } catch (error) {
      console.error("Error adding district:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addCity = async () => {
    if (
      !newCity.name.trim() ||
      !newCity.district_id ||
      !newCity.price ||
      !newCity.superfast_delivery_charges
    ) {
      alert("Please fill all city details");
      return;
    }

    const cityExists = locations.some((location) => {
      return (
        location.city_name &&
        location.district_id &&
        location.city_name.toLowerCase() === newCity.name.toLowerCase() &&
        location.district_id === newCity.district_id
      );
    });

    if (cityExists) {
      alert("City already exists in this district!");
      return;
    }

    try {
      setIsLoading(true);
      await fetch(
        "https://mahaspice.desoftimp.com/ms3/catering_locations.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `add_city=true&name=${encodeURIComponent(
            newCity.name
          )}&district_id=${newCity.district_id}&price=${
            newCity.price
          }&superfast_delivery_charges=${newCity.superfast_delivery_charges}`,
        }
      );
      setNewCity({
        name: "",
        district_id: "",
        price: "",
        superfast_delivery_charges: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error adding city:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrice = async (city_id, newPrice, newSuperfastPrice) => {
    if (
      !newPrice ||
      isNaN(newPrice) ||
      newPrice <= 0 ||
      !newSuperfastPrice ||
      isNaN(newSuperfastPrice) ||
      newSuperfastPrice <= 0
    ) {
      alert("Please enter valid prices for both normal and superfast delivery");
      return;
    }

    try {
      setIsLoading(true);
      await fetch(
        "https://mahaspice.desoftimp.com/ms3/catering_locations.php",
        {
          method: "PUT",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `city_id=${city_id}&price=${newPrice}&superfast_delivery_charges=${newSuperfastPrice}`,
        }
      );
      fetchData();
    } catch (error) {
      console.error("Error updating prices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        "https://mahaspice.desoftimp.com/ms3/catering_locations.php",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `type=${type}&id=${id}`,
        }
      );
      const result = await response.json();
      if (result.status === "error") {
        alert(result.message);
      } else {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const groupedData = locations.reduce((acc, curr) => {
    if (!acc[curr.state_id]) {
      acc[curr.state_id] = {
        state_name: curr.state_name,
        districts: {},
      };
    }
    if (!acc[curr.state_id].districts[curr.district_id]) {
      acc[curr.state_id].districts[curr.district_id] = {
        district_name: curr.district_name,
        cities: [],
      };
    }
    if (curr.city_id) {
      acc[curr.state_id].districts[curr.district_id].cities.push({
        city_id: curr.city_id,
        city_name: curr.city_name,
        delivery_price: curr.delivery_price,
        superfast_delivery_charges: curr.superfast_delivery_charges,
      });
    }
    return acc;
  }, {});

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Delivery Management
      </h1>

      {/* Add State */}
      <div className="flex justify-around">
        <div className="bg-white p-6 w-full rounded-lg shadow-md m-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Add New State
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="State Name"
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
              className="border p-2 rounded-lg flex-1"
            />
            <button
              onClick={addState}
              disabled={isLoading}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              Add State
            </button>
          </div>
        </div>

        {/* Add District */}
        <div className="bg-white p-6 w-full rounded-lg shadow-md m-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Add New District
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="District Name"
              value={newDistrict.name}
              onChange={(e) =>
                setNewDistrict({ ...newDistrict, name: e.target.value })
              }
              className="border p-2 rounded-lg flex-1"
            />
            <select
              value={newDistrict.state_id}
              onChange={(e) =>
                setNewDistrict({ ...newDistrict, state_id: e.target.value })
              }
              className="border p-2 rounded-lg"
            >
              <option value="">Select State</option>
              {Object.entries(groupedData).map(([state_id, state]) => (
                <option key={state_id} value={state_id}>
                  {state.state_name}
                </option>
              ))}
            </select>
            <button
              onClick={addDistrict}
              disabled={isLoading}
              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              Add District
            </button>
          </div>
        </div>
      </div>

      {/* Add City */}
      <div className="bg-white p-6 rounded-lg shadow-md mx-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Add New City
        </h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="City Name"
            value={newCity.name}
            onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
            className="border p-2 rounded-lg flex-1"
          />
          <select
            value={newCity.district_id}
            onChange={(e) =>
              setNewCity({ ...newCity, district_id: e.target.value })
            }
            className="border p-2 rounded-lg"
          >
            <option value="">Select District</option>
            {Object.entries(groupedData).flatMap(([_, state]) =>
              Object.entries(state.districts).map(([district_id, district]) => (
                <option key={district_id} value={district_id}>
                  {district.district_name}
                </option>
              ))
            )}
          </select>
          <input
            type="number"
            placeholder="Delivery Price"
            value={newCity.price}
            onChange={(e) => setNewCity({ ...newCity, price: e.target.value })}
            className="border p-2 rounded-lg w-32"
            min="0"
            step="0.01"
          />
          <input
            type="number"
            placeholder="Superfast Delivery Charges"
            value={newCity.superfast_delivery_charges}
            onChange={(e) =>
              setNewCity({
                ...newCity,
                superfast_delivery_charges: e.target.value,
              })
            }
            className="border p-2 rounded-lg w-32"
            min="0"
            step="0.01"
          />
          <button
            onClick={addCity}
            disabled={isLoading}
            className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            <b>Add City</b>
          </button>
        </div>
      </div>

      {/* Display Data */}
      <div className="bg-white p-6 mx-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Delivery Locations
        </h2>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2 text-left">State</th>
                  <th className="border p-2 text-left">District</th>
                  <th className="border p-2 text-left">City</th>
                  <th className="border p-2 text-right">Normal Price</th>
                  <th className="border p-2 text-right">Superfast Price</th>
                  <th className="border p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedData).map(([state_id, state]) => {
                  const stateRowSpan = Object.values(state.districts).reduce(
                    (total, district) =>
                      total + Math.max(district.cities.length, 1),
                    0
                  );

                  return Object.entries(state.districts).map(
                    ([district_id, district], districtIndex) => {
                      const districtRowSpan = Math.max(
                        district.cities.length,
                        1
                      );

                      return (
                        district.cities.length > 0 ? district.cities : [null]
                      ).map((city, cityIndex) => (
                        <tr key={`${state_id}-${district_id}-${cityIndex}`}>
                          {districtIndex === 0 && cityIndex === 0 && (
                            <td rowSpan={stateRowSpan} className="border p-2">
                              <div className="flex items-center justify-between">
                                <span>{state.state_name}</span>
                                <button
                                  onClick={() => deleteItem("state", state_id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash size={16} />
                                </button>
                              </div>
                            </td>
                          )}
                          {cityIndex === 0 && (
                            <td
                              rowSpan={districtRowSpan}
                              className="border p-2"
                            >
                              <div className="flex items-center justify-between">
                                <span>{district.district_name}</span>
                                <button
                                  onClick={() =>
                                    deleteItem("district", district_id)
                                  }
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash size={16} />
                                </button>
                              </div>
                            </td>
                          )}
                          <td className="border p-2">
                            {city?.city_name || "No cities"}
                          </td>
                          <td className="border p-2 text-right">
                            {city?.delivery_price
                              ? `₹${parseFloat(city.delivery_price).toFixed(2)}`
                              : "-"}
                          </td>
                          <td className="border p-2 text-right">
                            {city?.superfast_delivery_charges
                              ? `₹${parseFloat(
                                  city.superfast_delivery_charges
                                ).toFixed(2)}`
                              : "-"}
                          </td>
                          <td className="border p-2 text-center">
                            {city && (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    const newPrice = prompt(
                                      "Enter new normal delivery price",
                                      city.delivery_price
                                    );
                                    const newSuperfastPrice = prompt(
                                      "Enter new superfast delivery charges",
                                      city.superfast_delivery_charges
                                    );
                                    if (
                                      newPrice !== null &&
                                      newSuperfastPrice !== null
                                    ) {
                                      updatePrice(
                                        city.city_id,
                                        newPrice,
                                        newSuperfastPrice
                                      );
                                    }
                                  }}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteItem("city", city.city_id)
                                  }
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ));
                    }
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CateringLocations;
