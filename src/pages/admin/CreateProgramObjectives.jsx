import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Select from 'react-select';  // Import react-select
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";


const CreateProgramObjectives = () => {
  const { user, token } = useContext(AuthContext); // Use context to get user data and token
  const { darkMode, setDarkMode } = useDarkMode();
  const [poName, setpoName] = useState('');
  const [poImportanceLevel, setImportanceLevel] = useState('');
  const [poDesciption, setDesciption] = useState('');  
  const [classCode, setClassCode] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Track if message is success or error
  const [programs, setPrograms] = useState ([]);
  const [selectedProgram, setSelectedProgram] = useState(null);  

  // Regex pattern to validate Program Objective name
  const courseNamePattern = /^[A-Z]{2,3}-\d{3} [A-Za-z ]+\s\(Morning|Evening|Morning \+ Evening\)$/;

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!user || !token) {
      setMessage('User is not authenticated');
      setIsSuccess(false);
      return;
    }
    if (!selectedProgram || !poName) {
      setError('All fields are required.');
      return;
    }

    // Send request to create Program Objective using admin's ID from AuthContext
    axios
      .post(
        'https://fess-backend-6787.onrender.com/api/admin/create-po',
        {
          name: poName,
          ImportanceLevel: poImportanceLevel,
          Desciption: poDesciption,
          ProgramId: selectedProgram.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token from AuthContext
          },
        }
      )
      .then((response) => {
        setMessage('Program Objective Created Successfully!');
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error('Error details:', error.response ? error.response.data : error.message);
        setMessage('Error in Creating a Program Objective');
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
          <h2 className={`m-0 font-medium text-base text-blue-500`}>Create New Program Objective</h2>
        </div>  
          <form onSubmit={handleSubmit}>
          
            <div className='mb-6'>
              <label htmlFor="poName" className={`block mb-4 text-md font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
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
                className={`mb-4`}
              />
            </div>
            
            
            
            <div className="mb-6">
              <label htmlFor="poName" className={`block mb-4 text-md font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                Program Objective Title
              </label>

              <input
                type="text"
                id="poName"
                placeholder="Enter Program Objective Title"
                value={poName}
                onChange={(e) => setpoName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                style={{ width: '100%' }}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="poImportanceLevel" className={`block mb-4 text-md font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                Program Objective Importance Level
              </label>

              <input
                type="text"
                id="poImportanceLevel"
                placeholder="Enter Program Objective Importance Level"
                value={poImportanceLevel}
                onChange={(e) => setImportanceLevel(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                style={{ width: '100%' }}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="poName" className={`block mb-4 text-md font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                Program Objective Description
              </label>

              <input
                type="text"
                id="poDesciption"
                placeholder="Enter Program Objective Description"
                value={poDesciption}
                onChange={(e) => setDesciption(e.target.value)}
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

export default CreateProgramObjectives;
