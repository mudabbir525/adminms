import React, { useState } from 'react';
import axios from 'axios';

const AddMealBox = () => {
    const [formData, setFormData] = useState({
        package_type: '3CP',
        meal_type: 'veg',
        name: '',
        image_url: '',
        items: [''],
        price: '',
        rating: '',
        preparation_time: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleItemChange = (index, value) => {
        const newItems = [...formData.items];
        newItems[index] = value;
        setFormData(prev => ({
            ...prev,
            items: newItems
        }));
    };

    const addItemField = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, '']
        }));
    };

    const removeItemField = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            items: newItems
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            axios.post('https://mahaspice.desoftimp.com/ms3/addbox.php', data, {
    headers: {
        'Content-Type': 'application/json'
    }
});

            
            if (response.data.success) {
                alert('Meal box added successfully!');
                setFormData({
                    package_type: '3CP',
                    meal_type: 'veg',
                    name: '',
                    image_url: '',
                    items: [''],
                    price: '',
                    rating: '',
                    preparation_time: ''
                });
            } else {
                alert('Error: ' + response.data.message);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error submitting meal box');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Add New Meal Box</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Package Type</label>
                    <select 
                        name="package_type"
                        value={formData.package_type}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="3CP">3CP</option>
                        <option value="5CP">5CP</option>
                        <option value="8CP">8CP</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Meal Type</label>
                    <select 
                        name="meal_type"
                        value={formData.meal_type}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="veg">Vegetarian</option>
                        <option value="non_veg">Non-Vegetarian</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Name</label>
                    <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Image URL</label>
                    <input 
                        type="url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Items</label>
                    {formData.items.map((item, index) => (
                        <div key={index} className="flex mb-2">
                            <input 
                                type="text"
                                value={item}
                                onChange={(e) => handleItemChange(index, e.target.value)}
                                className="w-full p-2 border rounded mr-2"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => removeItemField(index)}
                                className="bg-red-500 text-white px-3 rounded"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button 
                        type="button"
                        onClick={addItemField}
                        className="bg-green-500 text-white px-3 py-2 rounded mt-2"
                    >
                        Add Item
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Price</label>
                    <input 
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Rating</label>
                    <input 
                        type="number"
                        name="rating"
                        step="0.1"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Preparation Time (minutes)</label>
                    <input 
                        type="number"
                        name="preparation_time"
                        value={formData.preparation_time}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <button 
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add Meal Box
                </button>
            </form>
        </div>
    );
};

export default AddMealBox;