import React, { useState, useEffect, useCallback } from 'react';
import { Search, User, Mail, Phone, Users, ArrowUpDown } from 'lucide-react';

const EnquiryDisplay = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'

  const fetchEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://mahaspice.desoftimp.com/ms3/design/get_enquiry.php?search=${searchTerm}&sort=${sortOrder}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setEnquiries(data.data);
      } else {
        setError('Failed to fetch enquiries');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, sortOrder]);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEnquiries();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, sortOrder, fetchEnquiries]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(current => current === 'newest' ? 'oldest' : 'newest');
  };

  const openPDF = (filePath) => {
    window.open(`https://mahaspice.desoftimp.com/ms3/design/pdfs/${filePath}`, '_blank');
  };

  if (loading && enquiries.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Search and Sort Controls */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        </div>
        
        <button
          onClick={toggleSortOrder}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowUpDown size={16} />
          <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
        </button>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Enquiries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enquiries.map((enquiry) => (
          <div
            key={enquiry.id}
            onClick={() => openPDF(enquiry.file_path)}
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-xl"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="text-blue-500" size={20} />
                <span className="font-medium">{enquiry.name}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-500" size={20} />
                <span className="text-gray-600">{enquiry.email}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-500" size={20} />
                <span className="text-gray-600">{enquiry.phone}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="text-blue-500" size={20} />
                <span className="text-gray-600">{enquiry.guests} Guests</span>
              </div>
              
              <div className="text-sm text-gray-500 mt-4">
                Delivery Date: {new Date(enquiry.delivery_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {enquiries.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">
          No enquiries found
        </div>
      )}
    </div>
  );
};

export default EnquiryDisplay;