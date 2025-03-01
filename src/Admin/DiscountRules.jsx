import React, { useEffect, useState } from "react";
import { Edit, Save, Trash, Plus } from "lucide-react";

const DiscountRulesManager = () => {
  const [discountRules, setDiscountRules] = useState([]);
  const [editingRule, setEditingRule] = useState(null);
  const [newRule, setNewRule] = useState({ people_count: "", discount_amount: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchDiscountRules();
  }, []);

  const fetchDiscountRules = async () => {
    try {
      const response = await fetch("https://adminmahaspice.in/ms3/fetch_discount_rules.php");
      const data = await response.json();
      
      // Convert data to include an ID if it doesn't already have one
      const rulesWithIds = data.map((rule, index) => ({
        ...rule,
        id: rule.id || rule.people_count // Use existing ID or people_count as fallback
      }));
      
      setDiscountRules(rulesWithIds);
    } catch (error) {
      console.error("Error fetching discount rules:", error);
    }
  };

  const handleEdit = (rule) => {
    setEditingRule({ ...rule });
  };

  const handleSave = async () => {
    if (!editingRule) return;
    
    try {
      // Create request body with ID for the backend
      const requestBody = {
        id: editingRule.id || editingRule.people_count,
        people_count: editingRule.people_count,
        discount_amount: editingRule.discount_amount
      };
      
      console.log("Sending update request with:", requestBody);
      
      const response = await fetch("https://adminmahaspice.in/ms3/update_discount_rule.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      const result = await response.json();
      console.log("Update response:", result);
      
      if (response.ok) {
        setEditingRule(null);
        fetchDiscountRules();
      } else {
        alert("Failed to update rule: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating discount rule:", error);
      alert("Error updating rule. Check console for details.");
    }
  };

  const handleCancel = () => {
    setEditingRule(null);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this discount rule?")) {
      try {
        const response = await fetch(`https://adminmahaspice.in/ms3/delete_discount_rule.php?id=${id}`);
        const result = await response.json();
        
        if (response.ok) {
          fetchDiscountRules();
        } else {
          alert("Failed to delete rule: " + (result.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Error deleting discount rule:", error);
        alert("Error deleting rule. Check console for details.");
      }
    }
  };

  const handleAddRule = async () => {
    if (!newRule.people_count || !newRule.discount_amount) {
      alert("Please fill in both fields");
      return;
    }
    
    try {
      const response = await fetch("https://adminmahaspice.in/ms3/add_discount_rule.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRule),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setNewRule({ people_count: "", discount_amount: "" });
        setShowAddForm(false);
        fetchDiscountRules();
      } else {
        alert("Failed to add rule: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding discount rule:", error);
      alert("Error adding rule. Check console for details.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Discount Rules</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
        >
          <Plus size={16} className="mr-1" /> Add Rule
        </button>
      </div>
      
      {showAddForm && (
        <div className="mb-4 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Add New Rule</h3>
          <div className="flex gap-4 mb-2">
            <div>
              <label className="block text-sm mb-1">People Count</label>
              <input
                type="number"
                value={newRule.people_count}
                onChange={(e) => setNewRule({ ...newRule, people_count: e.target.value })}
                className="border p-2 rounded w-full"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Discount Amount</label>
              <input
                type="number"
                value={newRule.discount_amount}
                onChange={(e) => setNewRule({ ...newRule, discount_amount: e.target.value })}
                className="border p-2 rounded w-full"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleAddRule}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button 
              onClick={() => setShowAddForm(false)}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">People Count</th>
            <th className="p-2 text-left">Discount Amount</th>
            <th className="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {discountRules.map((rule) => (
            <tr key={rule.id || rule.people_count} className="border-b">
              <td className="p-2">
                {editingRule && (editingRule.id === rule.id || editingRule.people_count === rule.people_count) ? (
                  <input
                    type="number"
                    value={editingRule.people_count}
                    onChange={(e) =>
                      setEditingRule({ ...editingRule, people_count: e.target.value })
                    }
                    className="border p-1 rounded w-full"
                    min="1"
                  />
                ) : (
                  rule.people_count
                )}
              </td>
              <td className="p-2">
                {editingRule && (editingRule.id === rule.id || editingRule.people_count === rule.people_count) ? (
                  <input
                    type="number"
                    value={editingRule.discount_amount}
                    onChange={(e) =>
                      setEditingRule({ ...editingRule, discount_amount: e.target.value })
                    }
                    className="border p-1 rounded w-full"
                    min="0"
                    step="0.01"
                  />
                ) : (
                  rule.discount_amount
                )}
              </td>
              <td className="p-2 text-right">
                {editingRule && (editingRule.id === rule.id || editingRule.people_count === rule.people_count) ? (
                  <>
                    <button onClick={handleSave} className="text-green-600 mr-2">
                      <Save size={16} />
                    </button>
                    <button onClick={handleCancel} className="text-gray-600">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(rule)} className="text-blue-600 mr-2">
                    <Edit size={16} />
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(rule.id || rule.people_count)} 
                  className="text-red-600 ml-2"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiscountRulesManager;