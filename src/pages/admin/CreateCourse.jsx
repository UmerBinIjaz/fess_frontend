import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Select from 'react-select';  // Import react-select
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";


const CreateCourse = () => {
  const { user, token } = useContext(AuthContext); // Use context to get user data and token
  const { darkMode, setDarkMode } = useDarkMode();
  const [courseName, setCourseName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Track if message is success or error
  const [programs, setPrograms] = useState ([]);
  const [selectedProgram, setSelectedProgram] = useState(null);  
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
    if (!selectedProgram) {
      setError('Please select a program.');
      return;
    }

    // Send request to create course using admin's ID from AuthContext
    axios
      .post(
        'https://fess-backend-6787.onrender.com/api/admin/create-course',
        {
          name: courseName,
          class_code: uniqueClassCode,
          ProgramId: selectedProgram.value,
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

  // Fetch students data
  useEffect(() => {
    const fetchPrograms = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            'https://fess-backend-6787.onrender.com/api/admin/programs',
            { adminId: user.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const options = response.data.map((programs) => ({
            value: programs.id,
            label: programs.name
          }));

          setPrograms(options);
        } catch (error) {
          setMessage(error.response?.data?.error || 'Failed to fetch students');
        }
      }
    };
    fetchPrograms();
  }, [user, token]);


  return (
    <>
      <div className={`rounded-lg shadow-md p-6 ${darkMode ? "bg-college-navy" : "bg-white"}`}> 
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Create New Course</h2>
          <div className={`text-sm text-gray-500  ${darkMode ? "text-white" : "text-gray-900"}`}>
            <a href="/" className="hover:underline">Home</a> / Create Course
          </div>
        </div>  
          <form onSubmit={handleSubmit}>
          
            <div className='mb-6'>
              <label htmlFor="courseName" className={`block text-sm font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Program Name
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


              <Select
                options={programs}
                value={selectedProgram}
                onChange={setSelectedProgram}
                placeholder="Select a Program..."
                isSearchable  // Enables search functionality
                className="mb-4"
              />
            </div>
            
            
            
            <div className="mb-6">
              <label htmlFor="courseName" className={`block text-sm font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Course Name
              </label>

              <input
                type="text"
                id="courseName"
                placeholder="Enter course name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
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
