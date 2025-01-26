import React, { useEffect, useState } from "react";
import axios from "axios";

const UploadGalleryItemPage = () => {
  const [albumNames, setAlbumNames] = useState([]);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumDescription, setNewAlbumDescription] = useState("");
  const [newAlbumYear, setNewAlbumYear] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [creatingAlbum, setCreatingAlbum] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  // Replace the current year generation logic with this:
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2023 }, 
    (_, i) => 2024 + i
  ).sort((a, b) => b - a); // Sort years in descending order (newest first)

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/albumYears`);
        setAvailableYears(response.data.years || []);
      } catch (err) {
        setUploadError("Failed to load years. Please try again.");
      }
    };
    fetchYears();
  }, []);

  useEffect(() => {
    const fetchAlbumsByYear = async () => {
      if (!selectedYear) {
        setAlbumNames([]);
        return;
      }
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/albumsByYear/${selectedYear}`);
        setAlbumNames(response.data.albums || []);
        setLoadingAlbums(false);
      } catch (err) {
        setUploadError("Failed to load albums for selected year. Please try again.");
        setLoadingAlbums(false);
      }
    };
    if (selectedYear) {
      setLoadingAlbums(true);
      fetchAlbumsByYear();
    }
  }, [selectedYear]);

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbumName || !newAlbumDescription || !newAlbumYear) {
      setUploadError("Please provide name, description and year for the album.");
      return;
    }
    setCreatingAlbum(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/albumnUp`, {
        name: newAlbumName,
        description: newAlbumDescription,
        year: newAlbumYear
      },
      {withCredentials: true}
    );
      setAlbumNames([...albumNames, response.data.album]);
      setNewAlbumName("");
      setNewAlbumDescription("");
      setNewAlbumYear("");
      setUploadSuccess("Album created successfully.");
      setCreatingAlbum(false);
    } catch (err) {
      setUploadError("Failed to create album. Please try again.");
      setCreatingAlbum(false);
    }
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!selectedAlbumId) {
      setUploadError("Please select an album to upload the image.");
      return;
    }
    if (!uploadFile) {
      setUploadError("Please select an image to upload.");
      return;
    }
    setUploadingImage(true);
    setUploadError(null);
    setUploadSuccess(null);
    const formData = new FormData();
    formData.append("file", uploadFile);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/albumnImage/${selectedAlbumId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );
      setUploadSuccess("Image uploaded successfully.");
      setUploadFile(null);
      setUploadingImage(false);
    } catch (err) {
      setUploadError("Failed to upload image. Please try again.");
      setUploadingImage(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Upload Gallery Items</h1>
      
      {uploadError && <div className="text-center text-red-600 mb-4">{uploadError}</div>}
      {uploadSuccess && <div className="text-center text-green-600 mb-4">{uploadSuccess}</div>}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Album</h2>
        <form onSubmit={handleCreateAlbum} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Album Name</label>
            <input
              type="text"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Album Description</label>
            <textarea
              value={newAlbumDescription}
              onChange={(e) => setNewAlbumDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Album Year</label>
            <select
              value={newAlbumYear}
              onChange={(e) => setNewAlbumYear(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">-- Select Year --</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300"
            disabled={creatingAlbum}
          >
            {creatingAlbum ? "Creating..." : "Create Album"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Upload Image to Album</h2>
        <form onSubmit={handleUploadImage} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Select Year</label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedAlbumId(""); // Reset album selection when year changes
              }}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">-- Select Year --</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {selectedYear && (
            <div>
              <label className="block text-gray-700 mb-2">Select Album</label>
              {loadingAlbums ? (
                <p>Loading albums...</p>
              ) : (
                <select
                  value={selectedAlbumId}
                  onChange={(e) => setSelectedAlbumId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">-- Select an Album --</option>
                  {albumNames.map((album) => (
                    <option key={album._id} value={album._id}>
                      {album.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {selectedAlbumId && (
            <div>
              <label className="block text-gray-700 mb-2">Select Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="w-full"
                required
              />
            </div>
          )}

          {selectedAlbumId && (
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
              disabled={uploadingImage}
            >
              {uploadingImage ? "Uploading..." : "Upload Image"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadGalleryItemPage;
