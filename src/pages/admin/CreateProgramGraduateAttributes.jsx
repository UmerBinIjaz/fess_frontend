import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Select from 'react-select'; // For dropdowns
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import { useDarkMode } from "../../context/DarkModeContext";

const CreateProgramGraduateAttributes = () => {
  const { user, token } = useContext(AuthContext); // Use context to get user data and token
  const { darkMode, setDarkMode } = useDarkMode();
  const [programObjectives, setProgramObjectives] = useState([]); // List of Program Objectives
  const [graduateAttributes, setGraduateAttributes] = useState([]); // List of Graduate Attributes
  const [selectedProgramObjective, setSelectedProgramObjective] = useState(null); // Selected Program Objective
  const [selectedGraduateAttribute, setSelectedGraduateAttribute] = useState(null); // Selected Graduate Attribute
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Track if message is success or error

  // Fetch Program Objectives and Graduate Attributes
  useEffect(() => {
    const fetchData = async () => {
      if (user && token) {
        try {
          // Fetch Program Objectives
          const poResponse = await axios.post(
            'https://fess-backend-6787.onrender.com/api/admin/ProgramObjectives',
            { adminId: user.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setProgramObjectives(poResponse.data.map(po => ({
            value: po.id,
            label: po.objective_name,
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

    if (!selectedProgramObjective || !selectedGraduateAttribute) {
      setMessage('Please select both Program Objective and Graduate Attribute.');
      setIsSuccess(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://fess-backend-6787.onrender.com/api/admin/createProgramGraduateAttribute',
        {
          program_objective_id: selectedProgramObjective.value,
          graduate_attributes_id: selectedGraduateAttribute.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Program Graduate Attribute Created Successfully!');
      setIsSuccess(true);
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);
      setMessage('Error in Creating Program Graduate Attribute');
      setIsSuccess(false);
    }
  };

  return (
    <div className={`rounded-lg shadow-md p-6 ${darkMode ? "bg-college-navy" : "bg-white"}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`m-0 font-medium text-base text-blue-500`}>Map Program Objective to Graduate Attribute</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Program Objective Dropdown */}
        <div className="mb-6">
          <label htmlFor="programObjective" className={`block mb-4 text-md font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
            Program Objective
          </label>
          <Select
            options={programObjectives}
            value={selectedProgramObjective}
            onChange={setSelectedProgramObjective}
            placeholder="Select a Program Objective..."
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
          Create Link
        </button>
      </form>
    </div>
  );
};

export default CreateProgramGraduateAttributes;