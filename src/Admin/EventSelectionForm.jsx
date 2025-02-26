import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventSelectionForm = ({ onEventSelect, initialValues }) => {
    const [events, setEvents] = useState([]);
    const [uniqueEventNames, setUniqueEventNames] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(initialValues?.event_name || '');
    const [selectedCategory, setSelectedCategory] = useState(initialValues?.event_category || '');
    const [error, setError] = useState('');
    
    const BASE_URL = 'https://adminmahaspice.in/ms3/';

    // Initial fetch of events
    useEffect(() => {
        fetchFilteredEvents();
    }, []);

    // Set initial values if provided
    useEffect(() => {
        if (initialValues) {
            setSelectedEvent(initialValues.event_name || '');
            setSelectedCategory(initialValues.event_category || '');
        }
    }, [initialValues]);

    const fetchFilteredEvents = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get_filtered_events.php`);
            if (response.data.success) {
                setEvents(response.data.events);
                const uniqueNames = [...new Set(response.data.events.map(event => event.event_name))];
                setUniqueEventNames(uniqueNames);
            } else {
                setError(response.data.message || 'Failed to fetch events');
            }
        } catch (err) {
            setError('Error fetching events data');
            console.error('Error:', err);
        }
    };

    // Update categories when event changes
    useEffect(() => {
        if (selectedEvent) {
            const eventCategories = events
                .filter(event => event.event_name === selectedEvent)
                .map(event => event.event_category);
            setCategories(eventCategories);
            if (!eventCategories.includes(selectedCategory)) {
                setSelectedCategory('');
                onEventSelect({ event_name: selectedEvent, event_category: '' });
            }
        } else {
            setCategories([]);
            setSelectedCategory('');
            onEventSelect({ event_name: '', event_category: '' });
        }
    }, [selectedEvent, events]);

    const handleEventChange = (e) => {
        const eventName = e.target.value;
        setSelectedEvent(eventName);
        setSelectedCategory('');
        onEventSelect({ event_name: eventName, event_category: '' });
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        onEventSelect({ event_name: selectedEvent, event_category: category });
    };

    return (
        // <div className="space-y-4">
        //     {error && (
        //         <div className="text-red-600 bg-red-50 p-2 rounded">
        //             {error}
        //         </div>
        //     )}
            
        //     <div>
        //         <label className="block text-sm font-medium text-gray-700 mb-1">
        //             Event
        //         </label>
        //         <select
        //             value={selectedEvent}
        //             onChange={handleEventChange}
        //             className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
        //             required
        //         >
        //             <option value="">Select Event</option>
        //             {uniqueEventNames.map((eventName, index) => (
        //                 <option key={index} value={eventName}>
        //                     {eventName}
        //                 </option>
        //             ))}
        //         </select>
        //     </div>

        //     {selectedEvent && (
        //         <div>
        //             <label className="block text-sm font-medium text-gray-700 mb-1">
        //                 Event Category
        //             </label>
        //             <select
        //                 value={selectedCategory}
        //                 onChange={handleCategoryChange}
        //                 className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
        //                 required
        //             >
        //                 <option value="">Select Category</option>
        //                 {categories.map((category, index) => (
        //                     <option key={index} value={category}>
        //                         {category}
        //                     </option>
        //                 ))}
        //             </select>
        //         </div>
        //     )}
        // </div>
        <div></div>
    );
};

export default EventSelectionForm;