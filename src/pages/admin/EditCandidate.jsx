import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from "../../context/DarkModeContext";

const EditCandidate = () => {
  const { candidateId } = useParams(); // Extract the candidate ID from the URL
  const { darkMode } = useDarkMode();
  const { user, token } = useContext(AuthContext); // Use the authentication context for authorization
  const [error, setError] = useState(null);

  const [selectedCandidate, setSelectedCandidate] = useState({
    name: '',
    class: '',
    section: '',
    house_group: '',
    symbol: '',
    designation: ''
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);
  const navigate = useNavigate();

  // Fetch candidate details
  useEffect(() => {
    const fetchCandidate = async () => {
      if (user && token) {
        try {
          const response = await axios.post(
            `https://fess-backend-6787.onrender.com/api/admin/candidate/${candidateId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSelectedCandidate(response.data);
        } catch (err) {
          setError(err.response?.data?.error || 'Something went wrong');
        }
      }
    };

    fetchCandidate();
  }, [candidateId, user, token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCandidate((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission to update candidate
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `https://fess-backend-6787.onrender.com/api/admin/candidate/${candidateId}`,
        selectedCandidate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Candidate updated successfully!');
      setIsSuccess(true);
      setTimeout(() => navigate('/admin/candidates'), 2000); // Redirect after success
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to update candidate');
      setIsSuccess(false);
    }
  };

  return (
    <div className={`max-w-3xl mx-auto p-6 rounded-lg shadow-md ${darkMode ? "bg-college-navy" : "bg-white text-gray-900"}`}>
      <h2 className="text-lg font-medium mb-4 text-blue-500">Edit Candidate</h2>

      {message && (
        <div
          className={`text-center mb-4 text-sm px-4 py-2 rounded ${isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
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
            value={selectedCandidate.name || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>

        <select
          name="gender"
          value={selectedCandidate.gender || ""}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="M">M</option>
          <option value="F">F</option>
        </select>



        <div className="mb-4">
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Class</label>
          <input
            type="text"
            name="class"
            value={selectedCandidate.class || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Section</label>
          <input
            type="text"
            name="section"
            value={selectedCandidate.section || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>House Group</label>
          <input
            type="text"
            name="house_group"
            value={selectedCandidate.house_group || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Symbol</label>
          <input
            type="text"
            name="symbol"
            value={selectedCandidate.symbol || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className={`block text-sm font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>Designation</label>
          <input
            type="text"
            name="designation"
            value={selectedCandidate.designation || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/candidates')}
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

export default EditCandidate;
