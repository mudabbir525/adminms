import React, { useState, useEffect } from "react";
import axios from "axios";

const CPDisplay = () => {
  const [cpTypes, setCpTypes] = useState([]);
  const [editingType, setEditingType] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const BASE_URL = "https://mahaspice.desoftimp.com/ms3";

  // Fetch CP Types
  const fetchCPTypes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cps.php`);
      setCpTypes(response.data);
    } catch (error) {
      console.error("Error fetching CP Types:", error);
      setMessage("Error fetching CP Types");
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchCPTypes();
  }, []);

  // Handle Delete
  const handleDelete = async (cpType) => {
    if (window.confirm(`Are you sure you want to delete CP Type: ${cpType}?`)) {
      try {
        await axios.delete(`${BASE_URL}/deletecp.php`, {
          data: { cp_type: cpType },
        });

        // Refresh the list
        fetchCPTypes();
        setMessage("CP Type deleted successfully");
        setIsError(false);
      } catch (error) {
        console.error("Error deleting CP Type:", error);
        setMessage("Error deleting CP Type");
        setIsError(true);
      }
    }
  };

  // Handle Edit
  const handleEdit = async (e) => {
    e.preventDefault();

    if (!editingType.cp_type.trim()) {
      setMessage("CP Type cannot be empty");
      setIsError(true);
      return;
    }

    try {
      await axios.put(`${BASE_URL}/editcp.php`, {
        old_cp_type: editingType.original_cp_type,
        new_cp_type: editingType.cp_type,
      });

      // Reset editing state and refresh list
      setEditingType(null);
      fetchCPTypes();
      setMessage("CP Type updated successfully");
      setIsError(false);
    } catch (error) {
      console.error("Error updating CP Type:", error);
      setMessage("Error updating CP Type");
      setIsError(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">CP Types</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-center ${
            isError
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-green-100 border border-green-400 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CP Type
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cpTypes.length === 0 ? (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                  No CP Types found
                </td>
              </tr>
            ) : (
              cpTypes.map((type) => (
                <tr key={type.cp_type}>
                  {editingType &&
                  editingType.original_cp_type === type.cp_type ? (
                    <td colSpan="2" className="px-6 py-4">
                      <form onSubmit={handleEdit} className="flex space-x-2">
                        <input
                          type="text"
                          value={editingType.cp_type}
                          onChange={(e) =>
                            setEditingType({
                              ...editingType,
                              cp_type: e.target.value,
                            })
                          }
                          className="flex-grow shadow appearance-none border rounded py-2 px-3 text-gray-700 
                                                    leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="submit"
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 
                                                    rounded focus:outline-none focus:shadow-outline"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingType(null)}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 
                                                    rounded focus:outline-none focus:shadow-outline"
                        >
                          Cancel
                        </button>
                      </form>
                    </td>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {type.cp_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() =>
                              setEditingType({
                                cp_type: type.cp_type,
                                original_cp_type: type.cp_type,
                              })
                            }
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 
                                                        rounded focus:outline-none focus:shadow-outline transition duration-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(type.cp_type)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 
                                                        rounded focus:outline-none focus:shadow-outline transition duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CPDisplay;