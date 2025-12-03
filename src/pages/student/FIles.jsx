import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaEye} from 'react-icons/fa';
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";



const Files = () => {
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
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

    // Fetch files when the component mounts
  useEffect(() => {
      const fetchFiles = async () => {
        if (user && token) {
          try {
            const response = await axios.post(
              `https://fess-backend-6787.onrender.com/api/student/course/${courseId}/files`,
              { studentID: user.id },
              { 
                headers: {
                  Authorization: `Bearer ${token}`,
                },
               }
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
  
  
  return (
    <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>

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
                    onClick={() => window.open(`https://fess-backend-6787.onrender.com/${file.file_path}`, "_blank")}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md mr-2"
                  >
                    <FaEye />
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
  )
}

export default Files