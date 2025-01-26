import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon } from '@heroicons/react/24/outline';

const ViewImgGalleryPage = () => {
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [albumsByYear, setAlbumsByYear] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumImages, setAlbumImages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/albumYears`);
        setAvailableYears(response.data.years.sort((a, b) => b - a) || []); // Sort years descending
        setLoading(false);
      } catch (err) {
        setError("Failed to load years.");
        setLoading(false);
      }
    };
    fetchYears();
  }, []);

  // Fetch albums when year is selected
  useEffect(() => {
    const fetchAlbumsByYear = async () => {
      if (!selectedYear) {
        setAlbumsByYear([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/albumsByYear/${selectedYear}`);
        setAlbumsByYear(response.data.albums || []);
        setSelectedAlbum(null); // Reset selected album when year changes
        setAlbumImages(null); // Reset images when year changes
        setLoading(false);
      } catch (err) {
        setError("Failed to load albums for selected year.");
        setLoading(false);
      }
    };
    fetchAlbumsByYear();
  }, [selectedYear]);

  // Fetch images when album is selected
  useEffect(() => {
    const fetchAlbumImages = async () => {
      if (!selectedAlbum) return;
      
      setLoading(true);
      setError(null); // Clear previous errors
      console.log(selectedAlbum);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/albumImages/${selectedAlbum._id}`);
        console.log('Album Images Response:', response.data); // Add this for debugging
        
        if (!response.data || !response.data.images) {
            throw new Error('Invalid response format');
        }
        
        setAlbumImages({
            name: response.data.name,
            description: response.data.description,
            images: response.data.images
        });
      } catch (err) {
        console.error('Error details:', err.response || err); // Better error logging
        setError(err.response?.data?.message || "Failed to load album images.");
        setAlbumImages(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbumImages();
  }, [selectedAlbum]);

  // Add delete handler
  const handleDeleteImage = async (imageId) => {
    if (!selectedAlbum || !window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setDeleting(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/albumnImages/${selectedAlbum._id}/${imageId}`,
        { withCredentials: true }
      );
      
      // Update the UI by removing the deleted image
      setAlbumImages(prev => ({
        ...prev,
        images: prev.images.filter(img => img._id !== imageId)
      }));

      setError(null);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Gallery</h1>
      
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* Year Selection */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select Year</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={loading}
        >
          <option value="">Select a Year</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Album Selection - Only show if year is selected */}
      {selectedYear && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Select Album</h2>
          <div className="flex flex-wrap gap-2">
            {albumsByYear.map((album) => (
              <button
                key={album._id}
                onClick={() => setSelectedAlbum(album)}
                className={`px-4 py-2 rounded ${
                  selectedAlbum?._id === album._id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {album.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Images Display - Only show if album is selected */}
      {loading && <div className="text-center">Loading...</div>}
      
      {albumImages && (
        <div>
          <h2 className="text-2xl font-semibold mb-4"> Album :{albumImages.name}</h2>
          <p className="text-gray-800 mb-6">Description: {albumImages.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {albumImages.images.map((image) => (
              <div key={image._id} className="relative group">
                <img
                  src={image.image}
                  alt=""
                  className="w-full h-48 object-cover rounded cursor-pointer"
                  onClick={() => setFullScreenImage(image.image)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(image._id);
                  }}
                  className="absolute bottom-3 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
                  disabled={deleting}
                  title="Delete image"
                >
                  {deleting ? (
                    <span className="animate-spin">...</span>
                  ) : (
                    <TrashIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {fullScreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setFullScreenImage(null)}
        >
          <img
            src={fullScreenImage}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white text-xl"
            onClick={() => setFullScreenImage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewImgGalleryPage;