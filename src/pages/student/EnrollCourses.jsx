import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import { useDarkMode } from "../../context/DarkModeContext";

const EnrollCourse = ({ studentId }) => {
  const { user, token } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useDarkMode();
  const [classCode, setClassCode] = useState('');
  const [message, setMessage] = useState('');  
  const [isSuccess, setIsSuccess] = useState(null); // Track if message is success or error
  
  const handleEnroll = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://fess-backend-6787.onrender.com/api/student/enroll', {
        class_code: classCode,
        student_id: user.id,
      });
      
      setMessage(response.data.message); // Set the success message from the server
      setIsSuccess(false); // Indicate success

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while enrolling in the course.', error);
      }
      setIsSuccess(true);
    }
  };

  return (
    // <form onSubmit={handleEnroll}>
      // <input
      //   type="text"
      //   placeholder="Enter Class Code"
      //   value={classCode}
      //   onChange={(e) => setClassCode(e.target.value)}
      //   required
      // />
    //   <button type="submit">Enroll</button>
    // </form>


    <>
      <div className={`rounded-lg shadow-md p-6 ${darkMode ? "bg-college-navy" : "bg-white"}`}>
        <h6 className={`m-0 font-medium text-base  ${darkMode ? "text-white" : "text-blue-500"}`}>Enroll Courses</h6>
        <form onSubmit={handleEnroll}>
          <div className="mb-6 mt-6">
              <label htmlFor="courseName" className={`block text-sm font-bold mb-5 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Enter Class Number
              </label>
              {message && (
              <div
                  className={`text-center my-4 text-sm px-4 py-2 rounded ${
                    isSuccess ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}
                  style={{ width: '100%' }}
                >
                  {message}
                </div>
              )}

              <input
                type="text"
                placeholder="Enter Class Code"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Enroll 
          </button>    
        </form>
      </div>
    
    </>
  );
};

export default EnrollCourse;
