import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSupCps = () => {
    const [cpTypes, setCpTypes] = useState([]);
    const [formData, setFormData] = useState({
        cp_name: '',
        veg_non_veg: 'Veg',
        cp_type: '',
        meal_time: 'Breakfast',
        is_superfast: 'Yes',
        description: '',
        price: '',
        image: null
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Fetch CP Types for dropdown
    useEffect(() => {
        const fetchCPTypes = async () => {
            try {
                const response = await axios.get('https://mahaspice.desoftimp.com/ms3/cps.php');
                setCpTypes(response.data);
            } catch (error) {
                console.error('Error fetching CP Types:', error);
            }
        };
        fetchCPTypes();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.cp_name || !formData.cp_type || !formData.description ||
            !formData.price || !formData.image) {
            setMessage('All fields are required');
            setIsError(true);
            return;
        }

        // Price validation
        if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            setMessage('Price must be a positive number');
            setIsError(true);
            return;
        }

        const formSubmitData = new FormData();
        formSubmitData.append('cp_name', formData.cp_name);
        formSubmitData.append('veg_non_veg', formData.veg_non_veg);
        formSubmitData.append('cp_type', formData.cp_type);
        formSubmitData.append('meal_time', formData.meal_time);
        formSubmitData.append('is_superfast', formData.is_superfast);
        formSubmitData.append('description', formData.description);
        formSubmitData.append('price', formData.price);
        formSubmitData.append('image', formData.image);

        try {
            const response = await axios.post(
                'https://mahaspice.desoftimp.com/ms3/cptypes.php',
                formSubmitData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Reset form and show success message
            setFormData({
                cp_name: '',
                veg_non_veg: 'Veg',
                cp_type: '',
                meal_time: 'Breakfast',
                is_superfast: 'Yes',
                description: '',
                price: '',
                image: null
            });

            // Clear file input
            document.getElementById('image').value = '';

            setMessage('CP Type added successfully');
            setIsError(false);
        } catch (error) {
            setMessage('Error adding CP Type');
            setIsError(true);
            console.error('Error:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Add CP Type</h2>

                {/* CP Name */}
                <div className="mb-4">
                    <label
                        htmlFor="cp_name"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        CP Name
                    </label>
                    <input
                        type="text"
                        id="cp_name"
                        name="cp_name"
                        value={formData.cp_name}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
              leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter CP Name"
                        required
                    />
                </div>

                {/* Veg/Non-Veg Radio */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Type
                    </label>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="veg"
                            name="veg_non_veg"
                            value="Veg"
                            checked={formData.veg_non_veg === 'Veg'}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        <label htmlFor="veg" className="mr-4">Veg</label>
                        <input
                            type="radio"
                            id="non-veg"
                            name="veg_non_veg"
                            value="Non-Veg"
                            checked={formData.veg_non_veg === 'Non-Veg'}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        <label htmlFor="non-veg">Non-Veg</label>
                    </div>
                </div>

                {/* CP Type Dropdown */}
                <div className="mb-4">
                    <label
                        htmlFor="cp_type"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        CP Type
                    </label>
                    <select
                        id="cp_type"
                        name="cp_type"
                        value={formData.cp_type}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
              leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select CP Type</option>
                        {cpTypes.map((type) => (
                            <option key={type.cp_type} value={type.cp_type}>
                                {type.cp_type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Meal Time Dropdown */}
                <div className="mb-4">
                    <label
                        htmlFor="meal_time"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Meal Time
                    </label>
                    <select
                        id="meal_time"
                        name="meal_time"
                        value={formData.meal_time}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
              leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                    </select>
                </div>

                {/* Is Superfast */}


                {/* Description */}
                <div className="mb-4">
                    <label
                        htmlFor="description"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                        leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Description"
                        required
                    ></textarea>
                </div>

                {/* Price */}
                <div className="mb-4">
                    <label
                        htmlFor="price"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                        leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Price"
                        required
                    />
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                    <label
                        htmlFor="image"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
              leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Add CP Type
                    </button>
                </div>

                {/* Message Display */}
                {message && (
                    <p
                        className={`mt-4 text-center text-sm font-bold ${isError ? 'text-red-500' : 'text-green-500'
                            }`}
                    >
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default AddSupCps;
