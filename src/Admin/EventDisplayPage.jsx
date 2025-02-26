import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, X } from 'lucide-react';

const EventDisplayPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventName, setSelectedEventName] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);
  
  

  const fetchEvents = async () => {
    try {
      const response = await fetch('https://adminmahaspice.in/ms3/get_events.php');
      
      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      // Attempt to parse JSON with better error handling
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON, got: ${text}`);
      }
  
      const data = await response.json();
      
      // Additional validation
      if (!Array.isArray(data)) {
        throw new Error('Received data is not an array');
      }
  
      setEvents(data);
    } catch (error) {
      console.error('Detailed Error fetching events:', error);
      alert(`Failed to fetch events: ${error.message}`);
    }
  };

  // Extract unique event names (case-insensitive)
  const uniqueEventNames = [...new Set(
    events.map(event => event.event_name.toLowerCase())
  )].sort();

  const handleEventNameSelect = (eventName) => {
    setSelectedEventName(eventName);
    // Filter events based on the selected event name (case-insensitive)
    const filtered = events.filter(event => 
      event.event_name.toLowerCase() === eventName
    );
    setFilteredEvents(filtered);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`https://adminmahaspice.in/ms3/delete_event.php?id=${eventId}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        
        console.log(result); // Debug the result
        
        if (result.success) {
          fetchEvents(); // Refresh the events list
          alert('Event deleted successfully');
        } else {
          alert(result.error || 'Failed to delete event');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the event');
      }
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  // Function to get the original case of the first occurrence of the event name
  const getOriginalEventName = (lowercaseName) => {
    return events.find(event => event.event_name.toLowerCase() === lowercaseName)?.event_name || lowercaseName;
  };

  useEffect(() => {
    if (uniqueEventNames.length > 0 && !selectedEventName) {
      setSelectedEventName(uniqueEventNames[0]);
      handleEventNameSelect(uniqueEventNames[0]);
    }
  }, [uniqueEventNames]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Event Names</h1>
      
      {/* Event Name Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {uniqueEventNames.map((eventName) => (
          <button
            key={eventName}
            onClick={() => handleEventNameSelect(eventName)}
            className={`
              px-4 py-2 rounded-lg transition-all capitalize
              ${selectedEventName === eventName 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}
            `}
          >
            {getOriginalEventName(eventName)}
          </button>
        ))}
      </div>

      {/* Event Cards */}
      {selectedEventName && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
            {getOriginalEventName(selectedEventName)} Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div 
            //   onClick={() => window.location.href = `/admineventedit/${event.event_id}`}
                key={event.event_id} 
                className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105"
              >
                {/* Image Carousel */}
                <div className="relative h-72 overflow-hidden">
                  {event.event_file_path && (
                    <img 
                      src={`https://adminmahaspice.in/ms3/${event.event_file_path.split(',')[0]}`} 
                      alt={event.event_category}
                      className="w-full object-cover"
                    />
                  )}
                </div>
                
                <div className="p-4">
                  <h1 className="text-2xl text-black mb-2 text-bold text-center">{event.event_category}</h1>
                  <p className="text-gray-600 mb-4">{event.event_description}</p>
                  
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <p className="text-gray-600 font-bold">Veg starting from just ₹{event.event_veg_price}</p>
                      <p className="text-gray-600 font-bold">Non-Veg starting from just ₹{event.event_nonveg_price}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleViewDetails(event)}
                      className="text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      <Eye className="mr-2" /> View Details
                    </button>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.location.href = `/admineventedit/${event.event_id}`}
                        className="text-green-500 hover:text-green-700"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => handleDelete(event.event_id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedEvent.event_name}</h2>
              <button 
                onClick={closeModal}
                className="text-red-500 hover:text-red-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-semibold">Category</p>
                <p>{selectedEvent.event_category}</p>
              </div>
              <div>
                <p className="font-semibold">Prices</p>
                <p className="text-grey-600">Veg starting from: ₹{selectedEvent.event_veg_price}</p>
                <p className="text-red-600">Non-Veg: ₹{selectedEvent.event_nonveg_price}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="font-semibold">Description</p>
              <p>{selectedEvent.event_description}</p>
            </div>
            
            <div>
              <p className="font-semibold mb-2">Images</p>
              <div className="grid grid-cols-3 gap-4">
                {selectedEvent.event_file_path.split(',').map((imagePath, index) => (
                  <img 
                    key={index}
                    src={`https://adminmahaspice.in/ms3/${imagePath}`} 
                    alt={`Event Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDisplayPage;