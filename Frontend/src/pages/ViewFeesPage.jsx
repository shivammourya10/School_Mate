import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'; // Import icons
import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Import success icon
import { useNavigate } from "react-router-dom";

function ViewFeesPage() {
  const navigate = useNavigate();


  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentFee, setCurrentFee] = useState(null);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateFile, setUpdateFile] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/fees`, {
          timeout: 5000 // 5 seconds timeout
        });
        if (!response.data || !response.data.fees) {
          throw new Error('No response from server');
        }
        setFees(response.data.fees || []);
        setLoading(false);
      } catch (err) {
        let errorMessage;
        if (err.code === 'ECONNABORTED' || !navigator.onLine) {
          errorMessage = 'Network error - Please check your internet connection';
        } else if (err.message === 'Network Error' || err.message === 'No response from server') {
          errorMessage = 'No response from server. Please try again later.';
        } else {
          errorMessage = 'Failed to load fees details. Please try again.';
        }
        setError(errorMessage);
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  let listOfGrades = ["Play Group", "Nursery", "Jr. KG", "Sr. KG", "1st Standard", "2nd Standard", "3rd Standard", "4th Standard", "5th Standard"];

  const listOfUploadedGrades = [];

  fees.map((fee) => {
    listOfUploadedGrades.push(fee.title);
  })

  function arrayDifference(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter(item => !set2.has(item) || item == currentFee?.title);
  }
  console.log("Current fee : ", currentFee);

  listOfGrades = arrayDifference(listOfGrades, listOfUploadedGrades);


  const openImageModal = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  const closeImageModal = () => {
    setFullScreenImage(null);
  };

  const openEditModal = (fee) => {
    setCurrentFee(fee);
    setUpdateTitle(fee.title);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentFee(null);
    setUpdateTitle('');
    setUpdateFile(null);
    setUpdateError(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!currentFee) return;

    setUpdateLoading(true);
    setUpdateError(null);

    const formData = new FormData();
    formData.append('title', updateTitle);
    if (updateFile) {
      formData.append('file', updateFile);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/feesUp/${currentFee._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );
      // Update fees state
      setFees(fees.map(fee => fee._id === currentFee._id ? response.data.file : fee));
      setUpdateLoading(false);
      closeEditModal();
    } catch (err) {
      console.error("Update Fee Error:", err); // Added for debugging
      let errorMessage;
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = 'Failed to update fee details. Please try again.';
      }
      setUpdateError(errorMessage);
      setUpdateLoading(false);
    }
  };

  const openDeleteModal = (fee) => {
    setCurrentFee(fee);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentFee(null);
  };

  const handleDelete = async () => {
    if (!currentFee) return;

    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/fees/${currentFee._id}`,
        { withCredentials: true }

      );
      // Optionally, you can use response.message
      setFees(fees.filter(fee => fee._id !== currentFee._id));
      setUpdateLoading(false);
      closeDeleteModal();
    } catch (err) {
      let errorMessage;
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = "Failed to delete fee detail. Please try again.";
      }
      setUpdateError(errorMessage);
      setUpdateLoading(false);
      console.error("Delete Fee Error:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Fees Details</h1>
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Fees Details</h1>
      {fees.length === 0 ?
        <div className="flex flex-col justify-center items-center text-xl h-full gap-y-4">
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
          No Fees uploaded
          <button
            className="py-2 px-4 bg-green-600 hover:bg-green-700 flex justify-center items-center text-white rounded-xl transition-colors duration-200"
            onClick={() => { navigate('/admin-add-fees') }}
          >
            <div className="w-4 h-4 mr-4">
              <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 45.402 45.402" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141 c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27 c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435 c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"></path> </g> </g></svg>
            </div>
            <p>
              Add fees
            </p>
          </button>
        </div>
        :
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {fees.map((fee) => (
              <div key={fee._id} className="bg-white flex flex-col justify-center items-center rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => {
                  if (fee.description.includes(".pdf")) {
                    window.open(fee.description, "_blank");
                  } else {
                    openImageModal(fee.description)
                  }
                }}>
                {fee.description.includes(".pdf") ?
                  <img
                    src="/assets/pdf-logo.svg"
                    alt={fee.title}
                    className="h-32 cursor-pointer"
                  />

                  :
                  <img
                    src={fee.description}
                    alt={fee.title}
                    className="w-full h-32 object-cover rounded cursor-pointer"
                  />
                }
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{fee.title}</h2>
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    className="flex items-center bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(fee);
                    }}
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Update
                  </button>
                  <button
                    className="flex items-center bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(fee);
                    }}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Full-Screen Image Modal */}
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
                  alt="Full Screen Fee"
                  className="max-w-3xl max-h-screen object-contain rounded"
                />
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {isEditModalOpen && currentFee && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                  className="absolute top-4 right-4 text-gray-800 text-2xl font-bold"
                  onClick={closeEditModal}
                >
                  &times;
                </button>
                <h2 className="text-2xl font-semibold mb-4">Update Fee Detail</h2>
                <form onSubmit={handleUpdate}>
                  <div className="mb-4">
                    {listOfGrades.length === 0 ?
                      <div
                        className="font-medium text-lg text-red-500"
                      >Fees for all the classes has been already uploaded, update or delete a fees first.</div>
                      :
                      <>
                        <label className="block text-gray-700 mb-2">Choose Grade</label>
                        <select
                          value={updateTitle}
                          onChange={(e) => setTitle(e.target.value)}
                          className="py-2 px-4 rounded-lg border-2 border-gray-400"
                          required
                        >
                          <option value="">Choose Grade</option>
                          {listOfGrades.map((grade) =>
                            <option value={grade}>
                              {grade}
                            </option>
                          )}
                        </select>
                      </>
                    }
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
                    {updateLoading ? 'Updating...' : 'Update Fee Detail'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {isDeleteModalOpen && currentFee && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                  className="absolute top-4 right-4 text-gray-800 text-2xl font-bold"
                  onClick={closeDeleteModal}
                >
                  &times;
                </button>
                <h2 className="text-2xl font-semibold mb-4">Delete Fee Detail</h2>
                <p className="mb-4">Are you sure you want to delete this fee detail?</p>
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

      }
    </div>
  );
}

export default ViewFeesPage;
