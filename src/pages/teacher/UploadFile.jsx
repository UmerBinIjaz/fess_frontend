import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";

import './UploadFile.css';

const UploadFile = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const { courseId } = useParams(); // Get courseId from the URL
  const [file, setFile] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(10); // Number of rows per page 
  const [fileName, setFileName] = useState("Drag or Choose a file");
  const [files, setFiles] = useState([]); // State to store fetched files
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();


  // Fetch files when the component mounts
  useEffect(() => {
    const fetchFiles = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            `http://localhost:5000/api/teacher/course/${courseId}/files`,
            { teacherId: user.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setFiles(response.data); // Update the state with fetched files
          setFilteredData(response.data);
        } catch (err) {
          console.error("Error fetching files:", err);
          setError("Error fetching files. Please try again.");
        }
      }
    };
    fetchFiles();
  }, [user, token, courseId]);

  // Handle search
  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value);
  //   const result = files.filter(file =>
  //     file?.file_name?.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredData(result);
  // };

    // Handle search
    useEffect(() => {
        const result = files.filter(file =>
            file?.file_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(result);
    }, [searchTerm, files]);

  // Handle show entries
  const handleEntriesChange = (e) => {
    setEntries(e.target.value);
  };


  // Handle file change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
      setSuccessMessage("");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileName(droppedFile.name); // Update fileName with the dropped file's name
      setError("");
    }
  };

  const handleBrowseClick = () => {
    document.getElementById('fileInput').click(); // Trigger the hidden file input
  };


  // Handle file upload
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Append the file to the form data

    try {
      const response = await axios.post(
        `http://localhost:5000/api/teacher/course/${courseId}/upload-file/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      const addedFile = response.data.file;
      

      setFiles((prevFiles) => [...prevFiles, addedFile]); // Add new file to the list
      setFilteredData((prevData) => [...prevData, addedFile]); // Update filtered data

      setSuccessMessage("File uploaded successfully!");
      setError(""); // Clear error message
      navigate(`/teacher/course/${courseId}/upload-file/`);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Error uploading file. Please try again.");
      setSuccessMessage(""); // Clear success message
    }
  };

  

  // Handle file deletion
  // Handle file deletion
  const handleDelete = async (fileId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/teacher/course/${courseId}/files/${fileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Remove the file from the list after deletion
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
      setFilteredData(prevFilteredData => prevFilteredData.filter(file => file.id !== fileId));
      setSuccessMessage('File deleted successfully.');
      setError('');
    } catch (err) {
      console.error("Error deleting file:", err);
      setError("Error deleting file. Please try again.");
      setSuccessMessage(""); // Clear success message
    }
  };
  

  return (
    <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
      {/* Import Button */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className='flex justify-start'>

        </div>
        <div className='flex justify-end'>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
            onClick={() => setIsModalOpen(true)}
          >
            Import File
          </button>
        </div>
      </div>

        {/* Modal Code */}
        {isModalOpen && (
          <div className="modal">

            <div className="modal-body">
              <h2 className="modal-title">Upload a file</h2>
              <p className="modal-description">Attach the file below</p>
              <form onSubmit={handleSubmit}>
                <div
                  className="upload-area"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleBrowseClick} // Trigger file browse
                >
                  <span className="upload-area-icon">
                    {/* SVG icon */}
                  </span>
                  <span className="upload-area-title">Drag file(s) here to upload.</span>
                  <span className="upload-area-description">
                    {fileName}
                  </span>
                  <input
                    id="fileInput"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                {error && <div className="error">{error}</div>}
                {successMessage && <div className="success">{successMessage}</div>}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Upload File
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


      {/* File List Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className='flex justify-start'>
          <h3 className="m-0 font-medium text-base text-blue-500">All Files</h3>
        </div>
        <div className='flex justify-end'>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-full sm:w-auto max-w-xs border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>ID</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>File Name</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((file, index) => (
                <tr key={file.id} className="border-b">
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{index + 1}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{file.file_name}</td>
                  <td>
                  <button
                    onClick={() => window.open(`http://localhost:5000/${file.file_path}`, "_blank")}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md mr-2"
                  >
                    <FaEye />
                  </button>

                    <button
                      onClick={() => handleDelete(file.id)}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-md"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="py-2 px-4 error text-sm text-center"
                >
                  No File Uploaded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadFile;
