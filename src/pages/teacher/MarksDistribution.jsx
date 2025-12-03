import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, redirect } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";
import { FaEye, FaTrash } from 'react-icons/fa';

const MarksDistribution = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const { courseId } = useParams(); // Fetching courseId from URL params
  const navigate = useNavigate();  // For navigation
  const [marksDistribution, setMarksDistribution] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(10); // Number of rows per page
  const [filteredData, setFilteredData] = useState([]);
  const [sessionalType, setSessionalType] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  const handleAddSessional = async (event) => {
    event.preventDefault(); // Prevent page refresh on form submission
  
    if (!sessionalType || !totalMarks) {
      setError('Please fill in all fields');
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:5000/api/teacher/course/${courseId}/sessionals/`, // Adjusted URL
        { teacherId: user.id, sessionalType, totalMarks },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setSuccessMessage('Sessional added successfully');
      // Optionally, refresh the list of sessionals here after adding a new one
      setMarksDistribution((prevData) => [...prevData, response.data]);
      setFilteredData((prevData) => [...prevData, response.data]); // Assuming the server returns the new sessional data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add sessional');
    }
  };

  // Fetch marks distribution data
  useEffect(() => {
    const fetchMarksDistribution = async () => {
      if (user && token) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/teacher/course/${courseId}/Fetchsessionals/`, // Adjusted URL
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setMarksDistribution(response.data);
          setFilteredData(response.data);
        } catch (error) {
          console.error('Error fetching marks distribution:', error);
        }
      }
    };

    fetchMarksDistribution();
  }, [user, token, courseId]);

  // Handle search
  useEffect(() => {
    const result = marksDistribution.filter(record =>
        (record.course_id && record.course_id.toString().includes(searchTerm)) ||
        (record.teacher_id && record.teacher_id.toString().includes(searchTerm)) ||
        (record.Sessional_type && record.Sessional_type.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredData(result);
  }, [searchTerm, marksDistribution]);


  const handleSee = (id) => {
    window.location.href = `http://localhost:5173/teacher/course/${courseId}/AddStudentMarks/${id}/`;
  };
  


  // Handle delete marks distribution record
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/teacher/course/${courseId}/Deletesessionals/${id}`, // Adjusted URL
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage('Marks Distribution Record Deleted Successfully');
      setMarksDistribution(marksDistribution.filter(record => record.id !== id)); // Remove record from state
      setFilteredData(filteredData.filter(record => record.id !== id)); // Update filtered data
    } catch (error) {
      setError('Failed to delete record');
    }
  };


    // Export function
    const handleExport = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/teacher/course/${courseId}/export-marks`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: 'blob', // Important for file download
          }
        );
  
        // Create a URL for the file and trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'marks_sheet.xlsx'); // Set filename
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Error exporting marks:', error);
      }
    };


  // Pagination: Get the current page's records
  const paginate = (data, pageNumber, entriesPerPage) => {
    const indexOfLast = pageNumber * entriesPerPage;
    const indexOfFirst = indexOfLast - entriesPerPage;
    return data.slice(indexOfFirst, indexOfLast);
  };

  const totalPages = Math.ceil(filteredData.length / entries); // Calculate total pages

  return (
    <>
      <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
        {/* Title Section */}
        {/* <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-blue-500">Create Sessional</h3>
        </div> */}
        <div className="flex justify-between items-center mb-6">
          <h6 className="m-0 font-medium text-base text-blue-500">Create Sessional</h6>
        </div>
        {/* Success or Error Messages */}
        {error && (
          <div className="text-center bg-red-100 text-red-600 p-2 rounded-md mb-4">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="text-center bg-green-100 text-green-600 p-2 rounded-md mb-4">
            {successMessage}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleAddSessional}>
          <div className="space-y-4">
            <div>
              <label className={`block font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Sessional Type</label>
              <input
                type="text"
                value={sessionalType}
                onChange={(e) => setSessionalType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className={`block font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Total Marks</label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-6 py-2.5 mt-4"
              >
                Add Sessional
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className={`max-w-7xl mx-auto p-6 mt-4 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
        <div className="flex justify-between items-center mb-6">
          <h6 className="m-0 font-medium text-base text-blue-500">All Sessional</h6>
          <button
            onClick={handleExport}
            className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-4 py-2"
          >
            Export
          </button>          
        </div> 
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>ID</th>
                {/* <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Course ID</th> */}
                {/* <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Teacher ID</th> */}
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Sessional Type</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Total Marks</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginate(filteredData, currentPage, entries).map((record, index) => (
                <tr key={record.id} className="border-b">
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{index + 1 + (currentPage - 1) * entries}</td>
                  {/* <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{record.course_id}</td> */}
                  {/* <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{record.teacher_id}</td> */}
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{record.Sessional_type}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{record.TotalMarks}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>

                    <button
                      onClick={() => handleSee(record.id)} 
                      className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md mx-2"
                    >
                      <FaEye />
                    </button>

                    <button
                      onClick={() => handleDelete(record.id)} // Delete the record
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-md"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1 || filteredData.length === 0}
            className="px-4 py-2 bg-gray-300 text-sm font-medium text-gray-700 rounded-md"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || filteredData.length === 0}
            className="px-4 py-2 bg-gray-300 text-sm font-medium text-gray-700 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default MarksDistribution;
