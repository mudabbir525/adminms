import React, { useState, useEffect } from "react";
import {
    Upload,
    DollarSign,
    Utensils,
    Check,
    AlertCircle,
    Loader2,
} from "lucide-react";

const AddSupHomeItems = () => {
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        category_type: "",
        veg_non: "",
        image: null,
    });
    const [preview, setPreview] = useState("");
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                "https://adminmahaspice.in/ms3/getSupHomeCategory.php"
            );
            const data = await response.json();
            if (data.success) {
                setCategories(data.categories);
            } else {
                showMessage(data.message || "Failed to load categories.", "error");
            }
        } catch (error) {
            showMessage("Failed to fetch categories. Please try again.", "error");
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 5000); // Clear message after 5 seconds
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "price") {
            const formattedValue = value.replace(/[^0-9.]/g, "");
            if (formattedValue.split(".").length <= 2) {
                setFormData((prev) => ({ ...prev, [name]: formattedValue }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showMessage("Image size should be less than 5MB", "error");
                return;
            }
            setFormData((prev) => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form fields
        if (
            !formData.title.trim() ||
            !formData.price ||
            !formData.category_type ||
            !formData.veg_non ||
            !formData.image
        ) {
            showMessage("Please fill all required fields", "error");
            return;
        }

        setLoading(true);
        const form = new FormData();
        Object.keys(formData).forEach((key) => {
            form.append(key, formData[key]);
        });

        try {
            const response = await fetch(
                "https://adminmahaspice.in/ms3/addSupHomeItem.php",
                {
                    method: "POST",
                    body: form,
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseText = await response.text();

            // Handle empty response
            if (!responseText.trim()) {
                throw new Error("Server returned empty response");
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error("Response parsing error:", responseText);
                throw new Error("Invalid server response format");
            }

            if (data.success) {
                showMessage("Item added successfully!", "success");
                // Reset form
                setFormData({
                    title: "",
                    price: "",
                    category_type: "",
                    veg_non: "",
                    image: null,
                });
                setPreview("");
            } else {
                throw new Error(data.message || "Failed to add item");
            }
        } catch (error) {
            console.error("Submit error:", error);
            showMessage(
                error.message || "Failed to add item. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
                            Add New Superfast Item
                        </h2>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Alert Message */}
                        {message.text && (
                            <div
                                className={`mb-6 p-4 rounded-lg flex items-center justify-center space-x-2
                               ${message.type === "success"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : "bg-rose-50 text-rose-700 border border-rose-200"
                                    }`}
                            >
                                {message.type === "success" ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5" />
                                )}
                                <p className="text-sm font-medium">{message.text}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title Input */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                                    placeholder="Enter item title"
                                />
                            </div>

                            {/* Price Input */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Price (₹)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                                        placeholder="Enter price"
                                    />
                                </div>
                            </div>

                            {/* Category Select */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Category
                                </label>
                                <select
                                    name="category_type"
                                    value={formData.category_type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.category_type}>
                                            {category.category_type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Veg/Non-Veg Select */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Veg/Non-Veg
                                </label>
                                <div className="relative">
                                    <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        name="veg_non"
                                        value={formData.veg_non}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                                    >
                                        <option value="">Select type</option>
                                        <option value="veg">Veg</option>
                                        <option value="non-veg">Non-Veg</option>
                                    </select>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Image
                                </label>
                                <div
                                    onClick={() => document.getElementById("imageUpload").click()}
                                    className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors group"
                                >
                                    <div className="text-center">
                                        <input
                                            type="file"
                                            id="imageUpload"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        <p className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors">
                                            Click to upload image
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">Max size: 5MB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Image Preview */}
                            {preview && (
                                <div className="mt-4 p-2 bg-gray-50 rounded-lg border border-gray-200">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full max-h-48 object-contain rounded-lg"
                                    />
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full px-6 py-3 rounded-lg text-white font-semibold text-base
                                   flex items-center justify-center space-x-2
                                   ${loading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transform transition-all duration-200"
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>Add Item</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSupHomeItems;
