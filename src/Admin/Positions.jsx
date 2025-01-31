import React, { useState, useEffect } from 'react';
import { Save, ChevronRight } from 'lucide-react';

const FoodPackagesDisplay = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    is_superfast: null,
    cp_type: null,
    meal_time: null,
    veg_non_veg: null,
  });
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [filterStep, setFilterStep] = useState(1); // Track the current filter step
  const [breadcrumbs, setBreadcrumbs] = useState([]); // Track breadcrumbs

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
    setFilterStep(prev => prev + 1); // Move to the next filter step
    setBreadcrumbs(prev => [...prev, { step: filterStep, filterType, value }]); // Add to breadcrumbs
  };

  const handleBreadcrumbClick = (step) => {
    setFilterStep(step); // Go back to the selected step
    // Reset filters for steps after the clicked breadcrumb
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
      is_superfast: null,
      cp_type: null,
      meal_time: null,
      veg_non_veg: null,
    });
    setFilterStep(1); // Reset to the first step
    setBreadcrumbs([]); // Clear breadcrumbs
    setIsSaveEnabled(false);
  };

  const filteredPackages = packages.filter(pkg => {
    return (
      (!selectedFilters.is_superfast || pkg.is_superfast === selectedFilters.is_superfast) &&
      (!selectedFilters.cp_type || pkg.cp_type === selectedFilters.cp_type) &&
      (!selectedFilters.meal_time || pkg.meal_time === selectedFilters.meal_time) &&
      (!selectedFilters.veg_non_veg || pkg.veg_non_veg === selectedFilters.veg_non_veg)
    );
  });

  const handlePositionChange = (id, newPosition) => {
    // Ensure newPosition is a valid number
    newPosition = parseInt(newPosition);

    // Find the package being updated
    const updatedPackage = packages.find(pkg => pkg.id === id);

    if (!updatedPackage) return;

    // Create a copy of the packages array
    const newPackages = [...packages];

    // Filter packages based on the same group (is_superfast, cp_type, meal_time, veg_non_veg)
    const groupPackages = newPackages.filter(pkg => 
      pkg.is_superfast === updatedPackage.is_superfast &&
      pkg.cp_type === updatedPackage.cp_type &&
      pkg.meal_time === updatedPackage.meal_time &&
      pkg.veg_non_veg === updatedPackage.veg_non_veg
    );

    // Sort the group packages by their current position
    groupPackages.sort((a, b) => a.position - b.position);

    // Find the index of the package being updated in the group
    const updatedIndex = groupPackages.findIndex(pkg => pkg.id === id);

    if (updatedIndex === -1) return;

    // Remove the updated package from the group
    const [removedPackage] = groupPackages.splice(updatedIndex, 1);

    // Insert the updated package at the new position
    groupPackages.splice(newPosition - 1, 0, removedPackage);

    // Update the positions of all packages in the group
    groupPackages.forEach((pkg, index) => {
      pkg.position = index + 1;
    });

    // Update the main packages array with the new positions
    const updatedPackages = newPackages.map(pkg => {
      const updatedPkg = groupPackages.find(gp => gp.id === pkg.id);
      return updatedPkg ? updatedPkg : pkg;
    });

    // Update the state
    setPackages(updatedPackages);
    setIsSaveEnabled(true);
  };

  const handleSave = async () => {
    // Check for duplicate positions
    const positions = filteredPackages.map(pkg => pkg.position);
    const hasDuplicates = new Set(positions).size !== positions.length;

    if (hasDuplicates) {
      alert('Error: Two or more packages have the same position. Please ensure all positions are unique.');
      return;
    }

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
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  // Get unique values for each filter step
  const uniqueSuperfast = [...new Set(packages.map(pkg => pkg.is_superfast))];
  const uniqueCpTypes = [...new Set(packages.map(pkg => pkg.cp_type))];
  const uniqueMealTimes = [...new Set(packages.map(pkg => pkg.meal_time))];
  const uniqueVegNonVeg = [...new Set(packages.map(pkg => pkg.veg_non_veg))];

  // Breadcrumb labels
  const breadcrumbLabels = {
    1: `Superfast/Regular: ${selectedFilters.is_superfast === 'Yes' ? 'Superfast' : 'Regular'}`,
    2: `CP Type: ${selectedFilters.cp_type}`,
    3: `Meal Time: ${selectedFilters.meal_time}`,
    4: `Veg/Non-Veg: ${selectedFilters.veg_non_veg}`,
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Food Packages</h1>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <button
                onClick={() => handleBreadcrumbClick(crumb.step)}
                className="text-blue-500 hover:underline"
              >
                {breadcrumbLabels[crumb.step]}
              </button>
              {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 text-gray-500" />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Step 1: Superfast/Regular */}
      {filterStep === 1 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Select Superfast or Regular</h2>
          <div className="flex gap-4">
            {uniqueSuperfast.map((value, index) => (
              <button
                key={index}
                onClick={() => handleFilterChange('is_superfast', value)}
                className={`px-4 py-2 rounded ${selectedFilters.is_superfast === value ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {value === 'Yes' ? 'Superfast' : 'Regular'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: CP Types */}
      {filterStep === 2 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Select CP Type</h2>
          <div className="flex gap-4">
            {uniqueCpTypes.map((value, index) => (
              <button
                key={index}
                onClick={() => handleFilterChange('cp_type', value)}
                className={`px-4 py-2 rounded ${selectedFilters.cp_type === value ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Meal Times */}
      {filterStep === 3 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Select Meal Time</h2>
          <div className="flex gap-4">
            {uniqueMealTimes.map((value, index) => (
              <button
                key={index}
                onClick={() => handleFilterChange('meal_time', value)}
                className={`px-4 py-2 rounded ${selectedFilters.meal_time === value ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Veg/Non-Veg */}
      {filterStep === 4 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Select Veg or Non-Veg</h2>
          <div className="flex gap-4">
            {uniqueVegNonVeg.map((value, index) => (
              <button
                key={index}
                onClick={() => handleFilterChange('veg_non_veg', value)}
                className={`px-4 py-2 rounded ${selectedFilters.veg_non_veg === value ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Display Packages After All Filters Are Selected */}
      {filterStep > 4 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border">Meal Time</th>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Price</th>
                  <th className="px-4 py-2 border">Position</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages
                  .sort((a, b) => a.position - b.position)
                  .map((item) => {
                    // Generate dropdown options for positions
                    const groupPackages = filteredPackages.filter(pkg => 
                      pkg.is_superfast === item.is_superfast &&
                      pkg.cp_type === item.cp_type &&
                      pkg.meal_time === item.meal_time &&
                      pkg.veg_non_veg === item.veg_non_veg
                    );
                    const positionOptions = Array.from({ length: groupPackages.length }, (_, i) => i + 1);

                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{item.cp_name}</td>
                        <td className="px-4 py-2 border">{item.description}</td>
                        <td className="px-4 py-2 border">{item.meal_time}</td>
                        <td className="px-4 py-2 border">
                          {item.is_superfast === 'Yes' ? 'Superfast' : 'Regular'}
                        </td>
                        <td className="px-4 py-2 border">₹{parseFloat(item.price).toFixed(2)}</td>
                        <td className="px-4 py-2 border">
                          <select
                            value={item.position}
                            onChange={(e) => handlePositionChange(item.id, parseInt(e.target.value))}
                            className="w-20 px-2 py-1 border rounded"
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

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleSave}
              disabled={!isSaveEnabled}
              className={`px-4 py-2 rounded flex items-center ${isSaveEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              <Save className="w-5 h-5 mr-2" />
              Save Positions
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Reset Filters
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FoodPackagesDisplay;