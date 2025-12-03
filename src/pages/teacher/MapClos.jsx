import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select'; // For dropdowns
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";
import { FaEye } from 'react-icons/fa'

const MapClos = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const { courseId } = useParams(); // Extract courseId from the URL
  const [mappedCLOs, setMappedCLOs] = useState([]); // CLOs mapped to the course
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Track if message is success or error

  // /294/

  const handleSee = (id) => {
    window.location.href = `http://localhost:5173/teacher/course/${courseId}/StudentCloPerformance/clo/${id}/`;
  };
  
  // Fetch CLOs mapped to the course
  useEffect(() => {
    const fetchMappedCLOs = async () => {
      if (user && token) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/teacher/course/${courseId}/mapped-clos`,
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


  return (
    <>

      {/* Display Mapped CLOs */}
      <div className={`max-w-4xl mx-auto p-5 shadow-lg rounded-lg ${darkMode ? "bg-college-navy" : "bg-white"}`}>
        <h2 className={`text-lg font-medium mb-4 ${darkMode ? "text-white" : "text-blue-600"}`}>
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
                    <td>
                      <button
                        onClick={() => handleSee(clo.id)} 
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md mx-2"
                      >
                        <FaEye />
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