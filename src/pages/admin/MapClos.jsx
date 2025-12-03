import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select'; // For dropdowns
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";

const MapClos = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const { courseId } = useParams(); // Extract courseId from the URL
  const [clos, setCLOs] = useState([]); // List of available CLOs
  const [selectedCLOs, setSelectedCLOs] = useState([]); // Selected CLOs
  const [mappedCLOs, setMappedCLOs] = useState([]); // CLOs mapped to the course
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Track if message is success or error

  // Fetch available CLOs
  useEffect(() => {
    const fetchCLOs = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            `https://fess-backend-6787.onrender.com/api/admin/fetch-clos`,
            { adminId: user.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // Convert to react-select format
          const options = response.data.map((clo) => ({
            value: clo.id,
            label: clo.name,
          }));
          setCLOs(options);
        } catch (err) {
          setMessage('Failed to fetch CLOs.');
          setIsSuccess(false);
        }
      }
    };
    fetchCLOs();
  }, [user, token]);

  
  // Fetch CLOs mapped to the course
  useEffect(() => {
    const fetchMappedCLOs = async () => {
      if (user && token) {
        try {
          const response = await axios.get(
            `https://fess-backend-6787.onrender.com/api/admin/course/${courseId}/mapped-clos`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMappedCLOs(response.data);
        } catch (err) {
          setMessage('Failed to fetch mapped CLOs.');
          setIsSuccess(false);
        }
      }
    };
    fetchMappedCLOs();
  }, [user, token, courseId]);


  // Handle delete CLO
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://fess-backend-6787.onrender.com/api/admin/course/${courseId}/delete-mapped-clos/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Mapped CLO deleted successfully!');
      setIsSuccess(true);
      setMappedCLOs(mappedCLOs.filter(mappedclo => mappedclo.id !== id)); // Remove from state
      setFilteredData(filteredData.filter(mappedclo => mappedclo.id !== id)); // Update filtered data
    } catch (error) {
      setMessage('Failed to delete Mapped CLO.');
      setIsSuccess(false);
    }
  };  


  // Map selected CLOs to the course
  const handleMapCLOs = async () => {
    if (!selectedCLOs || selectedCLOs.length === 0) {
      setMessage('Please select at least one CLO.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `https://fess-backend-6787.onrender.com/api/admin/course/${courseId}/map-clos`,
        { cloIds: selectedCLOs.map(clo => clo.value) }, // Send array of CLO IDs
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('CLOs mapped to the course successfully!');
      setIsSuccess(true);
      setSelectedCLOs([]); // Clear selected CLOs
      // Refresh the list of mapped CLOs
      const response = await axios.get(
        `https://fess-backend-6787.onrender.com/api/admin/course/${courseId}/mapped-clos`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMappedCLOs(response.data);
    } catch (err) {
      setMessage('Failed to map CLOs to the course.');
      setIsSuccess(false);
    }
    setLoading(false);
  };

  return (
    <>
      <div className={`max-w-4xl mx-auto p-5 shadow-lg rounded-lg ${darkMode ? "bg-college-navy" : "bg-white"}`}>
        <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-blue-600"}`}>
          Map CLOs to Course
        </h2>

        {/* Message Display */}
        {message && (
          <div
            className={`text-center my-4 text-sm px-4 py-2 rounded ${
              isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
            style={{ width: '100%' }}
          >
            {message}
          </div>
        )}

        {/* React-Select Dropdown */}
        <Select
          options={clos}
          value={selectedCLOs}
          onChange={setSelectedCLOs}
          placeholder="Select CLOs..."
          isMulti // Allow multiple selections
          isSearchable // Enable search functionality
          className="mb-4"
        />

        {/* Map CLOs Button */}
        <button
          onClick={handleMapCLOs}
          className={`bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50 ${
            darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-700 hover:bg-blue-800"
          }`}
          disabled={loading}
        >
          {loading ? 'Mapping...' : 'Map CLOs'}
        </button>
      </div>

      {/* Display Mapped CLOs */}
      <div className={`max-w-4xl mx-auto p-5 shadow-lg rounded-lg ${darkMode ? "bg-college-navy" : "bg-white"}`}>
        <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-blue-600"}`}>
          Mapped CLOs for Course
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className='bg-blue-300'>
              <tr className="border-b">
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Sr No</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>CLO Title</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Course Name</th>
                <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {mappedCLOs.length > 0 ? (
                mappedCLOs.map((clo, index) => (
                  <tr key={clo.id} className="border-b">
                    <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{index + 1}</td>
                    <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{clo.name}</td>
                    <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{clo.course_name}</td>
                    <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                      <button
                        onClick={() => handleDelete(clo.id)} // Add delete functionality if needed
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center mt-4 text-sm px-4 py-2 rounded bg-red-100 text-red-600">
                    No CLOs mapped to this course.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MapClos;