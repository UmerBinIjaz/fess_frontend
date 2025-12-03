import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";

const CheckAllTeachers = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();  
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(10); // Number of rows per page
  const [filteredData, setFilteredData] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);

  const navigate = useNavigate();

  // Fetch teachers data
  useEffect(() => {
    const fetchTeachers = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            'https://fess-backend-6787.onrender.com/api/admin/teachers', // Adjust the endpoint as needed
            { adminId: user.id }, // Send necessary data in the body if required
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setTeachers(response.data);
          setFilteredData(response.data);
        } catch (error) {
          console.error('Error fetching teachers:', error);
        }
      }
    };

    fetchTeachers();
  }, [user, token]);

  // Handle search
  useEffect(() => {
    const result = teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(result);
  }, [searchTerm, teachers]);

  // Handle delete teacher
  const handleDelete = async (teacherId) => {
    try {
      const response = await axios.delete(
        `https://fess-backend-6787.onrender.com/api/admin/delete-teacher/${teacherId}`, // Endpoint for deleting a teacher
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Teacher Deleted Successfully');
      setIsSuccess(true);
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId)); // Remove teacher from state
      setFilteredData(filteredData.filter(teacher => teacher.id !== teacherId)); // Update filtered data
    } catch (error) {
      setMessage('Failed to delete teacher');
      setIsSuccess(false);
    }
  };

  return (
    <div  className={`max-w-7xl mx-auto p-6 ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
      {/* Search Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex justify-start sm:justify-start items-center">
          <h6 className="m-0 font-medium text-base text-blue-500">All Teachers</h6>
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
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Email</th>
              <th className={`py-2 px-4 text-left text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(0, entries).map((teacher, index) => (
              <tr key={teacher.id} className="border-b">
                <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{index + 1}</td>
                <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{teacher.name}</td>
                <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>{teacher.email}</td>
                <td className={`py-2 px-4 text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                  {/* Edit and Delete Buttons */}
                  <button
                    onClick={() => navigate(`../edit-teacher/${teacher.id}/`)} // Navigate to edit teacher page
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.id)} // Delete the teacher
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
    </div>
  );
};

export default CheckAllTeachers;
