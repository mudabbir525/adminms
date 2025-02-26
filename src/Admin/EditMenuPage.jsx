import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditMenuPage = () => {
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuItemDetails();
  }, [id]);

  const fetchMenuItemDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://adminmahaspice.in/ms3/getgscdbyid.php?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.status === 'success') {
        const itemData = data.data;
        setMenuItem(itemData);
        setNewName(itemData.menu_type);
        setImagePreview(itemData.image_address);
      } else {
        setError(data.message || 'Failed to fetch menu item');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);
  setError(null);

  const formData = new FormData();
  formData.append("id", id);
  formData.append("menu_type", newName);

  if (newImage) {
    formData.append("image", newImage);
  } else if (menuItem.image_address) {
    formData.append("existing_image", menuItem.image_address);
  }

  try {
    const response = await fetch('https://adminmahaspice.in/ms3/updategscd.php', {
      method: 'POST',
      body: formData,
    });

    // Check if the response is not empty before parsing
    if (response.ok) {
      const data = await response.json();
      
      if (data.status === 'success') {
        navigate('/adminmenu');
      } else {
        setError(data.message || 'Failed to update menu item');
      }
    } else {
      setError('Server error. Please try again.');
    }
  } catch (err) {
    setError('Network error. Please try again.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="max-w-md m-auto mt-9 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Menu Item</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Menu Type</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />

          {imagePreview && (
            <div className="mt-4">
              <img
                src={`https://adminmahaspice.in/ms3/${imagePreview}`}
                alt="Menu Item"
                className="w-full object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Update Menu Item"}
        </button>
      </form>
    </div>
  );
};

export default EditMenuPage;
