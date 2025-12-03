import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';  // Import react-select
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";

const CourseAssig = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const { courseId } = useParams();
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Track if message is success or error

  // Fetch available teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      if (user && token) {
        try {
          const response = await axios.get(
            `https://fess-backend-6787.onrender.com/api/admin/fetchteachers`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // Convert to react-select format
          const options = response.data.map((teacher) => ({
            value: teacher.id,
            label: teacher.name
          }));
          setTeachers(options);
        } catch (err) {
          // setError('Failed to fetch teachers.');
          setMessage('Failed TO Fetch Teachers');
          setIsSuccess(false);          
        }
      }
    };
    fetchTeachers();
  }, [user, token]);

  // Assign a teacher to the course
  const handleAssignTeacher = async () => {
    if (!selectedTeacher) {
      setError('Please select a teacher.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `https://fess-backend-6787.onrender.com/api/admin/course/${courseId}/assign-teacher`,
        { adminId: user.id, teacherId: selectedTeacher.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // setSuccessMessage('Teacher assigned successfully!');
      // setError('');
      setMessage('Teacher Assigned To This Course Successfully!');
      setIsSuccess(true);

    } catch (err) {
      // setError('Failed to assign teacher.');
      setMessage('Failed to assign teacher to Course');
      setIsSuccess(false);      
    }
    setLoading(false);
  };

  return (
    <div className={ `max-w-4xl mx-auto p-5 shadow-lg rounded-lg  ${darkMode ? "bg-college-navy" : "bg-white"}` }>
      <h2 className="text-lg font-semibold text-blue-600 mb-4">Assign Teacher to Course</h2>
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
        options={teachers}
        value={selectedTeacher}
        onChange={setSelectedTeacher}
        placeholder="Select a teacher..."
        isSearchable  // Enables search functionality
        className="mb-4"
      />

      <button
        onClick={handleAssignTeacher}
        className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Assigning...' : 'Assign Teacher'}
      </button>
    </div>
  );
};

export default CourseAssig;
