import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'; // Import icons
import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Import success icon (if needed)

function ViewSyllabusPage() {
  const [syllabi, setSyllabi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentSyllabus, setCurrentSyllabus] = useState(null);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateFile, setUpdateFile] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    const fetchSyllabi = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/syllabus`, {
          timeout: 5000 // 5 seconds timeout
        });
        if (!response.data || !response.data.syllabus) {
          throw new Error('No response from server');
        }
        setSyllabi(response.data.syllabus || []);
        setLoading(false);
      } catch (err) {
        let errorMessage;
        if (err.code === 'ECONNABORTED' || !navigator.onLine) {
          errorMessage = 'Network error - Please check your internet connection';
        } else if (err.message === 'Network Error' || err.message === 'No response from server') {
          errorMessage = 'No response from server. Please try again later.';
        } else {
          errorMessage = 'Failed to load syllabus. Please try again.';
        }
        setError(errorMessage);
        setLoading(false);
      }
    };
    fetchSyllabi();
  }, []);

  const openEditModal = (syllabus) => {
    setCurrentSyllabus(syllabus);
    setUpdateTitle(syllabus.title);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentSyllabus(null);
    setUpdateTitle('');
    setUpdateFile(null);
    setUpdateError(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!currentSyllabus) return;

    setUpdateLoading(true);
    setUpdateError(null);

    const formData = new FormData();
    formData.append('title', updateTitle);
    if (updateFile) {
      formData.append('file', updateFile);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/syllabusUp/${currentSyllabus._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      // Update syllabi state
      setSyllabi(syllabi.map(syll => syll._id === currentSyllabus._id ? response.data.syllabus : syll));
      setUpdateLoading(false);
      closeEditModal();
    } catch (err) {
      let errorMessage;
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = 'Failed to update syllabus. Please try again.';
      }
      setUpdateError(errorMessage);
      setUpdateLoading(false);
    }
  };

  const openDeleteModal = (syllabus) => {
    setCurrentSyllabus(syllabus);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentSyllabus(null);
  };

  const handleDelete = async () => {
    if (!currentSyllabus) return;

    setUpdateLoading(true);
    setUpdateError(null);

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/syllabus/${currentSyllabus._id}`
      );
      // Remove deleted syllabus from state
      setSyllabi(syllabi.filter(syll => syll._id !== currentSyllabus._id));
      setUpdateLoading(false);
      closeDeleteModal();
    } catch (err) {
      let errorMessage;
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = "Failed to delete syllabus. Please try again.";
      }
      setUpdateError(errorMessage);
      setUpdateLoading(false);
      console.error("Delete Syllabus Error:", err);
    }
  };

  const openImageModal = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  const closeImageModal = () => {
    setFullScreenImage(null);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Syllabus</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
              <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 text-center">
        <h2 className="text-xl font-medium text-red-600 mb-2">{error}</h2>
        <p className="text-gray-600">Please refresh the page or try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Syllabus</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {syllabi.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <img
              src={item.description}
              alt={item.title}
              className="w-full h-32 object-cover rounded cursor-pointer"
              onClick={() => openImageModal(item.description)}
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{item.title}</h2>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="flex items-center bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-colors duration-300"
                onClick={() => openEditModal(item)}
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Update
              </button>
              <button
                className="flex items-center bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors duration-300"
                onClick={() => openDeleteModal(item)}
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {fullScreenImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" 
          onClick={closeImageModal}
        >
          <div 
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-red-600 text-3xl font-bold z-10"
              onClick={closeImageModal}
            >
              &times;
            </button>
            <img
              src={fullScreenImage}
              alt="Full Screen Syllabus"
              className="max-w-3xl max-h-screen object-contain rounded"
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && currentSyllabus && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-800 text-2xl font-bold"
              onClick={closeEditModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">Update Syllabus</h2>
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
                <label className="block text-gray-700 mb-2">Upload New File (optional)</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
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
                {updateLoading ? 'Updating...' : 'Update Syllabus'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && currentSyllabus && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-800 text-2xl font-bold"
              onClick={closeDeleteModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">Delete Syllabus</h2>
            <p className="mb-4">Are you sure you want to delete this syllabus?</p>
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
}

export default ViewSyllabusPage;
