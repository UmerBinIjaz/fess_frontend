import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";


const EditStudent = () => {
  const { studentId } = useParams(); // Extract the student ID from the URL
  const { darkMode, setDarkMode } = useDarkMode();
  const { user, token } = useContext(AuthContext); // Use the authentication context for authorization
  const [error, setError] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState({
    name: '',
    reg: '',
    class_section: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);
  const navigate = useNavigate();

  // Fetch student details
  useEffect(() => {
    const fetchStudent = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            `https://fess-backend-6787.onrender.com/api/admin/student/${studentId}`, // Pass studentId in the URL
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include token in the headers
              },
            }
          );
          setSelectedStudent(response.data); // Set the fetched student data
        } catch (err) {
          setError(err.response?.data?.error || 'Something went wrong');
        }
      }
    };

    fetchStudent();
  }, [studentId, user, token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission to update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `https://fess-backend-6787.onrender.com/api/admin/student/${studentId}`, // Update student by ID
        selectedStudent, // Send updated student data
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      setMessage('Student updated successfully!');
      setIsSuccess(true);
      setTimeout(() => navigate('/admin/students'), 2000); // Redirect to student list after success
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to update student');
      setIsSuccess(false);
    }
  };

  return (
    <div  className={`max-w-3xl mx-auto p-6 rounded-lg shadow-md ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
      <h2 className="text-lg font-medium mb-4 text-blue-500">Edit Student</h2>

      {message && (
        <div
          className={`text-center mb-4 text-sm px-4 py-2 rounded ${
            isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label  className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Name</label>
          <input
            type="text"
            name="name"
            value={selectedStudent.name || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Reg</label>
          <input
            type="text"
            name="reg"
            value={selectedStudent.reg || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>



        <div className="mb-4">
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Class and Section</label>
          <input
            type="text"
            name="class_section"
            value={selectedStudent.class_section || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Password</label>
          <input
            type="password"
            name="password"
            value={selectedStudent.password || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/students')}
            className="px-4 py-2 mr-4 bg-gray-300 text-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;
