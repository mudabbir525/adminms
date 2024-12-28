import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";  // Import Trash2 for delete icon

const AdminMenuPage = () => {
    const { eventType, serviceType } = useParams();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/getgscd.php');
            const data = await response.json();

            if (data.status === "success") {
                setCategories(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (imageUrl) => {
        if (imageUrl && !imageUrl.startsWith('http')) {
            return `https://mahaspice.desoftimp.com/ms3/${imageUrl}`;
        }
        return imageUrl;
    };

    const handleCategoryClick = (categoryName) => {
        const urlFriendlyName = categoryName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-]/g, '');
        navigate(`/events/${eventType}/${serviceType}/Menu/${urlFriendlyName}`);
    };

    const handleEditClick = (categoryId) => {
        navigate(`/editmenu/${categoryId}`);
    };

    const handleDeleteClick = (categoryId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this category?");
        if (confirmDelete) {
            deleteCategory(categoryId);
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            const response = await fetch(`https://mahaspice.desoftimp.com/ms3/deletegscd.php?id=${categoryId}`, {
                method: "POST",
            });

            const data = await response.json();
            if (data.status === "success") {
                setCategories(categories.filter((category) => category.id !== categoryId));
            } else {
                alert("Failed to delete category");
            }
        } catch (err) {
            alert("Error deleting category");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-center">
                    <p className="text-xl">{error}</p>
                    <button
                        onClick={fetchCategories}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 py-10 px-5 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Menu Categories
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => handleEditClick(category.id)}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                            <img
                                src={getImageUrl(category.image_address)}
                                alt={category.menu_type}
                                className="w-full object-cover transition-transform duration-300"
                            />
                            <div className="p-4 flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{category.menu_type}</h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditClick(category.id)}
                                        className="text-blue-500 hover:text-blue-700 transition duration-300"
                                    >
                                        <Edit size={24} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(category.id)}
                                        className="text-red-500 hover:text-red-700 transition duration-300"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminMenuPage;
