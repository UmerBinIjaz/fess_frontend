import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const CreateCourse = () => {
  const { user, token } = useContext(AuthContext); // Use context to get user data and token
  const [courseName, setCourseName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Track if message is success or error

  const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Regex pattern to validate course name
  const courseNamePattern = /^[A-Z]{2,3}-\d{3} [A-Za-z ]+\s\(Morning|Evening|Morning \+ Evening\)$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the course name format
    if (!courseNamePattern.test(courseName)) {
      setMessage('Invalid course name format. Please follow the pattern "XX-XXX Name (Shift)".');
      setIsSuccess(false);
      return;
    }

    // Generate a unique class code
    const uniqueClassCode = generateClassCode();
    setClassCode(uniqueClassCode);

    if (!user || !token) {
      setMessage('User is not authenticated');
      setIsSuccess(false);
      return;
    }

    // Send request to create course using teacher's ID from AuthContext
    axios
      .post(
        'http://localhost:5000/api/teacher/create-course',
        {
          name: courseName,
          teacher_id: user.id, // Use the teacher's ID from the AuthContext
          class_code: uniqueClassCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token from AuthContext
          },
        }
      )
      .then((response) => {
        setMessage('Course Created Successfully!');
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error('Error details:', error.response ? error.response.data : error.message);
        setMessage('Error in Creating a Course');
        setIsSuccess(false);
      });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Course</h2>
          <div className="text-sm text-gray-500">
            <a href="/" className="hover:underline">Home</a> / Create Course
          </div>
        </div>  
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="courseName" className="block text-gray-700 text-sm font-bold mb-2">
                Course Name
              </label>

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

              <input
                type="text"
                id="courseName"
                placeholder="Enter course name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                style={{ width: '100%' }}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create
            </button>
          </form>
        </div>             
      </>
  );
};

export default CreateCourse;
