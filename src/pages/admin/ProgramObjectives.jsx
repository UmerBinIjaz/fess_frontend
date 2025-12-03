import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";


const ProgramObjectives = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();  
  const [ProgramObjectives, setGraduateAttributes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(10); // Number of rows per page
  const [filteredData, setFilteredData] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);

  const navigate = useNavigate();

  // Fetch ProgramObjectives data
  useEffect(() => {
    const fetchProgramObjectives = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            'https://fess-backend-6787.onrender.com/api/admin/ProgramObjectives', // Adjust the endpoint as needed
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
          console.error('Error fetching ProgramObjectives:', error);
        }
      }
    };

    fetchProgramObjectives();
  }, [user, token]);

// Handle search
useEffect(() => {
  if (!ProgramObjectives || ProgramObjectives.length === 0) {
    setFilteredData([]);
    return;
  }

  const result = ProgramObjectives.filter(po =>
    (po.objective_name && po.objective_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (po.description && po.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (po.program_name && po.program_name.toLowerCase().includes(searchTerm.toLowerCase())) 
  );

  setFilteredData(result);
}, [searchTerm, ProgramObjectives]);

  
  // Handle delete ProgramObjectives
  const handleDelete = async (ProgramObjectivesId) => {
    try {
      const response = await axios.delete(
        `https://fess-backend-6787.onrender.com/api/admin/delete-ProgramObjectives/${ProgramObjectivesId}`, // Endpoint for deleting a ProgramObjectives
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('ProgramObjectives Deleted Successfully');
      setIsSuccess(true);
      setGraduateAttributes(ProgramObjectives.filter(ProgramObjectives => ProgramObjectives.id !== ProgramObjectivesId)); // Remove ProgramObjectives from state
      setFilteredData(filteredData.filter(ProgramObjectives => ProgramObjectives.id !== ProgramObjectivesId)); // Update filtered data
    } catch (error) {
      setMessage('Failed to delete ProgramObjectives');
      setIsSuccess(false);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex justify-start">  
          <a href="/admin/obe/create-po" className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5'>Create Program Objectives</a>
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
          <h6 className="m-0 font-medium text-base text-blue-500">All ProgramObjectives</h6>
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
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Importance Level</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Program Name</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Description</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Actions</th>
            </tr>
          </thead>


          <tbody>
            {filteredData && filteredData.length > 0 ? (
                filteredData.slice(0, entries).map((ProgramObjectives, index) => (
                <tr key={ProgramObjectives.id} className="border-b">
                    <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    {index + 1}
                    </td>
                    <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    {ProgramObjectives.objective_name}
                    </td>
                    <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    {ProgramObjectives.importance_level}
                    </td>
                    <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    {ProgramObjectives.program_name}
                    </td>
                    <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    {ProgramObjectives.description}
                    </td>

                    <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                    <button
                        onClick={() => handleDelete(ProgramObjectives.id)}
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

export default ProgramObjectives;
