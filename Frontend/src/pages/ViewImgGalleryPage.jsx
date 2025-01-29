import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon } from '@heroicons/react/24/outline';
import { PencilIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";


const ViewImgGalleryPage = () => {

  const navigate = useNavigate();

  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [albumsByYear, setAlbumsByYear] = useState([])
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumImages, setAlbumImages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
  const [isEditModalOpened, setIsEditModalOpened] = useState(false);
  const [toBeDeletedItem, setToBeDeletedItem] = useState(null);
  const [refetchImages, setRefetchImages] = useState(false);
  const [refetchAlbums, setRefetchAlbums] = useState(false);
  const [updatedAlbumDetails, setUpdatedAblumDetails] = useState({ title: "", description: "" });

  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/albumYears`);
        setAvailableYears(response.data.years.sort((a, b) => b - a) || []); // Sort years descending
      } catch (err) {
        setError("Failed to load years.");
      } finally {
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
      } catch (err) {
        setError("Failed to load albums for selected year.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlbumsByYear();
  }, [selectedYear, refetchAlbums]);

  // Fetch images when album is selected
  useEffect(() => {
    const fetchAlbumImages = async () => {
      if (!selectedAlbum) return;

      setLoading(true);
      setError(null); // Clear previous errors

      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/albumImages/${selectedAlbum._id}`);


        if (!response.data || !response.data.images) {
          throw new Error('Invalid response format');
        }

        setAlbumImages({
          _id: response.data._id,
          name: response.data.name,
          description: response.data.description,
          images: response.data.images
        });
        setUpdatedAblumDetails({ title: response.data.name, description: response.data.description })
      } catch (err) {
        console.error('Error details:', err.response || err); // Better error logging
        setError(err.response?.data?.message || "Failed to load album images.");
        setAlbumImages(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbumImages();
  }, [selectedAlbum, refetchImages]);

  // Add delete handler
  const handleDelete = async () => {
    setLoading(true);
    setRefetchImages(false);

    if (toBeDeletedItem.albumId && toBeDeletedItem.imageId) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/album/${toBeDeletedItem.albumId}/${toBeDeletedItem.imageId}`);

        if (!response || !response.data || !response.data.message) {
          return setError("Something went wrong while deleting the album");
        }
        console.log(response.data);
        setIsDeleteModalOpened(false);
        setSuccess(response.data.message);
        setRefetchImages(true);
      } catch (e) {
        console.log(e);
        setError(e.message);
        setSuccess(null);
      } finally {
        setLoading(false);
      }
    }
    else if (toBeDeletedItem.albumId) {
      setLoading(true);
      setRefetchAlbums(false);
      try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/album/${toBeDeletedItem.albumId}`);

        if (!response || !response.data || !response.data.message) {
          setSuccess(null);
          return setError("Something went wrong while deleting the album");
        }

        console.log(response.data);
        setLoading(false);
        setSuccess(response.data.message);
        setError(null);
        setIsDeleteModalOpened(false);
        setToBeDeletedItem(null);
        setAlbumImages(null);
        setRefetchAlbums(true);
      } catch (e) {
        console.log(e);
        setError(e);
        setSuccess(null);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Something went wrong while deleting");
      setSuccess(null);
    }
  };

  const openDeleteModal = (albumId, imageId) => {
    setIsDeleteModalOpened(true);
    if (albumId && imageId) {
      setToBeDeletedItem({ "albumId": albumId, "imageId": imageId });
    } else {
      setToBeDeletedItem({ "albumId": albumId });
    }
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpened(false);
    setToBeDeletedItem(null);
  }


  const handleUpdate = () => {

  }

  const openEditModal = (ablumDetails) => {
    setIsEditModalOpened(true);


  }

  const closeEditModal = () => {
    setIsEditModalOpened(false);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Delete modal */}
      {isDeleteModalOpened && toBeDeletedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-800 text-2xl font-bold"
              onClick={closeDeleteModal}
            >
              {/* &times; is the sign for multiplication sign */}
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">Delete {toBeDeletedItem.albumId && toBeDeletedItem.imageId ? "Image" : "Album"}</h2>
            <p className="mb-4">Are you sure you want to delete this {toBeDeletedItem.albumId && toBeDeletedItem.imageId ? "image" : "album"}?</p>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <div className="flex justify-end">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition-colors duration-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {isEditModalOpened && updatedAlbumDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-800 text-2xl font-bold"
              onClick={closeEditModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">Update Album</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4 flex flex-col justify-center items-start gap-y-4">
                <label>Title</label>
                <input
                  className="border-2 border-gray-300 rounded-lg py-2 px-4"
                  placeholder="Enter the title"
                  value={updatedAlbumDetails.title}
                  required
                />
                <label>Description</label>
                <input />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Upload New File (optional)</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setUpdateFile(e.target.files[0])}
                  className="w-full"
                />
              </div>
              {error && <div className="text-red-600 mb-4">{error}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors duration-300"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Syllabus'}
              </button>
            </form>
          </div>
        </div>
      )}


      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Gallery</h1>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {success && <div className="text-green-500 text-center mb-4">{success}</div>}

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
          <div className="flex flex-wrap gap-2 w-full">
            {
              albumsByYear.length === 0 ?
                <div className="flex flex-col justify-center items-center text-xl h-full gap-y-4 w-full">
                  <div className="w-6 h-6">
                    <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.4449 0.608765C8.0183 -0.107015 6.9817 -0.107015 6.55509 0.608766L0.161178 11.3368C-0.275824 12.07 0.252503 13 1.10608 13H13.8939C14.7475 13 15.2758 12.07 14.8388 11.3368L8.4449 0.608765ZM7.4141 1.12073C7.45288 1.05566 7.54712 1.05566 7.5859 1.12073L13.9798 11.8488C14.0196 11.9154 13.9715 12 13.8939 12H1.10608C1.02849 12 0.980454 11.9154 1.02018 11.8488L7.4141 1.12073ZM6.8269 4.48611C6.81221 4.10423 7.11783 3.78663 7.5 3.78663C7.88217 3.78663 8.18778 4.10423 8.1731 4.48612L8.01921 8.48701C8.00848 8.766 7.7792 8.98664 7.5 8.98664C7.2208 8.98664 6.99151 8.766 6.98078 8.48701L6.8269 4.48611ZM8.24989 10.476C8.24989 10.8902 7.9141 11.226 7.49989 11.226C7.08567 11.226 6.74989 10.8902 6.74989 10.476C6.74989 10.0618 7.08567 9.72599 7.49989 9.72599C7.9141 9.72599 8.24989 10.0618 8.24989 10.476Z" fill="#000000">
                        </path>
                      </g>
                    </svg>
                  </div>
                  No albums created
                  <button
                    className="py-2 px-4 bg-green-600 flex justify-center items-center text-white rounded-xl"
                    onClick={() => { navigate('/admin-add-gallery') }}
                  >
                    <div className="w-4 h-4 mr-4">
                      <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 45.402 45.402" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141 c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27 c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435 c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"></path> </g> </g></svg>
                    </div>
                    <p>
                      Create a new album
                    </p>
                  </button>
                </div>
                :
                albumsByYear.map((album) => (
                  <button
                    key={album._id}
                    onClick={() => setSelectedAlbum(album)}
                    className={`px-4 py-2 rounded ${selectedAlbum?._id === album._id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                      }`}
                  >
                    {album.name}
                  </button>
                ))
            }
          </div>
        </div>
      )}

      {/* Images Display - Only show if album is selected */}
      {loading && <div className="text-center">Loading...</div>}

      {albumImages && (
        <div>
          <div className="flex justify-between items-center border-t-2 border-black pt-10">
            <h2 className="text-2xl font-semibold mb-4"> Album : {albumImages.name}</h2>
            <div className="flex flex-row justify-center items-center gap-x-4">
              <button
                className='bg-green-600 hover:bg-green-700 text-white flex justify-center items-center px-4 py-2 rounded-lg transition-colors duration-200'
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(albumImages);
                }}
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit this album
              </button>

              <button
                className='bg-red-600 hover:bg-red-700 text-white flex justify-center items-center px-4 py-2 rounded-lg transition-colors duration-200'
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteModal(albumImages._id, null);
                }}
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete this album
              </button>
            </div>
          </div>
          <p className="text-gray-800 mb-6">Description: {albumImages.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            {
              albumImages.images.length === 0 ?
                <div className="flex flex-col justify-center items-center text-xl h-full gap-y-4 w-full md:col-span-3 lg:col-span-4 ">
                  <div className="w-6 h-6">
                    <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.4449 0.608765C8.0183 -0.107015 6.9817 -0.107015 6.55509 0.608766L0.161178 11.3368C-0.275824 12.07 0.252503 13 1.10608 13H13.8939C14.7475 13 15.2758 12.07 14.8388 11.3368L8.4449 0.608765ZM7.4141 1.12073C7.45288 1.05566 7.54712 1.05566 7.5859 1.12073L13.9798 11.8488C14.0196 11.9154 13.9715 12 13.8939 12H1.10608C1.02849 12 0.980454 11.9154 1.02018 11.8488L7.4141 1.12073ZM6.8269 4.48611C6.81221 4.10423 7.11783 3.78663 7.5 3.78663C7.88217 3.78663 8.18778 4.10423 8.1731 4.48612L8.01921 8.48701C8.00848 8.766 7.7792 8.98664 7.5 8.98664C7.2208 8.98664 6.99151 8.766 6.98078 8.48701L6.8269 4.48611ZM8.24989 10.476C8.24989 10.8902 7.9141 11.226 7.49989 11.226C7.08567 11.226 6.74989 10.8902 6.74989 10.476C6.74989 10.0618 7.08567 9.72599 7.49989 9.72599C7.9141 9.72599 8.24989 10.0618 8.24989 10.476Z" fill="#000000">
                        </path>
                      </g>
                    </svg>
                  </div>
                  No images added
                  <button
                    className="py-2 px-4 bg-green-600 hover:bg-green-700 flex justify-center items-center text-white rounded-xl transition-colors duration-200"
                    onClick={() => { navigate('/admin-add-gallery') }}
                  >
                    <div className="w-4 h-4 mr-4">
                      <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 45.402 45.402" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141 c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27 c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435 c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"></path> </g> </g></svg>
                    </div>
                    <p>
                      Upload a new image
                    </p>
                  </button>
                </div>
                :
                albumImages.images.map((image) => (
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
                        openDeleteModal(albumImages._id, image._id);
                      }}
                      className="absolute bottom-3 right-2 bg-red-500 hover:bg-red-600 text-white rounded-l opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center "
                      disabled={deleting}
                      title="Delete image"
                    >
                      {deleting ? (
                        <span className="animate-spin">...</span>
                      ) : (
                        <div className="flex justify-center items-center gap-x-4 px-4 py-2">
                          <TrashIcon className="h-6 w-6 " />
                          <p>Delete Image</p>
                        </div>
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
