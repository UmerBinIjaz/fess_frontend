import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Select from 'react-select';  // Import react-select
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import { useDarkMode } from "../../context/DarkModeContext";
import { DarkMode } from "@mui/icons-material";


const CreateGraduateAttributes = () => {
  const { user, token } = useContext(AuthContext); // Use context to get user data and token
  const { darkMode, setDarkMode } = useDarkMode();
  const [gaName, setName] = useState('');
  const [gaDesciption, setDesciption] = useState('');  
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Track if message is success or error



  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!user || !token) {
      setMessage('User is not authenticated');
      setIsSuccess(false);
      return;
    }
    if (!gaName || !gaDesciption ) {
      setMessage('All fields are required');
      setIsSuccess(false);        
    //   setIsSuccess('All fields are required.');
      return;
    }

    // Send request to create Graduate Attributes using admin's ID from AuthContext
    axios
      .post(
        'https://fess-backend-6787.onrender.com/api/admin/CreateGraduateAttributes',
        {
          name: gaName,
          Description: gaDesciption,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token from AuthContext
          },
        }
      )
      .then((response) => {
        setMessage('Graduate Attributes Created Successfully!');
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error('Error details:', error.response ? error.response.data : error.message);
        setMessage('Error in Creating a Graduate Attributes');
        setIsSuccess(false);
      });
  };

  return (
    <>
      <div className={`rounded-lg shadow-md p-6 ${darkMode ? "bg-college-navy" : "bg-white"}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`m-0 font-medium text-base text-blue-500`}>Create New Graduate Attributes</h2>
        </div>  
          <form onSubmit={handleSubmit}>    
            
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
            
            <div className="mb-6">
              <label htmlFor="gaName" className={`block mb-4 text-md font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                Graduate Attributes Title
              </label>

              <input
                type="text"
                id="gaName"
                placeholder="Enter Graduate Attributes Title"
                value={gaName}
                onChange={(e) => setName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                style={{ width: '100%' }}
              />
            </div>


            <div className="mb-6">
              <label htmlFor="gaDesciption" className={`block mb-4 text-md font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
                Graduate Attributes Description
              </label>

              <input
                type="text"
                id="gaDesciption"
                placeholder="Enter Graduate Attributes Description"
                value={gaDesciption}
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

export default CreateGraduateAttributes;
