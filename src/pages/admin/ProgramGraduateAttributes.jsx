import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDarkMode } from "../../context/DarkModeContext";

const ProgramGraduateAttributes = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const [programGraduateAttributes, setProgramGraduateAttributes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(10); // Number of rows per page
  const [filteredData, setFilteredData] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);

  const navigate = useNavigate();

  // Fetch Program Graduate Attributes data
  useEffect(() => {
    const fetchProgramGraduateAttributes = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            'https://fess-backend-6787.onrender.com/api/admin/ProgramGraduateAttributes',
            { adminId: user.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setProgramGraduateAttributes(response.data);
          setFilteredData(response.data);
        } catch (error) {
          console.error('Error fetching Program Graduate Attributes:', error);
        }
      }
    };

    fetchProgramGraduateAttributes();
  }, [user, token]);

  // Handle search
  useEffect(() => {
    const result = programGraduateAttributes.filter(pga =>
      pga.program_objective_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pga.graduate_attribute_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(result);
  }, [searchTerm, programGraduateAttributes]);

  // Handle delete Program Graduate Attribute mapping
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://fess-backend-6787.onrender.com/api/admin/delete-ProgramGraduateAttributes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Program Graduate Attribute mapping deleted successfully!');
      setIsSuccess(true);
      setProgramGraduateAttributes(programGraduateAttributes.filter(pga => pga.id !== id)); // Remove from state
      setFilteredData(filteredData.filter(pga => pga.id !== id)); // Update filtered data
    } catch (error) {
      setMessage('Failed to delete Program Graduate Attribute mapping.');
      setIsSuccess(false);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex justify-start">
          <a href="/admin/obe/create-pga/" className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5'>
            Create Program Graduate Attribute
          </a>
        </div>
      </div>

      {/* Search Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex justify-start sm:justify-start items-center">
          <h6 className="m-0 font-medium text-base text-blue-500">All Program Graduate Attributes</h6>
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
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Program Objective</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Graduate Attribute</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Actions</th>
            </tr>
          </thead>



          <tbody>
            {filteredData && filteredData.length > 0 ? (
                filteredData.slice(0, entries).map((pga, index) => (
                <tr key={pga.id} className="border-b">
                    <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    {index + 1}
                    </td>
                    <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    {pga.program_objective_name}
                    </td>
                    <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    {pga.graduate_attribute_name}
                    </td>

                    <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    <button
                        onClick={() => handleDelete(pga.id)}
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

export default ProgramGraduateAttributes;