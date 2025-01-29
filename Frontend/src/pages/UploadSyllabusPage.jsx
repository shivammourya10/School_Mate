import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'; // Importing success icon and other icons

const UploadSyllabusPage = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentSyllabus, setCurrentSyllabus] = useState(null);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateFile, setUpdateFile] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [syllabus, setSyllabus] = useState([]);

  const handleSelect = async (e) => {
    e.preventDefault();
    alert(e.target.value);
    setTitle(e.target.value);
  }

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/syllabus`, {
          timeout: 5000 // 5 seconds timeout
        });
        if (!response.data || !response.data.syllabus) {
          throw new Error('No response from server');
        }
        setSyllabus(response.data.syllabus || []);
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
      }
    };
    fetchSyllabus();
  }, [uploadSuccess]);

  let listOfGrades = ["Play Group", "Nursery", "Jr. KG", "Sr. KG", "1st Standard", "2nd Standard", "3rd Standard", "4th Standard", "5th Standard"];

  const listOfUploadedGrades = [];

  syllabus.map((syllabus) => {
    listOfUploadedGrades.push(syllabus.title);
  })

  function arrayDifference(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter(item => !set2.has(item));
  }

  listOfGrades = arrayDifference(listOfGrades, listOfUploadedGrades);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      setUploadError("Please provide a title and select a file.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/syllabusUp`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );
      setUploadSuccess("Syllabus uploaded successfully."); // Set success message
      setTitle(''); // Clear title input
      setFile(null);  // Clear file state to reset file input
    } catch (err) {
      let errorMessage;
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = "Failed to upload syllabus. Please try again.";
      }
      setUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (syllabus) => {
    setCurrentSyllabus(syllabus);
    setUpdateTitle(syllabus.title);
    setIsEditModalOpen(true);
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
          withCredentials: true
        }
      );
      setUpdateLoading(false);
      closeEditModal();
    } catch (err) {
      // ...error handling...
    }
  };

  const openDeleteModal = (syllabus) => {
    setCurrentSyllabus(syllabus);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!currentSyllabus) return;

    setUpdateLoading(true);
    setUpdateError(null);

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/syllabus/${currentSyllabus._id}`

      );
      setUpdateLoading(false);
      closeDeleteModal();
    } catch (err) {
      // ...error handling...
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Upload Syllabus</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">


          {listOfGrades.length === 0 ?
            <div
              className="font-medium text-lg text-red-500"
            >Syllabus for all the classes has been already uploaded, update or delete a syllabus</div>
            :
            <>
              <label className="block text-gray-700 mb-2">Choose Grade</label>
              <select
                value={title}
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
          <label className="block text-gray-700 mb-2">Upload File</label>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
            required
          />
        </div>
        {uploadError && <div className="text-red-600 mb-4">{uploadError}</div>}
        {
          uploadSuccess && (
            <div className="flex items-center text-green-600 mb-4 transition-opacity duration-500">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              {uploadSuccess}
            </div>
          )
        }
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors duration-300"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Syllabus"}
        </button>
        {/* Edit Modal */}
      </form >

      {
        isEditModalOpen && currentSyllabus && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-4 right-4 text-gray-800 text-2xl font-bold"
                onClick={() => setIsEditModalOpen(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold mb-4">Update Syllabus</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                // handleUpdate function logic
              }}>
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
        )
      }

      {/* Delete Modal */}
      {
        isDeleteModalOpen && currentSyllabus && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-4 right-4 text-gray-800 text-2xl font-bold"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold mb-4">Delete Syllabus</h2>
              <p className="mb-4">Are you sure you want to delete this syllabus?</p>
              {updateError && <div className="text-red-600 mb-4">{updateError}</div>}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition-colors duration-300"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    // handleDelete function logic
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300"
                  disabled={updateLoading}
                >
                  {updateLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default UploadSyllabusPage;
