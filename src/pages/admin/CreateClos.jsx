import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Select from 'react-select'; // For dropdowns
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import { useDarkMode } from "../../context/DarkModeContext";

const CreateClos = () => {
  const { user, token } = useContext(AuthContext); // Use context to get user data and token
  const { darkMode, setDarkMode } = useDarkMode();
  const [programObjectives, setProgramObjectives] = useState([]); // List of Program Objectives
  const [selectedProgramObjective, setSelectedProgramObjective] = useState(null); // Selected Program Objective
  const [cloName, setCLOName] = useState(''); // CLO Name
  const [cloDescription, setCLODescription] = useState(''); // CLO Description
  const [cloImportanceLevel, setCLOImportanceLevel] = useState(''); // CLO Importance Level
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null); // Track if message is success or error

  // Fetch Program Objectives
  useEffect(() => {
    const fetchProgramObjectives = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            'https://fess-backend-6787.onrender.com/api/admin/ProgramObjectives',
            { adminId: user.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setProgramObjectives(response.data.map(po => ({
            value: po.id,
            label: po.objective_name,
          })));
        } catch (error) {
          setMessage(error.response?.data?.error || 'Failed to fetch Program Objectives');
        }
      }
    };
    fetchProgramObjectives();
  }, [user, token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProgramObjective || !cloName || !cloDescription || !cloImportanceLevel) {
      setMessage('All fields are required.');
      setIsSuccess(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://fess-backend-6787.onrender.com/api/admin/create-clo',
        {
          name: cloName,
          description: cloDescription,
          importance_level: cloImportanceLevel,
          program_objective_id: selectedProgramObjective.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('CLO Created Successfully!');
      setIsSuccess(true);
      // Clear form fields
      setCLOName('');
      setCLODescription('');
      setCLOImportanceLevel('');
      setSelectedProgramObjective(null);
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);
      setMessage('Error in Creating CLO');
      setIsSuccess(false);
    }
  };

  return (
    <div className={`rounded-lg shadow-md p-6 ${darkMode ? "bg-college-navy" : "bg-white"}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`m-0 font-medium text-base text-blue-500`}>Create New CLO</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Program Objective Dropdown */}
        <div className="mb-6">
          <label htmlFor="programObjective" className={`block mb-3 text-md font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
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

        {/* CLO Name Input */}
        <div className="mb-6">
          <label htmlFor="cloName" className={`block mb-3 text-md font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
            CLO Name
          </label>
          <input
            type="text"
            id="cloName"
            placeholder="Enter CLO Name"
            value={cloName}
            onChange={(e) => setCLOName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* CLO Description Input */}
        <div className="mb-6">
          <label htmlFor="cloDescription" className={`block mb-3 text-md font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
            CLO Description
          </label>
          <input
            type="text"
            id="cloDescription"
            placeholder="Enter CLO Description"
            value={cloDescription}
            onChange={(e) => setCLODescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* CLO Importance Level Input */}
        <div className="mb-6">
          <label htmlFor="cloImportanceLevel" className={`block mb-3 text-md font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>
            CLO Importance Level
          </label>
          <input
            type="text"
            id="cloImportanceLevel"
            placeholder="Enter CLO Importance Level"
            value={cloImportanceLevel}
            onChange={(e) => setCLOImportanceLevel(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          Create CLO
        </button>
      </form>
    </div>
  );
};

export default CreateClos;