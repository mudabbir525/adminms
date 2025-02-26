import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditCarousel = () => {
    const [formData, setFormData] = useState({
        media_type: '',
        button_text: '',
        link_url: '',
        is_active: true,
        current_media: ''
    });
    const [newMedia, setNewMedia] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCarouselItem();
    }, [id]);

    const fetchCarouselItem = async () => {
        try {
            const response = await fetch(`https://adminmahaspice.in/ms3/getcarouselbyid.php?id=${id}`);
            const data = await response.json();
            setFormData({
                media_type: data.media_type,
                button_text: data.button_text,
                link_url: data.link_url,
                is_active: data.is_active === 1,
                current_media: data.media_path
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching carousel item:', error);
            alert('Failed to fetch carousel item');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('id', id);
        formDataToSend.append('button_text', formData.button_text);
        formDataToSend.append('link_url', formData.link_url);
        formDataToSend.append('is_active', formData.is_active ? 1 : 0);

        if (newMedia) {
            formDataToSend.append('media_file', newMedia);
        }

        try {
            const response = await fetch('https://adminmahaspice.in/ms3/updatecarousel.php', {
                method: 'POST',
                body: formDataToSend
            });

            if (response.ok) {
                alert('Carousel updated successfully!');
                navigate('/carousel'); // Adjust the route as needed
            } else {
                throw new Error('Failed to update carousel');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Edit Carousel Slide</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                    <label className="block mb-2">Current Media:</label>
                    {formData.media_type === 'image' ? (
                        <img
                            src={`https://adminmahaspice.in/ms3/uploads/carousel/${formData.current_media}`}
                            alt="Current media"
                            className="max-w-full h-auto mb-2"
                        />
                    ) : (
                        <video
                            src={`https://adminmahaspice.in/ms3/uploads/carousel/${formData.current_media}`}
                            controls
                            className="max-w-full h-auto mb-2"
                        />
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-2">
                        Upload New {formData.media_type}:
                        <input
                            type="file"
                            accept={formData.media_type === 'image' ? 'image/*' : 'video/*'}
                            onChange={(e) => setNewMedia(e.target.files[0])}
                            className="mt-1 block w-full"
                        />
                    </label>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">
                        Button Text:
                        <input
                            type="text"
                            value={formData.button_text}
                            onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                            className="mt-1 block w-full border rounded px-3 py-2"
                            required
                        />
                    </label>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">
                        Link URL:
                        <input
                            type="url"
                            value={formData.link_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                            className="mt-1 block w-full border rounded px-3 py-2"
                            required
                        />
                    </label>
                </div>

                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                            className="mr-2"
                        />
                        Active
                    </label>
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Update Slide
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/carousel')}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCarousel;