import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDarkMode } from "../../context/DarkModeContext";

const GraduateAttributes = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();  
  const [GraduateAttributes, setGraduateAttributes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(10); // Number of rows per page
  const [filteredData, setFilteredData] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);

  const navigate = useNavigate();

  // Fetch GraduateAttributes data
  useEffect(() => {
    const fetchGraduateAttributes = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            'https://fess-backend-6787.onrender.com/api/admin/GraduateAttributes', // Adjust the endpoint as needed
            { adminId: user.id }, // Send necessary data in the body if required
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setGraduateAttributes(response.data);
          setFilteredData(response.data);
        } catch (error) {
          console.error('Error fetching GraduateAttributes:', error);
        }
      }
    };

    fetchGraduateAttributes();
  }, [user, token]);

  // Handle search
  useEffect(() => {
    const result = GraduateAttributes.filter(attr =>
      attr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attr.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(result);
  }, [searchTerm, GraduateAttributes]);
  
  // Handle delete GraduateAttributes
  const handleDelete = async (GraduateAttributesId) => {
    try {
      const response = await axios.delete(
        `https://fess-backend-6787.onrender.com/api/admin/delete-GraduateAttributes/${GraduateAttributesId}`, // Endpoint for deleting a GraduateAttributes
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('GraduateAttributes Deleted Successfully');
      setIsSuccess(true);
      setGraduateAttributes(GraduateAttributes.filter(GraduateAttributes => GraduateAttributes.id !== GraduateAttributesId)); // Remove GraduateAttributes from state
      setFilteredData(filteredData.filter(GraduateAttributes => GraduateAttributes.id !== GraduateAttributesId)); // Update filtered data
    } catch (error) {
      setMessage('Failed to delete GraduateAttributes');
      setIsSuccess(false);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex justify-start">  
          <a href="/admin/obe/create-ga" className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5'>Create Graduate Attributes</a>
        </div>
        {/* <div className="flex justify-end">
          <button
            onClick={() => setShowImportModal(true)}
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Bulk Import Student
          </button>
        </div> */}
      </div>


      {/* Search Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex justify-start sm:justify-start items-center">
          <h6 className="m-0 font-medium text-base text-blue-500">All GraduateAttributes</h6>
        </div>
        <div className="flex justify-start sm:justify-end">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-full sm:w-auto max-w-xs border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
      </div>


      {message && (
        <div
          className={`text-center mt-4 text-sm px-4 py-2 rounded ${
            isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}
        >
          {message}
        </div>
      )}



      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>ID</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Name</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Description</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.slice(0, entries).map((GraduateAttributes, index) => (
                <tr key={GraduateAttributes.id} className="border-b">
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    {index + 1}
                  </td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    {GraduateAttributes.name}
                  </td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    {GraduateAttributes.description}
                  </td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    <button
                      onClick={() => handleDelete(GraduateAttributes.id)}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-md"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center mt-4 text-sm px-4 py-2 rounded bg-red-100 text-red-600">
                  No Record Found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default GraduateAttributes;
