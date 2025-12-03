import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";


const EditProfile = () => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const [teacherName, setTeacherName] = useState(user.name);
  const [teacherEmail, setTeacherEmail] = useState(user.email);
  const [teacherPass, setTeacherPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);
  const [error, setError] = useState('');

  const handleEditTeacherInfo = async (event) => {
    event.preventDefault();

    if (!teacherName || !teacherEmail || !teacherPass) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/teacher/editProfile/',
        { teacherId: user.id, teacherName, teacherEmail, teacherPass },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Profile updated successfully');
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
      setIsSuccess(false);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 rounded ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
      <div className='flex'>
        <h3 className='m-0 font-medium text-base text-blue-500'>Edit Profile</h3>
      </div>

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

      {error && (
        <div className="text-center bg-red-100 text-red-600 p-2 rounded-md mb-4">
          {error}
        </div>
      )}


      <form onSubmit={handleEditTeacherInfo}>
        <div className="mb-6 mt-6">
          <label htmlFor="teacherName" className={`block text-sm font-bold mb-2 ${darkMode ? "text-white" : "text-gray-700"}`}>
            Teacher Name
          </label>
          <input
            type="text"
            id="teacherName"
            placeholder="Enter Teacher name"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            style={{ width: '100%' }}
          />
        </div>

        <div className="mb-6 mt-6">
          <label htmlFor="teacherEmail" className={`block text-sm font-bold mb-2 ${darkMode ? "text-white" : "text-gray-700"}`}>
            Teacher Email
          </label>
          <input
            type="email"
            id="teacherEmail"
            placeholder="Enter Teacher email"
            value={teacherEmail}
            onChange={(e) => setTeacherEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            style={{ width: '100%' }}
          />
        </div>

        <div className="mb-6 mt-6">
          <label htmlFor="teacherPass" className={`block text-sm font-bold mb-2 ${darkMode ? "text-white" : "text-gray-700"}`}>
            Teacher Password
          </label>
          <input
            type="password"
            id="teacherPass"
            placeholder="Enter Teacher password"
            value={teacherPass}
            onChange={(e) => setTeacherPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            style={{ width: '100%' }}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-6 py-2.5 mt-4"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
