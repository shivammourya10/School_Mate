import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewImgGalleryPage = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumDetails, setAlbumDetails] = useState(null);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  // Fetch album names
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/albumNames`);
        setAlbums(response.data.albums || []);
        setLoadingAlbums(false);
      } catch (err) {
        setError("Failed to load album names. Please try again.");
        setLoadingAlbums(false);
      }
    };
    fetchAlbums();
  }, []);

  // Fetch album details when an album is clicked
  const handleAlbumClick = async (album) => {
    setSelectedAlbum(album);
    setLoadingDetails(true);
    setError(null);
    try {
      // Changed the API endpoint to '/albumImages/:albumId' for image retrieval
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/albumImages/${album._id}`);


      setAlbumDetails({
        name: album.name,
        description: album.description,
        images: response.data.images // Assuming the response contains an 'images' array
      });
      setLoadingDetails(false);
    } catch (err) {
      console.error("Error fetching album images:", err);
      setError("Failed to load album images. Please try again.");
      setLoadingDetails(false);
    }
  };

  // Open image in full-screen modal
  const openImageModal = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  // Close the full-screen modal
  const closeImageModal = () => {
    setFullScreenImage(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Image Gallery</h1>

      {error && <div className="text-center text-red-600 mb-4">{error}</div>}

      {/* Album Selection Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select an Album:</h2>
        {loadingAlbums ? (
          <p>Loading albums...</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {albums.map((album) => (
              <button
                key={album._id}
                onClick={() => handleAlbumClick(album)}
                className={`px-4 py-2 rounded ${
                  selectedAlbum && selectedAlbum._id === album._id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {album.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Album Details Section */}
      {loadingDetails && <p>Loading album details...</p>}

      {albumDetails && (
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-2">{albumDetails.name}</h3>
          <p className="text-gray-700 mb-4">{albumDetails.description}</p>
          {albumDetails.images && albumDetails.images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {albumDetails.images.map((image) => (
                <div key={image._id} className="bg-white rounded-lg shadow-lg p-4">
                  <img
                    src={image.image}
                    alt={albumDetails.name}
                    className="w-full h-32 object-cover rounded cursor-pointer"
                    onClick={() => openImageModal(image.image)}
                  />
                  {/* Log each image URL being rendered */}
                  {console.log(`Displaying image: ${image.image}`)}
                </div>
              ))}
            </div>
          ) : (
            <p>No images available for this album.</p>
          )}
        </div>
      )}

      {/* Full-Screen Image Modal */}
      {fullScreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div className="relative">
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold z-10"
              onClick={closeImageModal}
            >
              &times;
            </button>
            <img
              src={fullScreenImage}
              alt="Full Screen"
              className="max-w-3xl max-h-screen object-contain rounded"
            />
          </div>
export default ViewImgGalleryPage;
        </div>
      )}
    </div>
  );
};

export default ViewImgGalleryPage;