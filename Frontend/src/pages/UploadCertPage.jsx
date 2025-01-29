import React, { useState } from "react";
import axios from "axios";
import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Only import necessary icons

const UploadCertPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Define syllabi state if needed or remove related functions
  // const [syllabi, setSyllabi] = useState([]); // Uncomment if needed

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
    formData.append("description", description);
    formData.append("file", file);


    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/certificateUp`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setUploadSuccess("Certificate uploaded successfully."); // Set success message
      setTitle(''); // Clear title input
      setDescription("");
      setFile(null);  // Clear file state to reset file input
    } catch (err) {
      let errorMessage;
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = "Failed to upload certificate. Please try again.";
      }
      setFile(null);
      setTitle("");
      setDescription("");
      setUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // ...existing functions...

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Upload Certificate</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter certificate title"
            required
          />
          <label className="block text-gray-700 mb-2 pt-4">Description</label>
          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded h-[10rem]"
            placeholder="Enter certificate description"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Upload File</label>
          <input
            // Removed key attribute to prevent remounting issues
            name={!file ? "" : file.name}
            type="file"
            accept="image/*"
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
          {uploading ? "Uploading..." : "Upload Certificate"}
        </button>
      </form>

      {/* ...existing modals... */}
    </div>
  );
};

export default UploadCertPage;
