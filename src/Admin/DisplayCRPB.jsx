import React, { useState, useEffect } from 'react';
import { Edit, Trash2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DisplayCRPB = () => {
  const [crpbEntries, setCrpbEntries] = useState([]);
  const navigate = useNavigate();

  const fetchEntries = async () => {
    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/getcrpb.php');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setCrpbEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      const response = await fetch('https://mahaspice.desoftimp.com/ms3/deletecrpb.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });
      const result = await response.json();
      
      if (result.success) {
        setCrpbEntries(crpbEntries.filter(entry => entry.id !== id));
      } else {
        alert('Failed to delete entry');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (entry) => {
    navigate(`/edit-crpb/${entry.id}`, { state: { entry } });
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Sort entries by position in ascending order
  const sortedEntries = crpbEntries.slice().sort((a, b) => a.position - b.position);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">CRPB Entries</h2>
        <button 
          onClick={fetchEntries}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          <RefreshCw size={20} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedEntries.length > 0 ? (
          sortedEntries.map((entry) => (
            <div 
              key={entry.id} 
              className="border rounded-lg shadow-md p-4 flex flex-col hover:shadow-lg transition-shadow duration-300"
            >
              <img 
                src={`https://mahaspice.desoftimp.com/ms3/${entry.img_address}`} 
                alt={entry.name} 
                className="w-full h-48 object-contain rounded-t-lg mb-4"
              />
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2">{entry.name}</h3>
                <p className="text-gray-600">Position: {entry.position}</p>
                
              </div>
              <div className="flex justify-between mt-4">
                <button 
                  onClick={() => handleEdit(entry)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(entry.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No entries found.</p>
        )}
      </div>
    </div>
  );
};

export default DisplayCRPB;
