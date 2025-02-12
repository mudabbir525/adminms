import React, { useEffect, useState } from "react";
import { Edit, Trash2, Save } from "lucide-react";

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // Track which resource is being edited
  const [editedData, setEditedData] = useState({}); // Store edited data

  // Fetch resource details
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("https://mahaspice.desoftimp.com/ms3/get-resources.php");
        if (!response.ok) {
          throw new Error("Failed to fetch resources.");
        }
        const data = await response.json();

        if (data.success) {
          setResources(data.data);
        } else {
          throw new Error(data.error || "Failed to fetch resources.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Handle edit button click
  const handleEdit = (id) => {
    setEditingId(id);
    const resource = resources.find((r) => r.id === id);
    setEditedData({
      cost_per_unit: resource.cost_per_unit,
      min_requirement_ratio: resource.min_requirement_ratio,
      description: resource.description,
    });
  };

  // Handle save button click
  const handleSave = async (id) => {
    try {
      const response = await fetch("https://mahaspice.desoftimp.com/ms3/update-resource.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...editedData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update resource.");
      }

      const data = await response.json();

      if (data.success) {
        // Update the resource in the state
        setResources((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, ...editedData }
              : r
          )
        );
        setEditingId(null); // Exit edit mode
      } else {
        throw new Error(data.error || "Failed to update resource.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading resources...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Resource Management</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Resource Details</h2>
        <div className="space-y-4">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold capitalize">
                  {resource.type}
                </h3>
                <div className="flex gap-2">
                  {editingId === resource.id ? (
                    <button
                      onClick={() => handleSave(resource.id)}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                    >
                      <Save size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(resource.id)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                      <Edit size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(resource.id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {editingId === resource.id ? (
                <div className="mt-4 space-y-2">
                  <input
                    type="number"
                    value={editedData.cost_per_unit}
                    onChange={(e) =>
                      setEditedData({ ...editedData, cost_per_unit: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Cost per unit"
                  />
                  <input
                    type="text"
                    value={editedData.min_requirement_ratio}
                    onChange={(e) =>
                      setEditedData({ ...editedData, min_requirement_ratio: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Min requirement ratio"
                  />
                  <textarea
                    value={editedData.description}
                    onChange={(e) =>
                      setEditedData({ ...editedData, description: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Description"
                  />
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  <p>
                    <span className="font-semibold">Cost per unit:</span> ₹
                    {resource.cost_per_unit}
                  </p>
                  <p>
                    <span className="font-semibold">Min requirement ratio:</span>{" "}
                    {resource.min_requirement_ratio}
                  </p>
                  <p>
                    <span className="font-semibold">Description:</span>{" "}
                    {resource.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceManagement;