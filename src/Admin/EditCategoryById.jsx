import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const EditCategoryById = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categoryName, setCategoryName] = useState('');
    const [categoryType, setCategoryType] = useState('');
    const [menuTypes, setMenuTypes] = useState([]);
    const [selectedMenuTypes, setSelectedMenuTypes] = useState([]);
    const [menuLimits, setMenuLimits] = useState({});
    const [menuPositions, setMenuPositions] = useState({});
    const [currentCategory, setCurrentCategory] = useState(null);

    useEffect(() => {
        const fetchMenuTypes = axios.get('https://adminmahaspice.in/ms3/getMenuTypes.php');
        const fetchCategoryDetails = axios.get(`https://adminmahaspice.in/ms3/getcategorybyid.php?id=${id}`);

        Promise.all([fetchMenuTypes, fetchCategoryDetails])
            .then(([menuTypesResponse, categoryResponse]) => {
                if (menuTypesResponse.data && Array.isArray(menuTypesResponse.data)) {
                    setMenuTypes(menuTypesResponse.data);
                } else if (menuTypesResponse.data && menuTypesResponse.data.menu_types) {
                    setMenuTypes(menuTypesResponse.data.menu_types);
                }

                if (categoryResponse.data) {
                    setCurrentCategory(categoryResponse.data);
                    
                    const initialSelectedTypes = categoryResponse.data.map(cat => cat.menu_type);
                    const initialLimits = {};
                    const initialPositions = {};
                    
                    categoryResponse.data.forEach(cat => {
                        initialLimits[cat.menu_type] = cat.category_limit;
                        initialPositions[cat.menu_type] = cat.position;
                    });

                    setSelectedMenuTypes(initialSelectedTypes);
                    setMenuLimits(initialLimits);
                    setMenuPositions(initialPositions);
                    setCategoryName(categoryResponse.data[0].category_name);
                    setCategoryType(categoryResponse.data[0].category_type || '');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('Failed to fetch category details');
            });
    }, [id]);

    const handleCheckboxChange = (menuType) => {
        const type = typeof menuType === 'object' ? menuType.menu_type : menuType;

        if (selectedMenuTypes.includes(type)) {
            setSelectedMenuTypes(selectedMenuTypes.filter(t => t !== type));
            const updatedLimits = { ...menuLimits };
            const updatedPositions = { ...menuPositions };
            delete updatedLimits[type];
            delete updatedPositions[type];
            setMenuLimits(updatedLimits);
            setMenuPositions(updatedPositions);
        } else {
            setSelectedMenuTypes([...selectedMenuTypes, type]);
        }
    };

    const handleLimitChange = (menuType, limit) => {
        setMenuLimits({
            ...menuLimits,
            [menuType]: limit
        });
    };

    const handlePositionChange = (menuType, position) => {
        setMenuPositions({
            ...menuPositions,
            [menuType]: position
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!categoryName || selectedMenuTypes.length === 0 || !categoryType) {
            alert('Please fill all fields');
            return;
        }

        const formData = {
            category_id: id,
            category_name: categoryName,
            category_type: categoryType,
            menu_type: selectedMenuTypes,
            category_limits: menuLimits,
            positions: menuPositions
        };

        axios.post('https://adminmahaspice.in/ms3/updatecategory.php', formData)
            .then(response => {
                alert(response.data.message);
                navigate('/admincategory');
            })
            .catch(error => {
                console.error('Error updating category:', error);
                alert('Failed to update category');
            });
    };

    const handleGoBack = () => {
        window.location.href='/admincategory'
    };

    if (!currentCategory) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex justify-center items-center h-full bg-gray-100">
            <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
                <div className="flex items-center mb-4">
                    <button 
                        type="button" 
                        onClick={handleGoBack} 
                        className="mr-4 hover:bg-gray-100 rounded-full p-2"
                    >
                        <ArrowLeft className="text-gray-700" />
                    </button>
                    <h2 className="text-2xl font-bold">Edit Category</h2>
                </div>

                <div className="mb-4">
                    <label htmlFor="category_name" className="block text-gray-700 font-bold mb-2">
                        Category Name
                    </label>
                    <input
                        type="text"
                        id="category_name"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="category_type" className="block text-gray-700 font-bold mb-2">
                        Category Type
                    </label>
                    <select
                        id="category_type"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={categoryType}
                        onChange={(e) => setCategoryType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="veg">Vegetarian</option>
                        <option value="nonveg">Non-Vegetarian</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Menu Types</label>
                    {menuTypes.length > 0 ? (
                        menuTypes.map((menuType, index) => {
                            const type = menuType.menu_type || menuType;
                            return (
                                <div key={index} className="mb-4 p-4 bg-gray-50 rounded">
                                    <div className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            id={`menuType-${index}`}
                                            className="mr-2"
                                            value={type}
                                            checked={selectedMenuTypes.includes(type)}
                                            onChange={() => handleCheckboxChange(menuType)}
                                        />
                                        <label htmlFor={`menuType-${index}`} className="font-medium">
                                            {type}
                                        </label>
                                    </div>

                                    {selectedMenuTypes.includes(type) && (
                                        <div className="grid grid-cols-2 gap-4 ml-6">
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">
                                                    Limit
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="Limit"
                                                    value={menuLimits[type] || ''}
                                                    onChange={(e) => handleLimitChange(type, e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    min="1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">
                                                    Position
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="Position"
                                                    value={menuPositions[type] || ''}
                                                    onChange={(e) => handlePositionChange(type, e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    min="1"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-500">No menu types available</p>
                    )}
                </div>

                <button 
                    type="submit" 
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                >
                    Update Category
                </button>
            </form>
        </div>
    );
};

export default EditCategoryById;