import React, { useState, useEffect } from 'react';
import { Save, ChevronRight, Loader2, AlertCircle, Filter, RotateCcw } from 'lucide-react';

const FoodSupPackagesDisplay = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({
        cp_type: null,
        meal_time: null,
        veg_non_veg: null,
    });
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);
    const [filterStep, setFilterStep] = useState(1);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/cptypes.php');
            const data = await response.json();
            setPackages(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load packages');
            setLoading(false);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setSelectedFilters(prev => ({ ...prev, [filterType]: value }));
        setFilterStep(prev => prev + 1);
        setBreadcrumbs(prev => [...prev, { step: filterStep, filterType, value }]);
    };

    const handleBreadcrumbClick = (step) => {
        setFilterStep(step);
        const updatedFilters = { ...selectedFilters };
        const updatedBreadcrumbs = breadcrumbs.slice(0, step - 1);
        Object.keys(updatedFilters).forEach((key, index) => {
            if (index >= step - 1) {
                updatedFilters[key] = null;
            }
        });
        setSelectedFilters(updatedFilters);
        setBreadcrumbs(updatedBreadcrumbs);
        setIsSaveEnabled(false);
    };

    const resetFilters = () => {
        setSelectedFilters({
            cp_type: null,
            meal_time: null,
            veg_non_veg: null,
        });
        setFilterStep(1);
        setBreadcrumbs([]);
        setIsSaveEnabled(false);
    };

    const filteredPackages = packages.filter(pkg => {
        return (
            pkg.is_superfast === 'Yes' &&
            (!selectedFilters.cp_type || pkg.cp_type === selectedFilters.cp_type) &&
            (!selectedFilters.meal_time || pkg.meal_time === selectedFilters.meal_time) &&
            (!selectedFilters.veg_non_veg || pkg.veg_non_veg === selectedFilters.veg_non_veg)
        );
    });

    const handlePositionChange = (id, newPosition) => {
        newPosition = parseInt(newPosition);
        const updatedPackage = packages.find(pkg => pkg.id === id);
        if (!updatedPackage) return;

        const newPackages = [...packages];
        const groupPackages = newPackages.filter(pkg =>
            pkg.is_superfast === updatedPackage.is_superfast &&
            pkg.cp_type === updatedPackage.cp_type &&
            pkg.meal_time === updatedPackage.meal_time &&
            pkg.veg_non_veg === updatedPackage.veg_non_veg
        );

        groupPackages.sort((a, b) => a.position - b.position);
        const updatedIndex = groupPackages.findIndex(pkg => pkg.id === id);
        if (updatedIndex === -1) return;

        const [removedPackage] = groupPackages.splice(updatedIndex, 1);
        groupPackages.splice(newPosition - 1, 0, removedPackage);

        groupPackages.forEach((pkg, index) => {
            pkg.position = index + 1;
        });

        const updatedPackages = newPackages.map(pkg => {
            const updatedPkg = groupPackages.find(gp => gp.id === pkg.id);
            return updatedPkg ? updatedPkg : pkg;
        });

        setPackages(updatedPackages);
        setIsSaveEnabled(true);
    };

    const handleSave = async () => {
        const positions = filteredPackages.map(pkg => pkg.position);
        const hasDuplicates = new Set(positions).size !== positions.length;

        if (hasDuplicates) {
            alert('Error: Two or more packages have the same position. Please ensure all positions are unique.');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('https://mahaspice.desoftimp.com/ms3/update_positions.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(packages),
            });
            const data = await response.json();
            if (data.success) {
                alert('Positions updated successfully!');
                setIsSaveEnabled(false);
            } else {
                alert('Failed to update positions.');
            }
        } catch (err) {
            alert('Failed to update positions.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                <p className="text-gray-600">Loading packages...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    const uniqueCpTypes = [...new Set(packages.filter(pkg => pkg.is_superfast === 'Yes').map(pkg => pkg.cp_type))];
    const uniqueMealTimes = [...new Set(packages.filter(pkg => pkg.is_superfast === 'Yes').map(pkg => pkg.meal_time))];
    const uniqueVegNonVeg = [...new Set(packages.filter(pkg => pkg.is_superfast === 'Yes').map(pkg => pkg.veg_non_veg))];

    const breadcrumbLabels = {
        1: `CP Type: ${selectedFilters.cp_type}`,
        2: `Meal Time: ${selectedFilters.meal_time}`,
        3: `Veg/Non-Veg: ${selectedFilters.veg_non_veg}`,
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Superfast Food Packages</h1>
                        <div className="flex items-center space-x-2">
                            <Filter className="w-5 h-5 text-blue-500" />
                            <span className="text-gray-600">Step {filterStep} of 3</span>
                        </div>
                    </div>

                    {breadcrumbs.length > 0 && (
                        <div className="flex items-center gap-2 mb-8 bg-gray-50 p-4 rounded-lg">
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    <button
                                        onClick={() => handleBreadcrumbClick(crumb.step)}
                                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                    >
                                        {breadcrumbLabels[crumb.step]}
                                    </button>
                                    {index < breadcrumbs.length - 1 && (
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    {filterStep === 1 && (
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Select CP Type</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {uniqueCpTypes.map((value, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleFilterChange('cp_type', value)}
                                        className={`p-4 rounded-lg transition-all ${selectedFilters.cp_type === value
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {filterStep === 2 && (
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Select Meal Time</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {uniqueMealTimes.map((value, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleFilterChange('meal_time', value)}
                                        className={`p-4 rounded-lg transition-all ${selectedFilters.meal_time === value
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {filterStep === 3 && (
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Select Veg or Non-Veg</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {uniqueVegNonVeg.map((value, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleFilterChange('veg_non_veg', value)}
                                        className={`p-4 rounded-lg transition-all ${selectedFilters.veg_non_veg === value
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {filterStep > 3 && (
                        <>
                            <div className="overflow-x-auto bg-white rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal Time</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredPackages
                                            .sort((a, b) => a.position - b.position)
                                            .map((item) => {
                                                const groupPackages = filteredPackages.filter(pkg =>
                                                    pkg.is_superfast === item.is_superfast &&
                                                    pkg.cp_type === item.cp_type &&
                                                    pkg.meal_time === item.meal_time &&
                                                    pkg.veg_non_veg === item.veg_non_veg
                                                );
                                                const positionOptions = Array.from(
                                                    { length: groupPackages.length },
                                                    (_, i) => i + 1
                                                );

                                                return (
                                                    <tr key={item.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.cp_name}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">{item.description}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.meal_time}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                Superfast
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            ₹{parseFloat(item.price).toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <select
                                                                value={item.position}
                                                                onChange={(e) => handlePositionChange(item.id, parseInt(e.target.value))}
                                                                className="block w-20 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                            >
                                                                {positionOptions.map((pos) => (
                                                                    <option key={pos} value={pos}>
                                                                        {pos}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-8 flex items-center justify-between">
                                <button
                                    onClick={handleSave}
                                    disabled={!isSaveEnabled || saving}
                                    className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${isSaveEnabled && !saving
                                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {saving ? (
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-5 h-5 mr-2" />
                                    )}
                                    {saving ? 'Saving...' : 'Save Positions'}
                                </button>

                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <RotateCcw className="w-5 h-5 mr-2" />
                                    Reset Filters
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodSupPackagesDisplay;