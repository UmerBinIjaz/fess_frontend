import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDarkMode } from "../../context/DarkModeContext";

const CLOs = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const [clos, setCLOs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(10); // Number of rows per page
  const [filteredData, setFilteredData] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);

  const navigate = useNavigate();

  // Fetch CLOs data
  useEffect(() => {
    const fetchCLOs = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            'https://fess-backend-6787.onrender.com/api/admin/fetch-clos',
            { adminId: user.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCLOs(response.data);
          setFilteredData(response.data);
        } catch (error) {
          console.error('Error fetching CLOs:', error);
        }
      }
    };

    fetchCLOs();
  }, [user, token]);

  // Handle search
  useEffect(() => {
    const result = clos.filter(clo =>
      clo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clo.program_objective_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(result);
  }, [searchTerm, clos]);

  // Handle delete CLO
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://fess-backend-6787.onrender.com/api/admin/delete-clo/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('CLO deleted successfully!');
      setIsSuccess(true);
      setCLOs(clos.filter(clo => clo.id !== id)); // Remove from state
      setFilteredData(filteredData.filter(clo => clo.id !== id)); // Update filtered data
    } catch (error) {
      setMessage('Failed to delete CLO.');
      setIsSuccess(false);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex justify-start">
          <a href="/admin/obe/create-clos" className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5'>
            Create CLO
          </a>
        </div>
      </div>

      {/* Search Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex justify-start sm:justify-start items-center">
          <h6 className="m-0 font-medium text-base text-blue-500">All CLOs</h6>
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

      {/* Message Display */}
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
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Importance Level</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Program Objective</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.slice(0, entries).map((clo, index) => (
                <tr key={clo.id} className="border-b">
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{index + 1}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{clo.name}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{clo.description}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{clo.importance_level}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{clo.program_objective_name}</td>
                  <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    <button
                      onClick={() => handleDelete(clo.id)}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-md"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center mt-4 text-sm px-4 py-2 rounded bg-red-100 text-red-600">
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

export default CLOs;