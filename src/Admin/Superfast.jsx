import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Upload, X, AlertCircle, CheckCircle } from 'lucide-react';

const SectionSuperfast = () => {
    const [sections, setSections] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const baseUrl = 'https://mahaspice.desoftimp.com/ms3/';
    const [currentSection, setCurrentSection] = useState({
        position: '',
        title: '',
        sub_description: '',
        bullet_points: '',
        img_address: null
    });

    useEffect(() => {
        fetchSections();
    }, []);

    // Toast notification handler
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const fetchSections = async () => {
        try {
            const response = await axios.get(`${baseUrl}get_sections.php`);
            if (response.data.success) {
                setSections(response.data.sections);
            } else {
                throw new Error('Failed to fetch sections');
            }
        } catch (err) {
            showToast('Failed to fetch sections', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentSection(prev => ({
            ...prev,
            [name]: name === 'position' ? parseInt(value) : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                showToast('Image size should be less than 5MB', 'error');
                return;
            }
            setCurrentSection(prev => ({ ...prev, img_address: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData();
        Object.keys(currentSection).forEach(key => {
            formData.append(key, currentSection[key]);
        });

        try {
            const url = editingId
                ? `${baseUrl}update_section.php`
                : `${baseUrl}add_section.php`;

            if (editingId) {
                formData.append('id', editingId);
            }

            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                fetchSections();
                setIsModalOpen(false);
                resetForm();
                showToast(editingId ? 'Section updated successfully' : 'Section added successfully');
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to save section', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this section?')) return;

        try {
            const response = await axios.delete(
                `${baseUrl}delete_section.php`,
                { data: { id } }
            );

            if (response.data.success) {
                fetchSections();
                showToast('Section deleted successfully');
            }
        } catch (err) {
            showToast('Failed to delete section', 'error');
        }
    };

    const handleEdit = (section) => {
        setEditingId(section.id);
        setCurrentSection({
            position: section.position,
            title: section.title,
            sub_description: section.sub_description,
            bullet_points: section.bullet_points,
            img_address: null // Reset image on edit
        });
        setPreviewImage(`${baseUrl}${section.img_address}`);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setCurrentSection({
            position: '',
            title: '',
            sub_description: '',
            bullet_points: '',
            img_address: null
        });
        setPreviewImage('');
    };

    // Toast Component
    const Toast = ({ message, type }) => (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
            {type === 'error' ?
                <AlertCircle className="w-5 h-5 mr-2" /> :
                <CheckCircle className="w-5 h-5 mr-2" />
            }
            {message}
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            {/* Toast Notification */}
            {toast.show && <Toast message={toast.message} type={toast.type} />}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Section Superfast</h2>
                <button
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
                >
                    <Plus className="mr-2" /> Add Section
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map(section => (
                    <div
                        key={section.id}
                        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="relative aspect-video">
                            <img
                                src={`${baseUrl}${section.img_address}`}
                                alt={section.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">{section.title}</h3>
                                    <span className="text-sm text-gray-500">Position: {section.position}</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(section)}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(section.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-2">{section.sub_description}</p>
                            {section.bullet_points && (
                                <div className="text-sm text-gray-500">
                                    {section.bullet_points.split('\n').map((point, i) => (
                                        point && <div key={i} className="flex items-center mb-1">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                                            {point}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Simplified Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Section' : 'Add New Section'}</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Section Image</label>
                                <div className="flex justify-center">
                                    <label className="relative cursor-pointer">
                                        <div className={`w-full aspect-video rounded-lg overflow-hidden ${!previewImage ? 'border-2 border-dashed border-gray-300 bg-gray-50' : ''
                                            }`}>
                                            {previewImage ? (
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="w-full h-40 object-contain"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full p-6">
                                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                    <span className="text-sm text-gray-500">Click to upload image</span>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Two Column Layout for Position and Title */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Position</label>
                                    <input
                                        type="number"
                                        name="position"
                                        value={currentSection.position}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={currentSection.title}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description and Bullet Points */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    name="sub_description"
                                    value={currentSection.sub_description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter section description..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Bullet Points</label>
                                <textarea
                                    name="bullet_points"
                                    value={currentSection.bullet_points}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter bullet points (one per line)..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    {editingId ? 'Update' : 'Add'} Section
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectionSuperfast;