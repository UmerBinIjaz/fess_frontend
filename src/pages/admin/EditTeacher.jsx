import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";

const EditTeacher = () => {
    const { teacherId } = useParams(); // Extract the Teacher ID from the URL
    const { darkMode, setDarkMode } = useDarkMode();
    const { user, token } = useContext(AuthContext); // Use the authentication context for authorization
    const [selectedTeacher, setSelectedTeacher] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null);
    const navigate = useNavigate();
  

  // Fetch Teacher details
  useEffect(() => {
    const fetchTeacher = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            `https://fess-backend-6787.onrender.com/api/admin/teacher/${teacherId}`, // Pass TeacherId in the URL
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include token in the headers
              },
            }
          );
          setSelectedTeacher(response.data); // Set the fetched Teacher data
        } catch (err) {
          setError(err.response?.data?.error || 'Something went wrong');
        }
      }
    };

    if (teacherId) fetchTeacher();
  }, [teacherId, user, token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedTeacher((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission to update teacher
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `https://fess-backend-6787.onrender.com/api/admin/teacher/${teacherId}`, // Update teacher by ID
        selectedTeacher, // Send updated teacher data
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );
      setMessage('Teacher updated successfully!');
      setIsSuccess(true);
      setTimeout(() => navigate('/admin/teachers'), 2000); // Redirect to teacher list
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to update teacher');
      setIsSuccess(false);
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-3xl mx-auto p-6 rounded-lg shadow-md ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
      <h2 className="text-lg font-medium mb-4 text-blue-500">Edit Teacher</h2>

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
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Name</label>
          <input
            type="text"
            name="name"
            value={selectedTeacher.name || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>

        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Reg</label>
          <input
            type="text"
            name="reg"
            value={selectedTeacher.reg || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div> */}

        <div className="mb-4">
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Email</label>
          <input
            type="email"
            name="email"
            value={selectedTeacher.email || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/teachers')}
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

export default EditTeacher;
