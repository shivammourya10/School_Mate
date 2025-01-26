import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'; // Updated import path

const ViewCertPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCert, setCurrentCert] = useState(null);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateFile, setUpdateFile] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/certificates`, {
          timeout: 5000 // 5 seconds timeout
          
        });
        if (!response.data || !response.data.Certificates) {
          throw new Error('No response from server');
        }
        setCertificates(response.data.Certificates || []);
        setLoading(false);
      } catch (err) {
        let errorMessage;
        if (err.code === 'ECONNABORTED' || !navigator.onLine) {
          errorMessage = 'Network error - Please check your internet connection';
        } else if (err.message === 'Network Error' || err.message === 'No response from server') {
          errorMessage = 'No response from server. Please try again later.';
        } else {
          errorMessage = 'Failed to load certificates. Please try again.';
        }
        setError(errorMessage);
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const openImageModal = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  const closeImageModal = () => {
    setFullScreenImage(null);
  };

  const openEditModal = (cert) => {
    setCurrentCert(cert);
    setUpdateTitle(cert.title);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentCert(null);
    setUpdateTitle('');
    setUpdateFile(null);
    setUpdateError(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!currentCert) return;

    setUpdateLoading(true);
    setUpdateError(null);

    const formData = new FormData();
    formData.append('title', updateTitle);
    if (updateFile) {
      formData.append('file', updateFile);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/certificateUp/${currentCert._id}`,
        
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        },
      );
      // Update certificates state
      setCertificates(certificates.map(cert => cert._id === currentCert._id ? response.data.cert : cert));
      setUpdateLoading(false);
      closeEditModal();
    } catch (err) {
      let errorMessage;
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = 'Failed to update certificate. Please try again.';
      }
      setUpdateError(errorMessage);
      setUpdateLoading(false);
    }
  };

  const openDeleteModal = (cert) => {
    setCurrentCert(cert);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentCert(null);
  };

  const handleDelete = async () => {
    if (!currentCert) return;

    setUpdateLoading(true);
    setUpdateError(null);

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/certificateUp/${currentCert._id}`
        
      );
      // Remove deleted certificate from state
      setCertificates(certificates.filter(cert => cert._id !== currentCert._id));
      setUpdateLoading(false);
      closeDeleteModal();
    } catch (err) {
      let errorMessage;
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = "Failed to delete certificate. Please try again.";
      }
      setUpdateError(errorMessage);
      setUpdateLoading(false);
      console.error("Delete Certificate Error:", err); // Added for debugging
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Certificates
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="text-center mt-10 text-red-600">{error}</div>
        ) : (
          certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => openImageModal(cert.image)}
            >
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{cert.title}</h2>
                <div className="flex justify-between mt-2">
                  <button
                    className="flex items-center bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(cert);
                    }}
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Update
                  </button>
                  <button
                    className="flex items-center bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(cert);
                    }}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Image Modal */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" 
          onClick={closeImageModal} // Added onClick to allow closing by clicking the overlay
        >
          <div 
            className="relative"
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside the modal content
          >
            <button
              className="absolute top-4 right-4 text-red-600 text-3xl font-bold z-10"
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
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && currentCert && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-800 text-2xl font-bold"
              onClick={closeEditModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">Update Certificate</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Upload New Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUpdateFile(e.target.files[0])}
                  className="w-full"
                />
              </div>
              {updateError && <div className="text-red-600 mb-4">{updateError}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors duration-300"
                disabled={updateLoading}
              >
                {updateLoading ? 'Updating...' : 'Update Certificate'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && currentCert && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-800 text-2xl font-bold"
              onClick={closeDeleteModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">Delete Certificate</h2>
            <p className="mb-4">Are you sure you want to delete this certificate?</p>
            {updateError && <div className="text-red-600 mb-4">{updateError}</div>}
            <div className="flex justify-end">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition-colors duration-300"
                disabled={updateLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300"
                disabled={updateLoading}
              >
                {updateLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCertPage;
