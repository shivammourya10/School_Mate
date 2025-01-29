
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Import success icon

const UploadFeesPage = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [fees, setFees] = useState([]);
  const [error, setError] = useState(null);

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
      } catch (err) {
        let errorMessage;
        if (err.code === 'ECONNABORTED' || !navigator.onLine) {
          errorMessage = 'Network error - Please check your internet connection';
        } else if (err.message === 'Network Error' || err.message === 'No response from server') {
          errorMessage = 'No response from server. Please try again later.';
        } else {
          errorMessage = 'Failed to load fees. Please try again.';
        }
        setError(errorMessage);
      }
    };
    fetchFees();
  }, [uploadSuccess]);


  let listOfGrades = ["Play Group", "Nursery", "Jr. KG", "Sr. KG", "1st Standard", "2nd Standard", "3rd Standard", "4th Standard", "5th Standard"];

  const listOfUploadedGrades = [];

  fees.map((fee) => {
    listOfUploadedGrades.push(fee.title);
  })

  function arrayDifference(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter(item => !set2.has(item));
  }

  listOfGrades = arrayDifference(listOfGrades, listOfUploadedGrades);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      setUploadError("Please provide a title and select an image.");
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
        `${import.meta.env.VITE_BASE_URL}/api/feesUp`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );
      setUploadSuccess("Fee detail uploaded successfully."); // Set success message
      setTitle(''); // Clear title input
      setFile(null);  // Clear file state to reset file input
    } catch (err) {
      let errorMessage;
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = "Failed to upload fee detail. Please try again.";
      }
      setUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Upload Fee Detail</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          {listOfGrades.length === 0 ?
            <div
              className="font-medium text-lg text-red-500"
            >Fees for all the classes has been already uploaded, update or delete a fees first.</div>
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
          <label className="block text-gray-700 mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*, application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
            required
          />
        </div>
        {uploadError && <div className="text-red-600 mb-4">{uploadError}</div>}
        {uploadSuccess && (
          <div className="flex items-center text-green-600 mb-4 transition-opacity duration-500">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            {uploadSuccess}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors duration-300"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Fee Detail"}
        </button>
      </form>

      {/* ...existing modals... */}
    </div>
  );
};

export default UploadFeesPage;
