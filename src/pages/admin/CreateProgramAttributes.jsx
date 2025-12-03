import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Select from 'react-select'; // For dropdowns
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import { useDarkMode } from "../../context/DarkModeContext";

const CreateProgramAttributes = () => {
  const { user, token } = useContext(AuthContext); // Use context to get user data and token
  const { darkMode, setDarkMode } = useDarkMode();
  const [programs, setPrograms] = useState([]); // List of Programs
  const [graduateAttributes, setGraduateAttributes] = useState([]); // List of Graduate Attributes
  const [selectedProgram, setSelectedProgram] = useState(null); // Selected Program
  const [selectedGraduateAttribute, setSelectedGraduateAttribute] = useState(null); // Selected Graduate Attribute
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Track if message is success or error

  // Fetch Programs and Graduate Attributes
  useEffect(() => {
    const fetchData = async () => {
      if (user && token) {
        try {
          // Fetch Programs
          const programsResponse = await axios.post(
            'https://fess-backend-6787.onrender.com/api/admin/programs',
            { adminId: user.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setPrograms(programsResponse.data.map(program => ({
            value: program.id,
            label: program.name,
          })));

          // Fetch Graduate Attributes
          const gaResponse = await axios.post(
            'https://fess-backend-6787.onrender.com/api/admin/GraduateAttributes',
            { adminId: user.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setGraduateAttributes(gaResponse.data.map(ga => ({
            value: ga.id,
            label: ga.name,
          })));
        } catch (error) {
          setMessage(error.response?.data?.error || 'Failed to fetch data');
        }
      }
    };
    fetchData();
  }, [user, token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProgram || !selectedGraduateAttribute) {
      setMessage('Please select both Program and Graduate Attribute.');
      setIsSuccess(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://fess-backend-6787.onrender.com/api/admin/createProgramAttributes',
        {
          program_id: selectedProgram.value,
          graduate_attributes_id: selectedGraduateAttribute.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Program Attribute Created Successfully!');
      setIsSuccess(true);
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);
      setMessage('Error in Creating Program Attribute');
      setIsSuccess(false);
    }
  };

  return (
    <div className={`rounded-lg shadow-md p-6 ${darkMode ? "bg-college-navy" : "bg-white"}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`m-0 font-medium text-base text-blue-500`}>Create New Program Attribute</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Program Dropdown */}
        <div className="mb-6">
          <label htmlFor="program" className={`block mb-4 text-md font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
            Program
          </label>
          <Select
            options={programs}
            value={selectedProgram}
            onChange={setSelectedProgram}
            placeholder="Select a Program..."
            isSearchable
            className="mb-4"
          />
        </div>

        {/* Graduate Attribute Dropdown */}
        <div className="mb-6">
          <label htmlFor="graduateAttribute" className={`block mb-4 text-md font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
            Graduate Attribute
          </label>
          <Select
            options={graduateAttributes}
            value={selectedGraduateAttribute}
            onChange={setSelectedGraduateAttribute}
            placeholder="Select a Graduate Attribute..."
            isSearchable
            className="mb-4"
          />
        </div>

        {/* Message Display */}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateProgramAttributes;