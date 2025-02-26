import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

const DateBlocking = () => {
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({ 
    for: '', 
    reason: '', 
    date: new Date().toISOString().split('T')[0] 
  });
  const [isEditing, setIsEditing] = useState(false);

  const options = [
    'Superfast Mealbox',
    'Superfast Delivery Box',
    'Superfast Catering',
    'Mealbox',
    'Deliverybox',
    'Catering'
  ];

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('https://adminmahaspice.in/ms3/dateblocking.php');
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `https://adminmahaspice.in/ms3/dateblocking.php?id=${currentRecord.id}`
      : 'https://adminmahaspice.in/ms3/dateblocking.php';

    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentRecord),
      });
      setIsModalOpen(false);
      setCurrentRecord({ 
        for: '', 
        reason: '', 
        date: new Date().toISOString().split('T')[0] 
      });
      setIsEditing(false);
      fetchRecords();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await fetch(`https://adminmahaspice.in/ms3/dateblocking.php?id=${id}`, {
          method: 'DELETE',
        });
        fetchRecords();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (record) => {
    setCurrentRecord({
      ...record,
      date: new Date(record.date).toISOString().split('T')[0]
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tracking System</h1>
        <button
          onClick={() => {
            setCurrentRecord({ 
              for: '', 
              reason: '', 
              date: new Date().toISOString().split('T')[0] 
            });
            setIsEditing(false);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add New
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">For</th>
              <th className="px-6 py-3 text-left">Reason</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{record.id}</td>
                <td className="px-6 py-4">{record.date}</td>
                <td className="px-6 py-4">{record.for}</td>
                <td className="px-6 py-4">{record.reason}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Record' : 'Add New Record'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Date</label>
                <input
                  type="date"
                  value={currentRecord.date}
                  onChange={(e) =>
                    setCurrentRecord({ ...currentRecord, date: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">For</label>
                <select
                  value={currentRecord.for}
                  onChange={(e) =>
                    setCurrentRecord({ ...currentRecord, for: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select option</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Reason</label>
                <input
                  type="text"
                  value={currentRecord.reason || ''}
                  onChange={(e) =>
                    setCurrentRecord({ ...currentRecord, reason: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateBlocking;